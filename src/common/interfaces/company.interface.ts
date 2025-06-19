import { Base } from './base.interface';

export interface Company extends Base {
  name: string;
  catchPhrase: string;
  bs: string;
  userId: number;
}
