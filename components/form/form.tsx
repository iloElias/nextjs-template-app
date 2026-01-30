import {
  FormProps as HeroUIFormProps,
  Form as HeroUIForm,
  cn,
} from "@heroui/react";
import React, { useCallback } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormValue = any;

export type FormDataRecord = Record<string, FormValue | FormValue[]>;

export type FormInitialData<T = FormDataRecord> = Partial<T>;

export interface FormProps<T = FormDataRecord> extends Omit<
  HeroUIFormProps,
  "onSubmit"
> {
  children?: React.ReactNode;
  initialData?: FormInitialData<T>;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>, data: T) => void;
}

export interface FormContextType<T = FormDataRecord> {
  initialData?: FormInitialData<T>;
}

const FormContext = React.createContext<
  FormContextType<FormDataRecord> | undefined
>(undefined);

export const Form = <T = FormDataRecord,>({
  initialData,
  onSubmit,
  className,
  ...props
}: FormProps<T>) => {
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);

      if (onSubmit) {
        onSubmit(event, data as T);
      }
    },
    [onSubmit],
  );

  return (
    <FormContext.Provider
      value={{
        initialData,
      }}
    >
      <HeroUIForm
        {...props}
        className={cn("inline-block", className)}
        onSubmit={handleSubmit}
      />
    </FormContext.Provider>
  );
};

export const useForm = <T = FormDataRecord,>(): FormContextType<T> => {
  return (React.useContext(FormContext) as FormContextType<T>) ?? {};
};
