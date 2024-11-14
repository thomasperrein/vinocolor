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
  return (
    <div className="step">
      <div className="step-title">
        <h1>Step {step}</h1>
      </div>
      <img src={imgSrc}></img>
      <div className="description-separator">
        <div className="separator"></div>
        <p>{description}</p>
      </div>
    </div>
  );
}
