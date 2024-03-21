/**
 * Check if a url is valid or not using a regex pattern
 * @param str {string} The string to check
 * @returns {boolean} Return true if the url is valid or else false
 */
export const isValidUrl = (str: string): boolean => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?((([-a-z0-9]{1,63}\\.)*?[a-z0-9]([-a-z0-9]{0,253}[a-z0-9])?\\.[a-z]{2,63})|((\\d{1,3}\\.){3}\\d{1,3}))(:\\d{1,5})?((\\/|\\?)((%[0-9a-f]{2})|[-\\w\\+\\.\\?\\/@~#&=])*)?$', // fragment locator
    'i'
  );
  return pattern.test(str);
};
