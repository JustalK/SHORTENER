/**
 * The module for wrap the ORM in case we want to change it in the futur
 * Since all the call are regrouped here, it will be easy to change database or ORM
 * @module WrapperRepository
 */
import {
  Model,
  Document,
  AnyKeys,
  AnyObject,
  UpdateQuery,
  PipelineStage,
  CreateOptions,
} from 'mongoose';

class WrapperRepository<M extends Document> {
  #model: Model<M>;
  constructor(model: Model<M>) {
    this.#model = model;
  }

  make<D>(data: D): M {
    return new this.#model(data);
  }

  async create(data: any, options?: CreateOptions): Promise<any> {
    return this.#model.create(data, options);
  }

  async findOne<Q>(query: Q): Promise<M> {
    return this.#model.findOne(query);
  }

  async update<Q>(query: Q, data: UpdateQuery<M>): Promise<M> {
    return this.#model.findOneAndUpdate(query, { $set: data });
  }

  async facet(
    query: Record<string, PipelineStage.FacetPipelineStage[]>
  ): Promise<M[]> {
    return this.#model.aggregate().facet(query);
  }

  queryMatch<Q>(query: Q): { $match: Q } {
    return { $match: query };
  }

  queryLimit<Q>(limit: Q): { $limit: Q } {
    return { $limit: limit };
  }

  async increment<Q>(query: Q, field: AnyKeys<M> & AnyObject): Promise<M> {
    // This part cannot be type without any because typescript always cannot handle a key instead of a string
    return this.#model.findOneAndUpdate(query, {
      $inc: { [field as any]: 1 },
    });
  }
}

export default WrapperRepository;
