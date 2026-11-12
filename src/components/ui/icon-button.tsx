import { forwardRef } from "react";
import { Button, type ButtonProps } from "./button";

export type IconButtonProps = Omit<ButtonProps, "size"> & { "aria-label": string };
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(props, ref) {
    return <Button ref={ref} size="icon" {...props} />;
  },
);
