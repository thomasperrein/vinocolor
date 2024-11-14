import "./Social.css";

interface SocialProps {
  srcLogo: string;
  altLogo: string;
  description: string;
  link: string;
}

export default function Social({
  srcLogo,
  altLogo,
  description,
  link,
}: SocialProps) {
  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <div className="social-rectangle">
        <img src={srcLogo} alt={altLogo}></img>
        <div className="social-rectangle-text">
          <p>{description}</p>
        </div>
      </div>
    </a>
  );
}
