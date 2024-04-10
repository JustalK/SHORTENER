import express from 'express';
import { ShortenerControllerType } from '@interfaces/shortener.interface';

export interface RouteType {
  router: express.Router;
}

export interface ShortenerRouteType extends RouteType {
  shortenerController: ShortenerControllerType;
}
