import { string, refine, object } from '../../../src';

const PasswordValidator = refine(string(), 'MinimumLength', (pw) =>
  pw.length >= 8 ? true : 'required minimum length of 8',
);
const changePasswordStruct = object({
  newPassword: PasswordValidator,
  confirmPassword: string(),
});

export const Struct = refine(
  changePasswordStruct,
  'PasswordsDoNotMatch',
  (values) => {
    return values.newPassword === values.confirmPassword
      ? true
      : 'Passwords do not match';
  },
);

export const data = {
  newPassword: '1234567',
  confirmPassword: '123456789',
};

export const failures = [
  {
    value: data.newPassword,
    type: 'string',
    refinement: 'MinimumLength',
    path: ['newPassword'],
    branch: [data, data.newPassword],
  },
  {
    value: data,
    type: 'object',
    refinement: 'PasswordsDoNotMatch',
    path: [],
    branch: [data],
  },
];
