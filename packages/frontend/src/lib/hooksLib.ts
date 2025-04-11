import { ChangeEvent, ChangeEventHandler, useState } from 'react';

export interface FieldsType {
  [key: string | symbol]: string;
}

export function useFormFields(
  initialState: FieldsType
): [FieldsType, ChangeEventHandler] {
  const [fields, setValues] = useState(initialState);

  function handleFormField(event: ChangeEvent<HTMLInputElement>) {
    setValues({
      ...fields,
      [event.target.id]: event.target.value,
    });
  }

  return [fields, handleFormField];
}
