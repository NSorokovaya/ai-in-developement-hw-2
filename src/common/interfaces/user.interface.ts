import { Base } from './base.interface';
import { Address } from './address.interface';
import { Company } from './company.interface';

export interface User extends Base {
  name: string;
  username: string;
  email: string;
  password: string;
  address?: Address;
  phone?: string;
  website?: string;
  company?: Company;
}
