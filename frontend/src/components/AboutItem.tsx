import "./AboutItem.css";

export enum ImagePositionEnum {
  Left = "left",
  Right = "right",
}

interface AboutItemProps {
  title: string;
  subtitle: string;
  description: string;
  srcImage: string;
  imagePosition: ImagePositionEnum;
}

export default function AboutItem({
  title,
  subtitle,
  description,
  srcImage,
  imagePosition,
}: AboutItemProps) {
  return (
    <div className="about-item">
      {imagePosition === ImagePositionEnum.Right ? (
        <>
          <div className="about-item__content">
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
            <p>{description}</p>
          </div>
          <div className="about-item__image">
            <img src={srcImage} alt={`${title} image`} />
          </div>
        </>
      ) : (
        <>
          <div className="about-item__image">
            <img src={srcImage} alt={`${title} image`} />
          </div>
          <div className="about-item__content">
            <h2>{title}</h2>
            <h3>{subtitle}</h3>
            <p>{description}</p>
          </div>
        </>
      )}
    </div>
  );
}
