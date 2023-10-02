import { memo } from "react";
import {
  format as formatDate,
  formatDistance,
  isAfter,
  sub as subDate,
} from "date-fns";

type FormattedDateProps = {
  date: string;
  className?: string;
};

/** max number of days ago before showing an actual date */
const MAX_DAYS_AGO = 45;

/**
 * Format a string date in the "time ago" when recent, otherwise show an actual date
 */
export const FormattedDateAgo = memo(
  ({ date, className }: FormattedDateProps) => (
    <p className={className ?? "text-sm text-gray-500"}>
      {isAfter(new Date(date), subDate(new Date(), { days: MAX_DAYS_AGO }))
        ? formatDistance(new Date(date), new Date(), {
            addSuffix: true,
          })
        : formatDate(new Date(date), "MMM dd, yyyy")}
    </p>
  ),
);
