import {
  FormProps as HeroUIFormProps,
  Form as HeroUIForm,
  cn,
} from "@heroui/react";
import React, { useCallback } from "react";

export type FormInitialData<T = Record<string, unknown>> = Partial<T>;

export interface FormProps<T = Record<string, unknown>> extends Omit<
  HeroUIFormProps,
  "onSubmit"
> {
  children?: React.ReactNode;
  initialData?: FormInitialData<T>;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>, data: T) => void;
}

export interface FormContextType<T = Record<string, unknown>> {
  initialData?: FormInitialData<T>;
}

const FormContext = React.createContext<
  FormContextType<Record<string, unknown>> | undefined
>(undefined);

export const Form = <T,>({
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

export const useForm = <T = Record<string, unknown>,>(): FormContextType<T> => {
  return (React.useContext(FormContext) as FormContextType<T>) ?? {};
};
