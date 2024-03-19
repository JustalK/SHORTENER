import styles from './layout.module.scss';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Handle the layout of the page
 * @returns {ReactElement} The JSX of the layout
 */
export function Layout() {
  const { t } = useTranslation();

  return (
    <div className={styles.layout}>
      <div className={styles.layout__wrapper}>
        <h1 className={styles.layout__wrapper__h1}>{t('layout.title')}</h1>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
