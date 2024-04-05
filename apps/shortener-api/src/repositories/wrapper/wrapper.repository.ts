/**
 * The module for wrap the ORM in case we want to change it in the futur
 * Since all the call are regrouped here, it will be easy to change database or ORM
 * @module WrapperRepository
 */
import { Document } from 'mongoose';

class WrapperRepository {
  #model;
  constructor(model) {
    this.#model = model;
  }

  make<T>(data: T): T {
    return new this.#model(data);
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

export default WrapperRepository;
