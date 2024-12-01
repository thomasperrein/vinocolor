import { useTranslation } from "react-i18next";
import "./UserGuideItem.css";

interface UserGuideItemProps {
  step: number;
  imgSrc: string;
  description: string;
}

export default function UserGuideItem({
  step,
  imgSrc,
  description,
}: UserGuideItemProps) {
  const { t } = useTranslation();
  return (
    <div className="step">
      <div className="step-title">
        <h1>
          {t("user-guide-item.step")} {step}
        </h1>
      </div>
      <img src={imgSrc}></img>
      <div className="description-separator">
        <div className="separator"></div>
        <p>{description}</p>
      </div>
    </div>
  );
}
