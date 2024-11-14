import map from "../assets/img/carte.svg";
import circle from "../assets/img/circle.svg";
import "./Map.css";

export default function Map() {
  return (
    <div className="map">
      <img src={map} />
      <div className="legend">
        <img src={circle} />
        <p>: Countries where Vinocolor is a distributor</p>
      </div>
    </div>
  );
}
