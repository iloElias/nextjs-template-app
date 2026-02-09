import { ErrorDisplay } from "@/components/error/error-display";
import { getI18n } from "@/locales/server";

export default async function NotFound() {
  const t = await getI18n();

  return (
    <ErrorDisplay
      type="page-not-found"
      title={t("page.not-found.title")}
      description={t("page.not-found.description")}
      homeButtonLabel={t("page.not-found.go-home")}
      backButtonLabel={t("page.not-found.go-back")}
    />
  );
}
