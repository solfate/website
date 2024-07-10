"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { CheckCircleIcon, Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Button, buttonVariants } from "./button";

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const ButtonGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("flex gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
ButtonGroup.displayName = RadioGroupPrimitive.Root.displayName;

const ButtonGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  {
    label: string;
  } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, label, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "data-[state=checked]:!bg-background",
        // "border data-[state=checked]:bg-background text-center rounded-md focus:outline-none 2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
      asChild
    >
      <Button
        type="button"
        variant={"outline"}
        className={cn(
          "w-full data-[state=checked]:!bg-primary data-[state=checked]:!text-primary-foreground",
        )}
      >
        <RadioGroupPrimitive.RadioGroupIndicator className="relative">
          <div className="relative">
            <div className="absolute -ml-5 -mt-2">
              <CheckCircleIcon className="text-success size-4" />
            </div>
          </div>
        </RadioGroupPrimitive.RadioGroupIndicator>

        <span className="inline-flex">{label}</span>
      </Button>
    </RadioGroupPrimitive.Item>
  );
});
ButtonGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

const ButtonGroupIconItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  {
    icon: React.ReactNode;
    label: string;
  } & React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, icon, label, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "border data-[state=checked]:bg-background text-center h-[125px] w-[125px] rounded-md focus:outline-none 2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.RadioGroupIndicator className="relative">
        <div className="relative">
          <div className="absolute -ml-2 -mt-[30px] ">
            <CheckCircleIcon />
            {/* <Icons.checkCircle className="text-primary" /> */}
          </div>
        </div>
      </RadioGroupPrimitive.RadioGroupIndicator>

      <div className="flex flex-col justify-center">
        <div className="self-center">{icon}</div>
        <div className="text-sm pt-2">{label}</div>
      </div>
    </RadioGroupPrimitive.Item>
  );
});
ButtonGroupIconItem.displayName = RadioGroupPrimitive.Item.displayName;

export {
  RadioGroup,
  RadioGroupItem,
  ButtonGroup,
  ButtonGroupItem,
  ButtonGroupIconItem,
};
