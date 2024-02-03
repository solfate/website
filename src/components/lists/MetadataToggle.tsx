import clsx from "clsx";
import { FeatherIcon } from "@/components/core/FeatherIcon";

type MetadataToggleProps = {
  label: string;
  value?: string;
  disabled?: boolean;
  checked: React.SetStateAction<boolean>;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
};

export const MetadataToggle = ({
  label,
  value,
  checked,
  setChecked,
  disabled,
}: MetadataToggleProps) => {
  if (!value) return null;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => setChecked((prev) => !prev)}
      className={clsx(
        "btn block text-left btn-ghost !px-3",
        checked && "border-green-300 bg-green-100 hover:border-green-500",
      )}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="block text-xs line-clamp-1 text-gray-500">
          {label}
        </span>
        <FeatherIcon
          name={checked ? "CheckCircle" : "XOctagon"}
          size={16}
          className={checked ? "text-green-700" : "text-gray-400"}
        />
      </span>
      <span className="block text-sm line-clamp-1">{value}</span>
    </button>
  );
};
