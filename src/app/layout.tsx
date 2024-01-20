import "./globals.css";
import MarketingHeader from "@/components/core/MarketingHeader";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE, TWITTER } from "@/lib/const/general";

import { Toaster } from "react-hot-toast";
import { getUserSession } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

/**
 * Set the global default metadata for the entire site.
 * These values will be used unless explicity overridden
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  openGraph: {
    siteName: SITE.name,
    type: "website",
    images: "/social-with-links.png",
  },
  twitter: {
    site: TWITTER.handle,
    creator: TWITTER.handle,
    card: "summary_large_image",
  },
  category: "technology",
  // todo: set robots, when needed
  // robots: {},

  // set a default title and description for every page
  title: `${SITE.name} - Interviews with blockchain founders on Solana`,
  description:
    "Interviews with blockchain founders and builders in the Solana ecosystem. " +
    "Hosted by two developers, Nick (@nickfrosty) and James (@jamesrp13).",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getUserSession();

  return (
    <html lang="en">
      <body className={inter.className}>
        <MarketingHeader session={session} />

        <Toaster
          position="bottom-center"
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            duration: 4000,
            // className: "w-full",
            // className: "bg-blue-500 text-white",
            // icon: <FontAwesomeIcon icon={faInfoCircle} className="" />,

            // Default options for specific types
            success: {
              // className: "bg-slate-100 text-black",
              // icon: (
              //   <FontAwesomeIcon
              //     icon={faCircleCheck}
              //     className="text-green-500"
              //   />
              // ),
            },
            error: {
              className: "!bg-red-500 !text-white",
              // icon: <FontAwesomeIcon icon={faCircleExclamation} className="" />,
            },
            loading: {
              className: "bg-blue-500 text-white",
            },
          }}
        />

        {/* make sure to keep Toaster above the `children` */}

        {children}

        {/* <main className="min-h-[85vh]">{children}</main> */}
      </body>
    </html>
  );
}
