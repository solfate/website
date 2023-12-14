import { memo } from "react";
import * as Icons from "react-feather";

export type FeatherIconName = keyof typeof Icons;

export type FeatherIconProps = {
  name?: FeatherIconName;
} & Icons.IconProps;

export const FeatherIcon: React.FC<FeatherIconProps> = memo(
  ({ name, ...rest }) => {
    // default to an unknown style icon
    if (!name) name = "HelpCircle";
    const IconComponent = Icons[name];
    return <IconComponent strokeWidth={1.2} {...rest} />;
  },
);
