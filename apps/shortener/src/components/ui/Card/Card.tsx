import styles from './card.module.scss';

/**
 * Handle the card of the application
 * @param children The JSX inside of the component
 * @param className The class of the component
 * @returns The JSX of card
 */
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return <div className={`${styles.card} ${className}`}>{children}</div>;
}

export default Card;
