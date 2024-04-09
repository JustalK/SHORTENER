/**
 * The models of the shortener
 * @module models/shortener
 */

import mongoose from 'mongoose';
import utils from '@libs/utils';

/**
 * Search for a long URL to redirect to
 * @param req {Express.Request} The request of express
 * @param res {Express.Response} the response of express
 *
 * @swagger
 * components:
 *   schemas:
 *     Shortener:
 *       type: object
 *       properties:
 *         shortURL:
 *           type: string
 *           description: The short URL
 *           example: https://localhost:3333/aYCByZ4ZUIwUnfddlxFBw
 *         longURL:
 *           type: string
 *           description: The long URL
 *           example: https://www.npmjs.com/package/prettier
 *         isArchive:
 *           type: boolean
 *           description: True if the shortener object has been archived
 *           example: true
 *         createdDate:
 *           type: date
 *           description: The date of creation of the shortener
 *           example: 22/04/2023
 *         countUsage:
 *           type: int
 *           description: The number of time the short url has been visited
 *           example: 10
 */
const schema = new mongoose.Schema(
  {
    shortURL: {
      type: String,
      default: () => {
        return utils.createRandomString(5);
      },
    },
    longURL: {
      type: String,
      trim: true,
      required: true,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
    createdDate: {
      type: Date,
      default: new Date(),
    },
    countUsage: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'shortener',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/**
 * Create a DTO based on the fields
 * @param {string[]} fields The fields to get
 * @returns {Shortener} Return a partiel shortener based on the field selected
 */
schema.method('toDTO', function (fields: string[]) {
  const tmp = {};
  for (const field of fields) {
    tmp[field] = this[field];
  }
  return tmp;
});

export default mongoose.model('shortener', schema);
