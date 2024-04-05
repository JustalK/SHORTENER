/**
 * The models of the shortener
 * @module models/shortener
 */

import mongoose from 'mongoose';
import utils from '@libs/utils';

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
