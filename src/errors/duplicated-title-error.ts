import { ApplicationError } from '@/protocols';

export function duplicatedTitleError(): ApplicationError {
  return {
    name: 'DuplicatedTitleError',
    message: 'There is already a credential with given title',
  };
}