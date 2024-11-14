import vino from "../assets/img/vino.svg";
import vinoPowder from "../assets/img/vino-powder.svg";
import vinoPainting from "../assets/img/vino-painting.svg";
import "./UserGuide.css";
import UserGuideItem from "./UserGuideItem";

export default function UserGuide() {
  return (
    <div
      style={{ marginLeft: "92px", paddingTop: "30px", marginRight: "92px" }}
    >
      <h1 className="title">User Guide</h1>
      <div className="steps">
        <UserGuideItem
          step={1}
          imgSrc={vino}
          description="Purchase one or more jars of VINOCOLOR (depending on the number of
        barrels to be coloured) from a retailer or by ordering from this
        website."
        />
        <UserGuideItem
          step={2}
          imgSrc={vinoPowder}
          description="Mix VINOCOLOR colour powder with water in precise quantities (1 litre of water for 100 grams of colour powder)."
        />
        <UserGuideItem
          step={3}
          imgSrc={vinoPainting}
          description="Take a sponge or brush and brush the centre of the barrels carefully."
        />
      </div>
    </div>
  );
}
