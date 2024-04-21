import { postApi, getApi } from '@services/api/api';

/**
 * Handle the post to the api
 * @param longURL the url to shorten
 * @returns The long url and short url
 */
export async function postShortenURL(longURL: string) {
  return postApi('/shortener', { longURL });
}

/**
 * Handle the get to the api
 * @param shortURL The short url use to get the long url
 * @returns The short url with the long url
 */
export async function getShortenURL(shortURL: string) {
  return getApi(`/shortener?short=${shortURL}`);
}

/**
 * Get the url depending of the environment in order to split container if needed or to use DNS
 * @returns The url where to call api
 */
export function getURL(): string {
  return process.env.NODE_ENV === 'development'
    ? `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/`
    : window.location.href;
}
