import Sidebar from "@components/Sidebar/Sidebar";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./DynamicMap"), {
  ssr: false,
});

const Map = (props) => {
  const { config, markerRefs, categoryItems, area, categoryCounts, markers } = props;
  return (
    <div>
      <DynamicMap {...props} />
    </div>
  );
};

export default Map;
