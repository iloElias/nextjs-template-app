import {FormContext} from "@heroui/react";
import {FormProvider, useForm} from "react-hook-form";

interface FormProps {
  children: React.ReactNode;
}

// TODO: Extend the heroui form props with the react-hook-form form props
export const Form: React.FC<FormProps> = ({children}) => {
  const form = useForm();
  return (
    <FormProvider {...form}>
      <FormContext value={form.getValues()}>{children}</FormContext>
    </FormProvider>
  );
};
