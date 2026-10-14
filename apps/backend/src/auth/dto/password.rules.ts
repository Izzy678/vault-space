import { applyDecorators } from '@nestjs/common';
import { Matches, MaxLength, MinLength } from 'class-validator';

/** Same policy as the frontend password strength checklist. */
export const STRONG_PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const STRONG_PASSWORD_MESSAGE =
  'Password must be at least 8 characters and include upper and lowercase letters, a number, and a symbol';

/** Min length, max length, and complexity for account passwords. */
export function IsStrongAccountPassword() {
  return applyDecorators(
    MinLength(8, { message: 'Password must be at least 8 characters' }),
    MaxLength(128, { message: 'Password must be at most 128 characters' }),
    Matches(STRONG_PASSWORD_REGEX, { message: STRONG_PASSWORD_MESSAGE }),
  );
}
