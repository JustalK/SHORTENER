import * as THREE from 'three';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '../../components/ui/Card/Card';
import Input from '../../components/ui/Input/Input';
import Button from '../../components/ui/Button/Button';
import { postShortenURL, getURL } from '../../services/shortener';
import styles from './home.module.scss';
import { init3D } from '../../libs/3d';
import { ShaderMaterial, PerspectiveCamera, WebGLRenderer } from 'three';
import { TailSpin } from 'react-loader-spinner';
import ShortTextIcon from '@mui/icons-material/ShortText';
import NumbersIcon from '@mui/icons-material/Numbers';
import ReplayIcon from '@mui/icons-material/Replay';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

/**
 * Home page of the applicaton
 * @returns {ReactElement} The homepage of the application
 */
export function Home() {
  const initialized = useRef(false);
  const { t } = useTranslation();
  const [shortURL, setShortURL] = useState('');
  const [error, setError] = useState<null | string>(null);
  const [longURL, setLongURL] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchURL, setSearchURL] = useState('');
  const [countUsage, setCountUsage] = useState('');
  const [copied, setCopied] = useState(false);
  const canvas = useRef(null);
  const refTimer = useRef<null | ReturnType<typeof setTimeout>>(null);
  const refTimerCopy = useRef<null | ReturnType<typeof setTimeout>>(null);
  const refTimerResize = useRef<null | ReturnType<typeof setTimeout>>(null);
  const refMaterial = useRef<ShaderMaterial | null>(null);
  const refCamera = useRef<PerspectiveCamera | null>(null);
  const refRenderer = useRef<WebGLRenderer | null>(null);

  /**
   * get the information of the input and shorten the url through the api
   * @param {React.SyntheticEvent} e The event received from the form
   */
  const shortenURL = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      setLoading(true);
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
      const response = await postShortenURL(searchURL);
      if (response && response.error) {
        setError(response.error.message);
      } else {
        const host = getURL();
        setShortURL(`${host}${response.shortURL}`);
        setLongURL(response.longURL);
        setSearchURL(`${host}${response.shortURL}`);
        setCountUsage(response.countUsage);
      }
      refTimer.current = setTimeout(() => {
        setLoading(false);
      }, 500);
    },
    [refTimer, searchURL]
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
    setError(null);
  }, []);

  /**
   * Reset the parameter of the app
   */
  const reset = (e: React.SyntheticEvent) => {
    setSearchURL('');
    setShortURL('');
    setLongURL('');
  };

  /**
   * Resize the three JS background
   */
  const onWindowResize = () => {
    if (refTimerResize.current) {
      clearTimeout(refTimerResize.current);
    }
    refTimerResize.current = setTimeout(() => {
      if (refCamera?.current && refRenderer?.current && refMaterial?.current) {
        refMaterial.current.uniforms.uResolution.value = new THREE.Vector2(
          1.0,
          window.innerHeight / window.innerWidth
        );
        refCamera.current.aspect = window.innerWidth / window.innerHeight;
        refCamera.current.updateProjectionMatrix();

        refRenderer.current.setSize(window.innerWidth, window.innerHeight);
      }
    }, 500);
  };

  /**
   * Handle the mouse position for the mouse effect on the background
   */
  const handleMousePosition = (event: React.MouseEvent) => {
    if (refMaterial.current) {
      refMaterial.current.uniforms.uMouse.value.x =
        event.clientX / window.innerWidth;
      refMaterial.current.uniforms.uMouse.value.y =
        1.0 - event.clientY / window.innerHeight;
    }
  };

  /**
   * Just to clean the timeout event
   */
  useEffect(() => {
    if (canvas.current && !initialized.current) {
      initialized.current = true;
      const { backgroundMaterial, renderer, camera } = init3D(canvas);
      refMaterial.current = backgroundMaterial;
      refCamera.current = camera;
      refRenderer.current = renderer;
    }

    window.addEventListener('resize', onWindowResize, false);
    return () => {
      if (refTimer.current) {
        clearTimeout(refTimer.current);
      }
      if (refTimerCopy.current) {
        clearTimeout(refTimerCopy.current);
      }
      if (refTimerResize.current) {
        clearTimeout(refTimerResize.current);
      }
      window.removeEventListener('resize', onWindowResize, false);
    };
  }, []);

  return (
    <div ref={canvas} className={styles.home} onMouseMove={handleMousePosition}>
      <Card className={styles.home__card}>
        <div className={styles.home__card__error}>{error}</div>
        <Input
          name="url"
          value={searchURL}
          onChange={onChange}
          disabled={!!longURL || loading}
          placeholder={t('home.input')}
        />
        <div className={styles.home__card__action}>
          <div
            className={`${styles.home__card__action__count} ${
              longURL ? styles['home__card__action__count--loaded'] : ''
            }`}
          >
            <NumbersIcon />
            {`${t('home.counter')}: ${countUsage} `}
          </div>
          <Button
            className={`${styles.home__card__action__shorten} ${
              loading || longURL
                ? styles['home__card__action__shorten--loaded']
                : ''
            }`}
            onClick={longURL ? copyURL : shortenURL}
            disabled={copied || loading || searchURL === ''}
            loading={loading}
          >
            <div
              className={`${styles.home__card__action__shorten__loader} ${
                loading
                  ? styles['home__card__action__shorten__loader--loaded']
                  : ''
              }`}
            >
              <TailSpin
                visible={true}
                height="20"
                width="100"
                color="#fff"
                ariaLabel="tail-spin-loading"
                radius="2"
                wrapperStyle={{}}
                wrapperClass=""
              />
            </div>
            <span
              className={`${styles.home__card__action__shorten__text} ${
                !loading
                  ? styles['home__card__action__shorten__text--loaded']
                  : ''
              }`}
            >
              {longURL ? (
                copied ? (
                  <>{t('home.button.copied')}</>
                ) : (
                  <>
                    <ContentPasteIcon />
                    {t('home.button.copy')}
                  </>
                )
              ) : (
                <>
                  <ShortTextIcon />
                  {t('home.button.shorten')}
                </>
              )}
            </span>
          </Button>
          <Button
            className={`${styles.home__card__action__retry} ${
              longURL ? styles['home__card__action__retry--loaded'] : ''
            }`}
            onClick={reset}
            loading={loading}
          >
            <ReplayIcon />
            {t('home.button.reset')}
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Home;
