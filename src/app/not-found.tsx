import MarketingFooter from "@/components/core/MarketingFooter";
import Link from "next/link";
import { ArrowRight } from "react-feather";

/**
 * note:
 * for some reason, when  the marketing footer is loaded on this page,
 * the social button styles do not apply...
 * specifically from the `module.css` file and when direct visit a 404 page.
 * if the user routes to the page via internal navigation, then it works fine
 */

export default function NotFound() {
  return (
    <>
      <main className="page-container !space-y-8 text-center py-20">
        <h2 className="text-4xl font-bold">Page Not Found</h2>

        <p>
          Looks like you hit a wall. We could not find the page you were looking
          for...
        </p>

        <p>
          <Link
            href="/"
            className="btn inline-flex font-semibold border-gray-300"
          >
            No place like home
            <ArrowRight className="w-5 h-5" strokeWidth={1.5} />
          </Link>
        </p>
      </main>

      {/* <MarketingFooter /> */}
    </>
  );
}
