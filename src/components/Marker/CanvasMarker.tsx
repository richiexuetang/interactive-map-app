//@ts-nocheck
import { useEffect } from "react";
import { useMapContext } from "@context/app-context";
import L from "leaflet";
// import "./leaflet.canvas-markers";
import { Marker, Popup, useMap } from "react-leaflet";

var rbush = require("rbush");
var factory = require("./leaflet.canvas-markers");

const CanvasMarker = () => {
  window.L.CanvasIconLayer = factory(L);

  const { markers: mapMarkers, game } = useMapContext();
  const map = useMap();

  const pointsList = [
    [
      [0.7295902494300266, -0.5696356192571383],
      [0.7280110287510854, -0.5627306586443327],
    ],
  ];
  useEffect(() => {
    if (!map) return;

    var ciLayer = L.canvasIconLayer({}).addTo(map);

    // ciLayer.addOnClickListener(function (e, data) {
    //   console.log(data);
    // });
    // ciLayer.addOnHoverListener(function (e, data) {
    //   console.log(data[0].data._leaflet_id);
    // });

    var markers = [];
    const lines = [];
    // const canvasMarkers = canvasCategories.map((category) =>
    //   mapMarkers.filter((item) => item.category === category)
    // );

    // canvasMarkers[0].map((canvasMarker, i) => {
    //   var icon = L.icon({
    //     iconUrl: `/images/icons/${game}/${canvasMarker.category}.png`,
    //     iconSize: [35, 45],
    //     iconAnchor: [17, 45],
    //   });

    //   markers.push(line);

    //   var marker = L.marker([canvasMarker.coord[0], canvasMarker.coord[1]], {
    //     icon: icon,
    //   }).bindPopup("I Am " + i);
    //   markers.push(marker);
    // });

    pointsList.map((pointList) => {
      const line = new L.Polyline(pointList, {
        color: "white",
        weight: 3,
        opacity: 0.5,
        smoothFactor: 1,
      });

      lines.push(line);
    });

    ciLayer.addLayers(lines);
  }, [map]);

  return (null
    // <CanvasMarkersLayer>
    // <Marker
    //   position={[0.3704426705656506, -0.8143615722656251]}
    //   icon={L.icon({
    //     iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    //     iconSize: [20, 18],
    //     iconAnchor: [10, 9],
    //   })}
    // >
    //   <Popup>
    //     <div>hello !</div>
    //   </Popup>
    // </Marker>
    // </CanvasMarkersLayer>
  );
};

export default CanvasMarker;
