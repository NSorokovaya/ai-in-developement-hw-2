import { Base } from './base.interface';
import { Geo } from './geo.interface';

export interface Address extends Base {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
  userId: number;
}
