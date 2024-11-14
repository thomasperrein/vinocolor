import "./WhyVinoItem.css";

interface WhyVinoItemProps {
  imgSrc: string;
  description: string;
}

export default function WhyVinoItem({ imgSrc, description }: WhyVinoItemProps) {
  return (
    <div className="why-vino-item">
      <img src={imgSrc} />
      <p>{description}</p>
    </div>
  );
}
