import { useTranslation } from "react-i18next";

export default function PrivacyPolicy() {
  const { t } = useTranslation("fr", { useSuspense: false });
  return (
    <div>
      <p>{t("privacy-policy.content")}</p>
    </div>
  );
}
