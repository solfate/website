import { ImageResponse } from "next/og";
import { getUserProfile } from "@/lib/queries/users";
import { ACTIONS_CORS_HEADERS } from "@solana/actions";
import { SITE } from "@/lib/const/general";
import { shortWalletAddress } from "@/lib/helpers";

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

    const logoUrl = `${SITE.url}/logo-orange.png`;

    return new ImageResponse(
      (
        <div tw="flex flex-col w-full h-full bg-[#fffafa] text-black">
          {/* <div tw="w-full h-1" style={{ background: "#f5820b" }} /> */}

          <div tw="flex flex-col items-center justify-between p-8 flex-grow">
            <div tw="flex w-full justify-between items-center">
              <div tw="flex w-12 h-12">
                <img
                  src={logoUrl}
                  alt=""
                  tw="rounded-full flex mr-2"
                  style={{ width: 30, height: 30 }}
                />
                <div tw="flex text-xl">{SITE.domain}</div>
              </div>
              {/* <div tw="flex rounded-full h-12 w-12">icon here?</div> */}
            </div>

            {/* <div tw="flex flex-col w-full justify-between items-center">
              <div tw="text-7xl text-center">Send a Tip</div>
              <div tw="text-7xl text-center">to</div>
              <div tw="text-7xl text-center">{profile.username}</div>
            </div> */}
            <div tw="flex flex-col w-full justify-between items-center">
              <div tw="text-7xl text-center my-5">Send a Tip</div>
              <img
                src={profile.image || logoUrl}
                alt="User Image"
                tw="rounded-full flex border-4 border-[#f5820b]"
                style={{ width: 256, height: 256 }}
              />
            </div>

            <div tw="flex w-full items-center justify-between text-base">
              <div tw="flex rounded-full p-3 m-4 text-wrap border-2 border-[#ddd]">
                {shortWalletAddress(profile.walletAddress, 6)}
              </div>
              <div tw="flex items-center px-3 py-2 m-4 rounded-full border-2 border-[#ddd]">
                <span className="flex rounded-full">
                  <img
                    src={profile.image || logoUrl}
                    alt="User Image"
                    tw="rounded-full flex mr-2"
                    style={{ width: 30, height: 30 }}
                  />
                </span>
                <span>
                  @
                  {profile.username.length > 24
                    ? shortWalletAddress(profile.username, 6)
                    : profile.username}
                </span>
              </div>
            </div>
          </div>

          {/* <div tw="w-full h-1" style={{ background: "#f5820b" }} /> */}
        </div>
      ),
      {
        width: 600,
        height: 600,
      },
    );
  } catch (err) {
    let message = "An unknown error occurred";
    if (typeof err == "string") message = err;

    return Response.json(
      {
        message,
      },
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      },
    );
  }
};
