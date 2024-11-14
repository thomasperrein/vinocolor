import DistributorBox from "./DistributorsBox";
import "./InternationalDistributor.css";
import Map from "./Map";

export default function InternationalDistributor() {
  return (
    <div
      style={{ marginLeft: "92px", paddingTop: "30px", marginRight: "92px" }}
    >
      <h1 className="title">International Distributor</h1>
      <div className="international-distributor">
        <DistributorBox />
        <Map />
      </div>
    </div>
  );
}
