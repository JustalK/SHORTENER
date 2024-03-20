/**
 * Set of global functions
 * @module Utils
 */

import { nanoid } from 'nanoid';

const utils = {
  /**
   * Return the mode of node or affect one if none has been given
   * @param {string} node_env The mode of node
   * @return {string} The mode of node
   **/
  mode: (node_env: string | undefined) => {
    return node_env !== undefined ? node_env : 'development';
  },
  /**
   * Create a random string
   *
   * Unfortunately, it can have some redundancy since I am not checking if a previous string has been used
   * For avoiding that, we could use a pool of id or create a loop until we got a unique id
   *
   * @param {Number} length The lenght of the random string
   * @return {String} The random string of X length
   */
  createRandomString: (length: number) => {
    const id = nanoid();
    return id.slice(0, id.length < length ? length : id.length);
  }
};

export default utils;
