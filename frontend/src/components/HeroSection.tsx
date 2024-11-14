import { useNavigate } from "react-router-dom";
import "./HeroSection.css";

interface HeroSectionProps {
  suptitle?: string;
  title: string;
  subtitle?: string;
  srcImage: string;
  buttonText?: string;
  redirectLink?: string;
}

export default function HeroSection({
  suptitle,
  title,
  subtitle,
  srcImage,
  buttonText,
  redirectLink,
}: HeroSectionProps) {
  const navigate = useNavigate();
  const handleButtonClick = () => {
    if (!redirectLink) return;
    navigate(redirectLink);
  };
  return (
    <section className="hero-section">
      <div className="hero-content">
        {suptitle && <p className="hero-subtitle">{suptitle}</p>}

        <h1 className="hero-title">{title}</h1>
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {buttonText && redirectLink && (
          <button className="hero-button" onClick={handleButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
      <div className="hero-image">
        <img src={srcImage} alt="Wine barrels being handled" />
      </div>
    </section>
  );
}
