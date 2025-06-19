import { registerDecorator, ValidationOptions } from 'class-validator';
import { VALIDATION } from '../constants/validation.constants';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isStrongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: VALIDATION.PASSWORD.MESSAGE,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          if (value.length < VALIDATION.PASSWORD.MIN_LENGTH) return false;
          return VALIDATION.PASSWORD.PATTERN.test(value);
        },
      },
    });
  };
}
