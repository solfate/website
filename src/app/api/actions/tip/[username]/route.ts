import { TREASURY_PLATFORM_FEE, TREASURY_PUBKEY } from "@/lib/const/solana";
import { getUserProfile } from "@/lib/queries/users";
import { createTipSolTransaction } from "@/lib/solana/actions";
import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
  ActionPostRequest,
  createPostResponse,
  ActionPostResponse,
} from "@solana/actions";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// todo: support SPL tokens in the future
const tokenSymbol = "SOL";

const baseHref = "/api/actions/tip";

type RouteParams = {
  params: {
    username: string;
  };
};

export const GET = async (req: Request, { params }: RouteParams) => {
  try {
    if (!params.username)
      throw `Invalid username: ${params.username || "[none provided]"}`;

    // locate the user profile
    const profile = await getUserProfile({
      username: params.username,
      include: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!profile) {
      return Response.json(
        {
          message: "Profile not found",
        },
        {
          status: 404,
          headers: ACTIONS_CORS_HEADERS,
        },
      );
    }

    if (!profile.walletAddress) {
      throw `@${profile.username} does not have a public wallet set`;
    }

    let recipient: PublicKey;
    try {
      recipient = new PublicKey(profile.walletAddress);
    } catch (err) {
      throw "Invalid wallet address";
    }

    let nameLabel = `@${profile.username}`;
    if (!!profile.name) nameLabel = `${profile.name} (${nameLabel})`;

    const payload: ActionGetResponse = {
      //   icon: new URL("/logo-orange.png", new URL(req.url).origin).toString(),
      icon: new URL(
        `/api/images/tip/${profile.username}?wallet=${profile.walletAddress}`,
        new URL(req.url).origin,
      ).toString(),
      title: `Tip ${nameLabel} with SOL`,
      label: `Tip ${nameLabel} with SOL`,
      description:
        `Help support ${nameLabel} by tipping ` +
        `them with ${tokenSymbol}, sending it directly to their personal Solana wallet.`,
      links: {
        actions: [
          {
            href: `${baseHref}/${profile.username}?amount=0.1&toAddress=${profile.walletAddress}&token=${tokenSymbol}`,
            label: `Send 0.1 ${tokenSymbol}`,
          },
          {
            href: `${baseHref}/${profile.username}?amount=0.5&toAddress=${profile.walletAddress}&token=${tokenSymbol}`,
            label: `Send 0.5 ${tokenSymbol}`,
          },
          {
            href: `${baseHref}/${profile.username}?amount=0.5&toAddress=${profile.walletAddress}&token=${tokenSymbol}`,
            label: `Send 1.0 ${tokenSymbol}`,
          },
          {
            href: `${baseHref}/${profile.username}?amount={amount}&toAddress=${profile.walletAddress}&token=${tokenSymbol}`,
            label: `Send ${tokenSymbol}`,
            parameters: [
              {
                name: "amount", // name template literal
                label: `Enter any amount of ${tokenSymbol} to send`,
              },
            ],
          },
        ],
      },
    };

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;

    return Response.json(
      {
        message,
      },
      {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      },
    );
  }
};

export const OPTIONS = GET;

export const POST = async (req: Request, { params }: RouteParams) => {
  try {
    if (!params.username)
      throw `Invalid username: ${params.username || "[none provided]"}`;

    // todo: do we care about validating the username/profile here?

    const requestUrl = new URL(req.url);
    const { amount, toAddress } = validatedQueryParams(requestUrl);

    const body: ActionPostRequest = await req.json();

    // validate the client provided input
    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      return new Response('Invalid "account" provided', {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      });
    }

    const SOLANA_RPC = process.env.SOLANA_RPC!;
    if (!SOLANA_RPC) throw "Unable to find RPC url...awkward...";
    const connection = new Connection(SOLANA_RPC);

    // verify the sender has at least `amount` of tokens
    const totalAmount =
      (amount + amount * TREASURY_PLATFORM_FEE) * LAMPORTS_PER_SOL;
    const balance = await connection.getBalance(account);
    if (balance < totalAmount) {
      throw `Insufficient ${tokenSymbol} balance. Currently: ${balance / LAMPORTS_PER_SOL} ${tokenSymbol}`;
    }

    const transaction = createTipSolTransaction(account, toAddress, amount);
    transaction.feePayer = account;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: `Successfully sent ${amount} ${tokenSymbol}! Thanks :)`,
      },
    });

    return Response.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;

    return Response.json(
      {
        message,
      },
      {
        status: 400,
        headers: ACTIONS_CORS_HEADERS,
      },
    );
  }
};

function validatedQueryParams(requestUrl: URL) {
  let toAddress: PublicKey | null = null;
  let amount: number = 0;

  try {
    if (requestUrl.searchParams.get("toAddress")) {
      toAddress = new PublicKey(requestUrl.searchParams.get("toAddress")!);
    }
  } catch (err) {
    throw "Invalid input 'toAddress'";
  }

  if (!toAddress) throw "Invalid to wallet address";

  try {
    if (requestUrl.searchParams.get("amount")) {
      amount = parseFloat(requestUrl.searchParams.get("amount")!);
    }

    if (amount <= 0) throw "amount is too small";
    if (Number.isNaN(amount)) throw "amount is invalid";
  } catch (err) {
    throw "Invalid input 'amount'";
  }

  return {
    amount,
    toAddress,
  };
}
