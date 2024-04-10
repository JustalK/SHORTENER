import express from 'express';

export interface CustomRequest<T> extends express.Request {
  body: T;
}
