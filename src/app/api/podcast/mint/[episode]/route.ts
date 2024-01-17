/**
 * API handlers for the "/api/podcast/mint/[episode]" endpoint
 */

import {
  MINTABLE_DEFAULT,
  mintableEpisodes,
} from "@/lib/const/podcast/mintable";
import {
  SolanaSignInMessage,
  SolanaSignInMessageData,
  SolanaSignedMessageData,
} from "@/lib/solana/SignInMessage";
import { cookies } from "next/headers";

type UnderdogNFTMintResponse = {
  transactionId: string;
  nftId: number;
  projectId?: number;
};

type ApiPodcastMintInput = {
  message: SolanaSignInMessageData;
  signedData: SolanaSignedMessageData;
};

// export const POST = withUserAuth(async ({ req, session, params }) => {
export const POST = async (
  req: Request,
  { params }: { params: { episode: number } },
) => {
  try {
    const input: ApiPodcastMintInput = await req.json();

    // make sure the required env vars are set
    if (
      !process.env.UNDERDOG_PROJECT_ID ||
      !process.env.UNDERDOG_API_KEY ||
      !process.env.UNDERDOG_API_URL
    ) {
      throw new Error("Internal process auth error");
    }

    // ensure existence of the required input
    if (!input || !input.message || !input.signedData)
      throw new Error("Invalid Solana credentials provided");

    // ensure existence of the required input
    if (!params || !params.episode) {
      return new Response("Unable to locate mintable episode", {
        status: 400,
      });
    }

    // manually get the CSRF token since `getCsrfToken` seems to not work in NextJS app router?
    const cookieVal = cookies()
      .getAll()
      .find((item) => item.name.includes("next-auth.csrf-token"));
    const csrfToken = decodeURI(cookieVal?.value || "").split("|")[0];

    // parse the signed message provided within the request
    const signinMessage = new SolanaSignInMessage({
      signedData: input.signedData,
      message: input.message,
      // manually add in the enforced server data
      overrides: {
        nonce: csrfToken,
        // todo: domain?
      },
    });

    // actually validate/check the submitted message for the signature
    if (!signinMessage.verifyAny()) {
      return new Response("Could not validate the signed message", {
        status: 400,
      });
    }

    // get the mintable episode details and ensure one exists
    const mintable = mintableEpisodes[params.episode];
    if (!mintable) {
      return new Response("Episode is not mintable", {
        status: 400,
      });
    }

    // always force override the episode attribute with the actual episode number
    mintable.attributes.episode = mintable.episode;
    mintable.externalUrl = new URL(
      `/podcast/${mintable.episode}`,
      MINTABLE_DEFAULT.externalUrlRoot,
    ).toString();

    // todo: add more dynamic mintable functionality in the future
    // like multiple assets to mint, dynamic metadata, random selection, etc

    // todo: do some assorted pre-parsing of the episode details
    // like lower case all attributes, simple templated text replace

    // mint the nft via Underdog
    const mintRes = await fetch(
      new URL(
        `/v2/projects/${process.env.UNDERDOG_PROJECT_ID}/nfts`,
        process.env.UNDERDOG_API_URL,
      ),
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${process.env.UNDERDOG_API_KEY}`,
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          // delegated so we have authority on the nft
          delegated: MINTABLE_DEFAULT.delegated,
          symbol: MINTABLE_DEFAULT.symbol,
          name: mintable.name,
          description: mintable.description,
          image: mintable.image,
          animationUrl: mintable.animationUrl,
          externalUrl: mintable.externalUrl,
          attributes: mintable.attributes,
          // finally, the wallet that will actually get the nft
          receiverAddress: signinMessage.message.address,
        }),
      },
    ).then((res) => res.json() as Promise<UnderdogNFTMintResponse>);

    // ensure we get a valid response from the api
    if (!mintRes) {
      return new Response("Unable to create NFT :/", {
        status: 400,
      });
    }

    // success! yay :)
    return new Response("You have claimed this episode!");
  } catch (err) {
    console.warn("[API error]", err);

    return new Response("An unknown error occurred", {
      status: 400,
    });
  }
};
