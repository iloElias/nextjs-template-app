"use client";

import { Button } from "@/components/button";
import { useSession } from "@/hooks/use-session";
import { googleAuthV2 } from "@/http/auth/google-auth";
import { signIn } from "@/http/auth/sign-in";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Link,
} from "@heroui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { Google } from "@thesvg/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const t = useScopedI18n("auth.login");
  const locale = useCurrentLocale();
  const { setToken } = useSession();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    defaultValues: { email: "", password: "" },
  });

  const handleSuccess = (token: string) => {
    setToken(token);
    window.location.href = `/${locale}`;
  };

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const response = await signIn(data);
      handleSuccess(response.data.token);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setServerError(msg ?? t("errors.generic"));
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setIsGoogleLoading(true);
      setServerError(null);
      try {
        const response = await googleAuthV2(access_token);
        handleSuccess(response.data.token);
      } catch {
        setServerError(t("errors.generic"));
      } finally {
        setIsGoogleLoading(false);
      }
    },
    onError: () => setServerError(t("errors.generic")),
  });

  return (
    <Card className="shadow-medium">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader className="flex-col gap-1 px-6 pt-6 pb-0">
          <h1 className="text-2xl font-bold text-foreground">{t("title")}</h1>
          <p className="text-sm text-default-500">{t("subtitle")}</p>
        </CardHeader>
        <CardBody className="gap-4 px-6 py-5">
          {serverError && (
            <p className="rounded-lg bg-danger-50 px-3 py-2 text-sm text-danger">
              {serverError}
            </p>
          )}
          <Controller
            name="email"
            control={control}
            rules={{
              required: t("errors.emailRequired"),
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: t("errors.emailInvalid"),
              },
            }}
            render={({ field }) => (
              <Input
                {...field}
                label={t("email")}
                type="email"
                placeholder={t("emailPlaceholder")}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <div className="flex flex-col gap-1">
            <Controller
              name="password"
              control={control}
              rules={{
                required: t("errors.passwordRequired"),
                minLength: {
                  value: 8,
                  message: t("errors.passwordMin"),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  label={t("password")}
                  type="password"
                  placeholder={t("passwordPlaceholder")}
                  isInvalid={!!errors.password}
                  errorMessage={errors.password?.message}
                />
              )}
            />
            <Link href="#" size="sm" className="self-end text-primary">
              {t("forgotPassword")}
            </Link>
          </div>
        </CardBody>
        <CardFooter className="flex-col gap-3 px-6 pb-6">
          <Button
            type="submit"
            className="w-full"
            color="primary"
            isLoading={isSubmitting}
          >
            {t("submit")}
          </Button>
          <div className="flex w-full items-center gap-2">
            <Divider className="flex-1" />
            <span className="text-xs text-default-400">{t("divider")}</span>
            <Divider className="flex-1" />
          </div>
          <Button
            className="w-full"
            variant="bordered"
            type="button"
            isLoading={isGoogleLoading}
            onPress={() => handleGoogleLogin()}
          >
            <Google className="icon" /> {t("googleLogin")}
          </Button>
          <p className="text-center text-sm text-default-500">
            {t("noAccount")}{" "}
            <Link
              href={`/${locale}/auth/sign-up`}
              size="sm"
              className="font-medium text-primary"
            >
              {t("signUp")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
