import { ImageResponseOptions } from "next/server";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/**
 * helper function for fetching and loading remote Inter fonts for
 * use within generating open graph images
 *
 * note: when loading the fonts in locally:
 * - the `edge` runtime would exceed to 1MB free tier on Vercel
 * - the `nodejs` runtime would not be able to locate the local file
 *
 * huge thanks to the author of this GH comment:
 * https://github.com/vercel/next.js/issues/48081#issuecomment-1685391506
 */
/**
 * helper function for fetching and loading remote Inter fonts for
 * use within generating open graph images
 *
 * note: when loading the fonts in locally:
 * - the `edge` runtime would exceed to 1MB free tier on Vercel
 * - the `nodejs` runtime would not be able to locate the local file
 *
 * huge thanks to the author of this GH comment:
 * https://github.com/vercel/next.js/issues/48081#issuecomment-1685391506
 */
export default async function getInterFonts(): Promise<
  ImageResponseOptions["fonts"]
> {
  // This is unfortunate but I can't figure out how to load local font files
  // when deployed to vercel.
  const [interRegular, interMedium, interSemiBold, interBold] =
    await Promise.all([
      fetch(`https://rsms.me/inter/font-files/Inter-Regular.woff`).then((res) =>
        res.arrayBuffer(),
      ),
      fetch(`https://rsms.me/inter/font-files/Inter-Medium.woff`).then((res) =>
        res.arrayBuffer(),
      ),
      fetch(`https://rsms.me/inter/font-files/Inter-SemiBold.woff`).then(
        (res) => res.arrayBuffer(),
      ),
      fetch(`https://rsms.me/inter/font-files/Inter-Bold.woff`).then((res) =>
        res.arrayBuffer(),
      ),
    ]);

  return [
    {
      name: "Inter",
      data: interRegular,
      style: "normal",
      weight: 400,
    },
    {
      name: "Inter",
      data: interMedium,
      style: "normal",
      weight: 500,
    },
    {
      name: "Inter",
      data: interSemiBold,
      style: "normal",
      weight: 600,
    },
    {
      name: "Inter",
      data: interBold,
      style: "normal",
      weight: 700,
    },
  ];
}

export async function getInterFonts2(): Promise<ImageResponseOptions["fonts"]> {
  // This is unfortunate but I can't figure out how to load local font files
  // when deployed to vercel.
  const [
    // comment for better diffs
    interRegular,
    interMedium,
    interSemiBold,
    interBold,
  ] = await Promise.all([
    fs.promises.readFile(
      path.join(
        fileURLToPath(import.meta.url),
        "../../fonts/inter/Inter-Regular.ttf",
      ),
    ),
    fs.promises.readFile(
      path.join(
        fileURLToPath(import.meta.url),
        "../../fonts/inter/Inter-Medium.ttf",
      ),
    ),
    fs.promises.readFile(
      path.join(
        fileURLToPath(import.meta.url),
        "../../fonts/inter/Inter-SemiBold.ttf",
      ),
    ),
    fs.promises.readFile(
      path.join(
        fileURLToPath(import.meta.url),
        "../../fonts/inter/Inter-Bold.ttf",
      ),
    ),
  ]);

  return [
    {
      name: "Inter",
      data: interRegular,
      style: "normal",
      weight: 400,
    },
    {
      name: "Inter",
      data: interMedium,
      style: "normal",
      weight: 500,
    },
    {
      name: "Inter",
      data: interSemiBold,
      style: "normal",
      weight: 600,
    },
    {
      name: "Inter",
      data: interBold,
      style: "normal",
      weight: 700,
    },
  ];
}
