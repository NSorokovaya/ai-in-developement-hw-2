import { registerDecorator, ValidationOptions } from 'class-validator';
import { VALIDATION } from '../constants/validation.constants';

export function IsValidUsername(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidUsername',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: VALIDATION.USERNAME.MESSAGE,
        ...validationOptions,
      },
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          if (
            value.length < VALIDATION.USERNAME.MIN_LENGTH ||
            value.length > VALIDATION.USERNAME.MAX_LENGTH
          )
            return false;
          return VALIDATION.USERNAME.PATTERN.test(value);
        },
      },
    });
  };
}
