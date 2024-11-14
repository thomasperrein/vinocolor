import "./Socials.css";
import insta from "../assets/logo/insta.svg";
import facebook from "../assets/logo/facebook.svg";
import linkedin from "../assets/logo/linkedin.svg";
import Social from "./Social";

export default function Socials() {
  return (
    <div className="socials">
      <p>
        Follow us on <br />
        social media
      </p>
      <Social
        srcLogo={insta}
        altLogo="logo insta"
        description="vinocolor"
        link="https://www.instagram.com/vinocolor/"
      />
      <Social
        srcLogo={linkedin}
        altLogo="logo linkedin"
        description="VINOCOLOR"
        link="https://www.linkedin.com/company/vinocolor/"
      />
      <Social
        srcLogo={facebook}
        altLogo="logo facebook"
        description="Vinocolor"
        link="https://www.facebook.com/profile.php?id=61563302831791"
      />
    </div>
  );
}
