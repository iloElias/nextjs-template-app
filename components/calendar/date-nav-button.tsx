"use client";

import { ButtonProps } from "@heroui/react";
import { AltArrowLeft, AltArrowRight } from "@solar-icons/react";
import React from "react";
import { Button } from "../button";

interface MonthNavButtonProps extends Omit<
  ButtonProps,
   "children"
> {
  direction: "prev" | "next";
}

export const DateNavButton: React.FC<MonthNavButtonProps> = ({
  direction,
  ...props
}) => (
  <Button
    isIconOnly
    {...props}
    aria-label={direction === "prev" ? "Previous month" : "Next month"}
  >
    {direction === "prev" ? <AltArrowLeft /> : <AltArrowRight />}
  </Button>
);
