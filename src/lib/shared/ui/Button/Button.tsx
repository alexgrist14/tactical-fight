import { type ButtonHTMLAttributes, type FC } from "react";
import styles from "./Button.module.scss";
import classNames from "classnames";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "primary" | "accent" | "edit" | "danger";
  className?: string;
}

const Button: FC<ButtonProps> = ({
  color = "accent",
  children,
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={classNames(
        styles.button,
        !!color && styles[`button_${color}`],
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
