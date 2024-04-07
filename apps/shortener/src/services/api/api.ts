import { OptionsType } from '../../interfaces/options';
import { ShortenerType } from '@root/types';

const options = {
  headers: {
    'Content-Type': 'application/json',
  },
};

function getApiUrl() {
  if (process.env.NODE_ENV === 'development') {
    return `${process.env.API_PROTOCOL}://${process.env.API_HOST}:${process.env.API_PORT}/${process.env.API_VERSION}`;
  } else {
    return `${window.location.href}${process.env.API_VERSION}`;
  }
}

/**
 * Handle all the call to the api
 * @param path The path to call
 * @param options The option associated to the call
 * @returns The result of the call
 */
async function callApi(path: string, options: OptionsType) {
  try {
    const response = await fetch(`${getApiUrl()}${path}`, options);
    return response.json();
  } catch (error) {
    console.log(error);
  }
}

/**
 * Handle all the post to the api
 * @param path The path to call
 * @param body The body of the call
 * @returns The result of the call
 */
export async function postApi(path: string, body: ShortenerType) {
  return callApi(path, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Handle all the get to the api
 * @param path The path to call
 * @returns The result of the call
 */
export async function getApi(path: string) {
  return callApi(path, {
    ...options,
    method: 'GET',
  });
}
