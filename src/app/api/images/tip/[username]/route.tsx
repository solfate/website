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
              <div tw="text-7xl text-center my-5">
                {!!profile?.walletAddress ? "Send a Tip" : "No Public Wallet"}
              </div>
              {profile.image ? (
                <img
                  src={profile.image || logoUrl}
                  alt="User Image"
                  tw="rounded-full flex border-4 border-[#f5820b]"
                  style={
                    !!profile?.walletAddress
                      ? { width: 256, height: 256 }
                      : { width: 200, height: 200 }
                  }
                />
              ) : (
                <svg
                  viewBox="0 0 36 36"
                  fill="none"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  // width="128"
                  // height="128"
                  // @ts-ignore
                  tw="rounded-full flex border-4 border-[#f5820b]"
                  style={{ width: 256, height: 256 }}
                >
                  <mask
                    id=":S1:"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="36"
                    height="36"
                  >
                    <rect width="36" height="36" fill="#FFFFFF"></rect>
                  </mask>
                  <g mask="url(#:S1:)">
                    <rect width="36" height="36" fill="#FF005B"></rect>
                    <rect
                      x="0"
                      y="0"
                      width="36"
                      height="36"
                      transform="translate(9 9) rotate(219 18 18) scale(1)"
                      fill="#FFB238"
                      rx="6"
                    ></rect>
                    <g transform="translate(4.5 4.5) rotate(9 18 18)">
                      <path d="M13,19 a1,0.75 0 0,0 10,0" fill="#000000"></path>
                      <rect
                        x="10"
                        y="14"
                        width="1.5"
                        height="2"
                        rx="1"
                        stroke="none"
                        fill="#000000"
                      ></rect>
                      <rect
                        x="24"
                        y="14"
                        width="1.5"
                        height="2"
                        rx="1"
                        stroke="none"
                        fill="#000000"
                      ></rect>
                    </g>
                  </g>
                </svg>
              )}
            </div>

            <div tw="flex w-full items-center justify-between text-base">
              {!!profile?.walletAddress ? (
                <div tw="flex rounded-full p-3 m-4 text-wrap border-2 border-[#ddd]">
                  {shortWalletAddress(profile.walletAddress, 6)}
                </div>
              ) : (
                <div></div>
              )}
              <div tw="flex items-center px-3 py-2 m-4 rounded-full border-2 border-[#ddd]">
                {/* <span className="flex rounded-full">
                  <img
                    src={profile.image || logoUrl}
                    alt="User Image"
                    tw="rounded-full flex mr-2"
                    style={{ width: 30, height: 30 }}
                  />
                </span> */}
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
