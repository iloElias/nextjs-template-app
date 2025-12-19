import {
  FormProps as HeroUIFormProps,
  Form as HeroUIForm,
} from "@heroui/react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormInitialData = Record<string, any>;
export interface FormProps extends HeroUIFormProps {
  children?: React.ReactNode;
  initialData?: FormInitialData;
}
import React, { useState } from "react";

export interface FormContextType {
  initialData?: FormInitialData;
}

const FormContext = React.createContext<FormContextType | undefined>(undefined);

export const Form: React.FC<FormProps> = ({ initialData, ...props }) => {
  const [initial] = useState(initialData);

  return (
    <FormContext.Provider
      value={{
        initialData: initial,
      }}
    >
      <HeroUIForm {...props} />
    </FormContext.Provider>
  );
};

export const useForm = () => {
  return React.useContext(FormContext) ?? {};
};
