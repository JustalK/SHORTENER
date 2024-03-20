import React, { ReactElement } from 'react';
import styles from './button.module.scss';

/**
 * Handle the button of the app
 * @param type The type of the button
 * @param label The label of the project
 * @param disabled True for disabling the button
 * @returns JSX of the button
 */
export function Button({
  children,
  disabled,
  className,
  loading = false,
  onClick = undefined,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <button
      className={`${styles.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
