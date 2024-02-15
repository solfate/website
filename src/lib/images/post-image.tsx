import { ImageResponse } from "next/og";
import getInterFonts, { getInterFonts2 } from "@/lib/og-inter-fonts";
import { Colors } from "@/lib/const/theme";

type PostImageProps = {
  heading?: string;
  title: string;
  avatarImage?: string;
  url?: string;
};

export async function PostImage(
  size: ImageSize,
  { heading, title, avatarImage, url }: PostImageProps,
) {
  return new ImageResponse(
    (
      <div
        tw={`h-full w-full flex items-start justify-start bg-[${Colors["color-light"]}] p-20`}
        // style={{
        //   borderStyle: "inset",
        //   borderColor: Colors["hot-pink"],
        //   borderWidth: "0.75rem",
        // }}
      >
        <div tw="flex h-full items-center w-full">
          <div tw="flex-1 h-full flex flex-col mr-10">
            {heading && <p tw="text-[2.5rem] mb-6 font-medium">{heading}</p>}

            <h1
              tw="text-[4.5rem] max-h-[355px] font-semibold overflow-hidden"
              style={{ lineHeight: 1.1 }}
            >
              {title}
            </h1>

            {/* <p tw="text-hot-pink text-2xl mt-0">solfate.com/podcast</p> */}

            <div tw="flex items-center absolute bottom-4">
              {/* <span tw="rounded-lg overflow-hidden bg-gray-500 w-[84px] h-[84px] mr-4">
                <img src={coverImage} width={84} height={84} alt={""} />
              </span> */}

              <span tw="text-[2.5rem] font-medium">{url}</span>
            </div>
          </div>

          {avatarImage ? (
            <div tw="pr-4 flex relative">
              <svg
                // @ts-ignore
                tw="absolute top-[-300px] left-[-100px] opacity-20"
                id="visual"
                viewBox="0 0 900 600"
                width="900"
                height="600"
                version="1.1"
              >
                <g transform="translate(444.3593826782917 273.8643784322123)">
                  <path
                    fill="#ef4444"
                    d="M186.1 -166.4C230.8 -141.4 249.4 -70.7 237.7 -11.7C226 47.4 184.1 94.8 139.4 139.9C94.8 185.1 47.4 228 -2.2 230.3C-51.9 232.5 -103.7 194 -149.2 148.9C-194.7 103.7 -233.9 51.9 -229.5 4.4C-225.1 -43.1 -177.3 -86.3 -131.8 -111.3C-86.3 -136.3 -43.1 -143.1 13.8 -156.9C70.7 -170.7 141.4 -191.4 186.1 -166.4"
                  ></path>
                </g>
              </svg>
              <div tw="flex flex-col items-center">
                <img
                  style={{ objectFit: "cover" }}
                  tw={`mx-auto border-8 border-[${Colors["hot-pink"]}] w-[300px] h-[300px] rounded-full`}
                  src={avatarImage}
                  alt={""}
                />
                {/* <div tw="flex text-[2.5rem] mt-4 font-semibold">
                  Tommy Johnson
                </div>
                <div tw="flex text-3xl mt-2 text-gray-500">@username</div> */}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    ),
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: await getInterFonts(),
    },
  );
}
