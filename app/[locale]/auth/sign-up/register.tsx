"use client";

import { Button } from "@/components/button";
import { Input } from "@/components/form/input";
import { useSession } from "@/hooks/use-session";
import { googleAuthV2 } from "@/http/auth/google-auth";
import { signUp } from "@/http/auth/sign-up";
import { useCurrentLocale, useScopedI18n } from "@/locales/client";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@heroui/react";
import { useGoogleLogin } from "@react-oauth/google";
import { Google } from "@thesvg/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export default function Register() {
  const t = useScopedI18n("auth.register");
  const locale = useCurrentLocale();
  const { setToken } = useSession();
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    defaultValues: { name: "", email: "", password: "", password_confirm: "" },
  });

  const handleSuccess = (token: string) => {
    setToken(token);
    router.push(`/${locale}`);
  };

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      const response = await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        terms_and_privacy_agreement: true,
      });
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
            name="name"
            control={control}
            rules={{ required: t("errors.nameRequired") }}
            render={({ field }) => (
              <Input
                {...field}
                label={t("name")}
                type="text"
                placeholder={t("namePlaceholder")}
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
              />
            )}
          />
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
          <Controller
            name="password_confirm"
            control={control}
            rules={{
              required: t("errors.confirmPasswordRequired"),
              validate: (value) =>
                value === getValues("password") || t("errors.passwordMismatch"),
            }}
            render={({ field }) => (
              <Input
                {...field}
                label={t("confirmPassword")}
                type="password"
                placeholder={t("confirmPasswordPlaceholder")}
                isInvalid={!!errors.password_confirm}
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />
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
            type="button"
            isLoading={isGoogleLoading}
            onPress={() => handleGoogleLogin()}
          >
            <Google className="icon" /> {t("googleRegister")}
          </Button>
          <p className="text-center text-sm leading-relaxed text-default-400">
            {t("termsPrefix")}{" "}
            <Link
              href="/legal/terms-of-service"
              className="font-medium text-primary"
            >
              {t("termsLink")}
            </Link>{" "}
            {t("andText")}{" "}
            <Link
              href="/legal/privacy-policy"
              className="font-medium text-primary"
            >
              {t("privacyLink")}
            </Link>
            .
          </p>
          <p className="text-center text-sm text-default-500">
            {t("hasAccount")}{" "}
            <Link
              href={`/${locale}/auth/login`}
              className="font-medium text-primary"
            >
              {t("signIn")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
