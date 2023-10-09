import { PODCAST } from "@/lib/const/podcast";
import { ImageResponse } from "next/server";
import { SITE } from "@/lib/const/general";
import { usePodcastEpisode } from "@/hooks/usePodcastEpisode";
import { Colors } from "@/lib/const/theme";

// Route segment config
export const runtime = "edge";

// Image metadata
// export const alt = "About Acme";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image({
  params,
}: {
  params: { episode: string };
}) {
  const fonts = await Promise.all([
    fetch(
      new URL("../../../../public/fonts/Inter-Regular.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer()),
    fetch(
      new URL("../../../../public/fonts/Inter-SemiBold.ttf", import.meta.url),
    ).then((res) => res.arrayBuffer()),
  ]);

  const { episode } = usePodcastEpisode({ slug: params.episode });
  if (!episode) {
    // hack: instead of importing from `next/navigation`, this makes the edge function smaller
    const NOT_FOUND_ERROR_CODE = "NEXT_NOT_FOUND";
    type NotFoundError = Error & { digest: typeof NOT_FOUND_ERROR_CODE };
    // eslint-disable-next-line no-throw-literal
    const error = new Error(NOT_FOUND_ERROR_CODE);
    (error as NotFoundError).digest = NOT_FOUND_ERROR_CODE;
    throw error;
  }

  // define the podcast's default cover image
  const coverImage = `${SITE.url}${PODCAST.image}`;

  // set the image to be used with image
  const image = episode.image ? `${SITE.url}${episode.image}` : coverImage;

  return new ImageResponse(
    (
      <div
        tw={`h-full w-full flex items-start justify-start bg-[${Colors["color-light"]}] p-20`}
      >
        <div tw="flex h-full items-center w-full">
          <div tw="flex-1 h-full flex flex-col mr-10">
            <p tw="text-4xl mb-0">Episode #{episode.ep}:</p>

            <h1 tw="text-6xl max-h-[308px] font-semibold overflow-hidden">
              {episode.title}
            </h1>

            {/* <p tw="text-hot-pink text-2xl mt-0">solfate.com/podcast</p> */}

            <div tw="flex items-center absolute bottom-0">
              <span tw="rounded-lg overflow-hidden bg-gray-500 w-[84px] h-[84px] mr-4">
                <img src={coverImage} width={84} height={84} />
              </span>

              <span tw="text-4xl">{`solfate.com/podcast`}</span>
            </div>
          </div>

          {image ? (
            <div tw="flex relative">
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
                  src={image}
                />
                {/* <div tw="flex text-4xl mt-4 font-semibold">Tommy Johnson</div>
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
      fonts: [
        {
          name: "Inter",
          data: fonts[0],
          style: "normal",
          weight: 400,
        },
        {
          name: "Inter",
          data: fonts[1],
          style: "normal",
          weight: 500,
        },
      ],
    },
  );
}
