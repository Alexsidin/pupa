import { FormControl } from '@angular/forms';

export type FormStructure<T> = {
  [Key in keyof T]: FormControl<T[Key]>;
};
