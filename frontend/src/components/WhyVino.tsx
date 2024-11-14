import WhyVinoItem from "./WhyVinoItem";
import glassOfWine from "../assets/img/glass-of-wine.svg";
import palette from "../assets/img/palette.svg";
import grappe from "../assets/img/grappe.svg";
import "./WhyVino.css";

export default function WhyVino() {
  return (
    <div
      style={{ marginLeft: "92px", paddingTop: "30px", marginRight: "92px" }}
    >
      <h1 className="title">Why use Vinocolor ?</h1>
      <div className="why-vino">
        <WhyVinoItem
          imgSrc={palette}
          description="A brilliant colour that will add a touch of elegance to your cellar !"
        />
        <WhyVinoItem
          imgSrc={glassOfWine}
          description="A natural composition with no risk for wine !"
        />
        <WhyVinoItem
          imgSrc={grappe}
          description="Respect for French winemaking traditions !"
        />
      </div>
    </div>
  );
}
