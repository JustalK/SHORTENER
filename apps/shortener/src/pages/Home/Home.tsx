import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card/Card';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { postShortenURL, getURL } from '../../services/shortener';
import { ErrorType } from '../../interfaces/error';
import { TailSpin } from 'react-loader-spinner';
import styles from './home.module.scss';

/**
 * Home page of the applicaton
 * @returns {ReactElement} The homepage of the application
 */
export function Home() {
  const { t } = useTranslation();
  const [shortURL, setShortURL] = useState('');
  const [error, setError] = useState<null | ErrorType>(null);
  const [longURL, setLongURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchURL, setSearchURL] = useState('');
  const [countUsage, setCountUsage] = useState('');
  const [copied, setCopied] = useState(false);
  const refTimer = useRef<null | ReturnType<typeof setTimeout>>(null);
  const refTimerCopy = useRef<null | ReturnType<typeof setTimeout>>(null);

  /**
   * get the information of the input and shorten the url through the api
   * @param {React.SyntheticEvent} e The event received from the form
   */
  const shortenURL = useCallback(
    async (e: React.SyntheticEvent) => {
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
      e.preventDefault();
      setError(null);
      setLoading(true);
      const target = e.target as typeof e.target & {
        url: { value: string };
      };
      const longURL = target.url.value;
      const response = await postShortenURL(longURL);
      if (response && response.error) {
        setError(response.error);
      } else {
        const host = getURL();
        setShortURL(`${host}${response.shortURL}`);
        setLongURL(response.longURL);
        setCountUsage(response.countUsage);
      }
      refTimer.current = setTimeout(() => {
        setLoading(false);
      }, 500);
    },
    [refTimer]
  );

  /**
   * Button to copy the result in the clipboad
   */
  const copyURL = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shortURL);
      setCopied(true);
    } catch (error) {
      // Use the 'out of viewport hidden text area' trick
      const textArea = document.createElement('textarea');
      textArea.value = shortURL;

      // Move textarea out of the viewport so it's not visible
      textArea.style.position = 'absolute';
      textArea.style.left = '-999999px';

      document.body.prepend(textArea);
      textArea.select();

      try {
        document.execCommand('copy');
        setCopied(true);
      } catch (error) {
        console.error(error);
      } finally {
        textArea.remove();
      }
    }

    refTimerCopy.current = setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [shortURL]);

  /**
   * Handle the when the user start typing in the input
   */
  const onChange = useCallback((event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLTextAreaElement;
    setSearchURL(target.value);
    setShortURL('');
    setLongURL('');
  }, []);

  /**
   * Just to clean the timeout event
   */
  useEffect(() => {
    return () => {
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
      if (refTimerCopy.current) {
        clearTimeout(refTimerCopy.current);
      }
    };
  }, []);

  return (
    <div className={styles.home}>
      <Card className={styles.home__card}>
        <h2 className={styles.home__card__title}>{t('home.title')}</h2>
        <form onSubmit={shortenURL}>
          <div className={styles.home__card__form}>
            <Input name="url" value={searchURL} onChange={onChange} />
            <div className={styles.home__card__form__button}>
              <Button
                type="submit"
                label={t('home.button.shorten')}
                disabled={loading}
              />
            </div>
          </div>
        </form>
        <span>{t('home.subtitle')}</span>
      </Card>
      {((shortURL && longURL) || loading || error) && (
        <Card className={styles.home__card}>
          {loading && (
            <div className={styles.home__card__loading__spinner}>
              <TailSpin
                visible={true}
                height="80"
                width="80"
                color="#4fa94d"
                ariaLabel="tail-spin-loading"
                radius="1"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
          )}
          <div className={styles.home__card__loading}>
            <div
              className={`${styles.home__card__result} ${
                loading || shortURL === ''
                  ? styles['home__card__result--loading']
                  : ''
              }`}
            >
              <Input name="url" value={shortURL} disabled={true} />
              <div className={styles.home__card__result__button}>
                <Button
                  type="button"
                  onClick={copyURL}
                  label={
                    copied ? t('home.button.copied') : t('home.button.copy')
                  }
                  disabled={copied}
                />
              </div>
            </div>
          </div>
          {error && (
            <div
              className={`${styles.home__card__error} ${
                loading ? styles['home__card__error--loading'] : ''
              }`}
            >
              {t(`common.errors.${error.code}`)}
            </div>
          )}
          <div
            className={`${styles.home__card__long} ${
              loading || shortURL === ''
                ? styles['home__card__long--loading']
                : ''
            }`}
          >
            <span className={styles.home__card__long__span}>
              {t('home.footer')}:{' '}
              <a
                className={styles.home__card__long__span__url}
                href={longURL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {longURL}
              </a>
            </span>
            <span>
              {t('home.counter')}: {countUsage}
            </span>
          </div>
        </Card>
      )}
    </div>
  );
}

export default Home;
