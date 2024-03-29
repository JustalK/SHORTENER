/**
 * The module for wrap the ORM in case we want to change it in the futur
 * Since all the call are regrouped here, it will be easy to change database or ORM
 * @module WrapperDb
 */
import { Document } from 'mongoose';

class WrapperDb {
  #model;
  constructor(model) {
    this.#model = model;
  }

  async create<T>(data: Document): Promise<T> {
    return this.#model.create(data);
  }

  async findOne<T, Q>(query: Q): Promise<T> {
    return this.#model.findOne(query);
  }

  async update<T, Q>(query: Q, data): Promise<T> {
    return this.#model.findOneAndUpdate(query, { $set: data });
  }

  async facet<T, Q>(query: Q): Promise<T> {
    return this.#model.aggregate().facet(query);
  }

  queryMatch<Q>(query: Q): { $match: Q } {
    return { $match: query };
  }

  queryLimit<Q>(limit: Q): { $limit: Q } {
    return { $limit: limit };
  }

  async increment<T, Q>(query: Q, field: string): Promise<T> {
    return this.#model.findOneAndUpdate(query, {
      $inc: { [field]: 1 },
    });
  }
}

export default WrapperDb;
