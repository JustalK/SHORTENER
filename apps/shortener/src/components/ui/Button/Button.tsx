import React from 'react';
import styles from './button.module.scss';

/**
 * Handle the button of the app
 * @param type The type of the button
 * @param label The label of the project
 * @param disabled True for disabling the button
 * @returns JSX of the button
 */
export function Button({
  type,
  label,
  disabled,
  onClick = undefined,
}: {
  type: 'button' | 'submit';
  label: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <button
      type={type}
      className={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}

export default Button;
