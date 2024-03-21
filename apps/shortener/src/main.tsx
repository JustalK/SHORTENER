import { StrictMode } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import './i18n';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Short URL - Shortener.net</title>
        <meta
          name="description"
          content="A website for transforming a long link to a short link"
        />
        <link rel="canonical" href="http://shortener.net" />
      </Helmet>
    </HelmetProvider>
    <App />
  </StrictMode>
);
