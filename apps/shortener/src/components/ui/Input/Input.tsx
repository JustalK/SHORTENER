import styles from './input.module.scss';

/**
 * Handle the two input of the application
 * @param name The name of the input
 * @param value The value of the input
 * @param onChange the function to trigger when the input change
 * @param disabled True for disabling the input
 * @returns {ReactElement} The JSX of the input
 */
export function Input({
  name,
  value,
  onChange,
  dataCy,
  placeholder,
  disabled = false,
}: {
  name: string;
  value: string | number | readonly string[] | undefined;
  placeholder?: string;
  dataCy: string;
  onChange?: undefined | React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
}) {
  return (
    <input
      className={styles.input}
      name={name}
      data-cy={dataCy}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
    />
  );
}

export default Input;
