import { useNavigate } from "react-router-dom";
import checkSvg from "../assets/logo/check.svg";
import thanksBanner from "../assets/img/thanks-banner.svg";
import "./Thanks.css";

export default function Thanks() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/"); // Redirige vers la page d'accueil
  };

  return (
    <div className="thanks">
      <h1>Thank you for your order!</h1>
      <img src={checkSvg} alt="Order confirmation checkmark" />
      <img src={thanksBanner} alt="Thank you banner" />
      <p>
        Thank you for your purchase! Vinocolor and its team are delighted to
        count you among our customers and will do everything in their power to
        dispatch your product as quickly as possible. If you have any questions,
        please contact our team at: <b>contact@vinocolor.fr</b>.
      </p>
      <button onClick={handleBackHome}>Back Home</button>
    </div>
  );
}
