import validUrl from 'valid-url';

/**
 * Check if a url is valid or not
 * @param link {string} The string to check
 * @returns {boolean} Return true if the url is valid or else false
 */
export const isValidUrl = (link: string): boolean => {
  return !!validUrl.isUri(link);
};
