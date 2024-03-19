/**
 * The module for wrap the ORM in case we want to change it in the futur
 * Since all the call are regrouped here, it will be easy to change database or ORM
 * @module WrapperDb
 */

class WrapperDb {
  #model;
  constructor(model) {
    this.#model = model;
  }

  async create(data) {
    return this.#model.create(data);
  }

  async findOne(query) {
    return this.#model.findOne(query);
  }

  async update(query, data) {
    return this.#model.findOneAndUpdate(query, { $set: data });
  }

  async facet(query) {
    return this.#model.aggregate().facet(query);
  }

  queryMatch(query) {
    return { $match: query };
  }

  queryLimit(limit) {
    return { $limit: limit };
  }

  async increment(query, field) {
    return this.#model.findOneAndUpdate(query, {
      $inc: { [field]: 1 },
    });
  }
}

export default WrapperDb;
