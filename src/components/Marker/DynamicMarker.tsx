//@ts-nocheck
import L from "leaflet";
import { useEffect, useState } from "react";
import * as ReactLeaflet from "react-leaflet";

import { useMapContext } from "@context/app-context";
import "leaflet/dist/leaflet.css";

const { Marker } = ReactLeaflet;

const DynamicMarker = ({ children, marker, useMap, rank, ...rest }) => {
  const { category, _id: id, coord } = marker;

  const map = useMap();
  const { markerRefs, game: gameSlug, config } = useMapContext();
  const [fetchInfo, setFetchInfo] = useState(false);

  useEffect(() => {
    (async function init() {
      L.Map.mergeOptions({
        smoothWheelZoom: true,
        smoothSensitivity: 1,
      });

      //eslint-ignore
      L.Map.SmoothWheelZoom = L.Handler.extend({
        addHooks: function () {
          L.DomEvent.on(map._container, "wheel", this._onWheelScroll, this);
        },

        removeHooks: function () {
          L.DomEvent.off(map._container, "wheel", this._onWheelScroll, this);
        },

        _onWheelScroll: function (e) {
          if (!this._isWheeling) {
            this._onWheelStart(e);
          }
          this._onWheeling(e);
        },

        _onWheelStart: function (e) {
          this._isWheeling = true;
          this._wheelMousePosition = map.mouseEventToContainerPoint(e);
          this._centerPoint = map.getSize()._divideBy(2);
          this._startLatLng = map.containerPointToLatLng(this._centerPoint);
          this._wheelStartLatLng = map.containerPointToLatLng(
            this._wheelMousePosition
          );
          this._startZoom = map.getZoom();
          this._moved = false;
          this._zooming = true;

          map._stop();
          if (map._panAnim) map._panAnim.stop();

          this._goalZoom = map.getZoom();
          this._prevCenter = map.getCenter();
          this._prevZoom = map.getZoom();

          this._zoomAnimationId = requestAnimationFrame(
            this._updateWheelZoom.bind(this)
          );
        },

        _onWheeling: function (e) {
          this._goalZoom =
            this._goalZoom +
            L.DomEvent.getWheelDelta(e) * 0.003 * map.options.smoothSensitivity;
          if (
            this._goalZoom < map.getMinZoom() ||
            this._goalZoom > map.getMaxZoom()
          ) {
            this._goalZoom = map._limitZoom(this._goalZoom);
          }
          this._wheelMousePosition = map.mouseEventToContainerPoint(e);

          clearTimeout(this._timeoutId);
          this._timeoutId = setTimeout(this._onWheelEnd.bind(this), 200);

          L.DomEvent.preventDefault(e);
          L.DomEvent.stopPropagation(e);
        },

        _onWheelEnd: function () {
          this._isWheeling = false;
          cancelAnimationFrame(this._zoomAnimationId);
          map._moveEnd(true);
        },

        _updateWheelZoom: function () {
          if (
            !map.getCenter().equals(this._prevCenter) ||
            map.getZoom() != this._prevZoom
          )
            return;

          this._zoom = map.getZoom() + (this._goalZoom - map.getZoom()) * 0.3;
          this._zoom = Math.floor(this._zoom * 100) / 100;

          var delta = this._wheelMousePosition.subtract(this._centerPoint);
          if (delta.x === 0 && delta.y === 0) return;

          if (map.options.smoothWheelZoom === "center") {
            this._center = this._startLatLng;
          } else {
            this._center = map.unproject(
              map.project(this._wheelStartLatLng, this._zoom).subtract(delta),
              this._zoom
            );
          }

          if (!this._moved) {
            map._moveStart(true, false);
            this._moved = true;
          }

          map._move(this._center, this._zoom);
          this._prevCenter = map.getCenter();
          this._prevZoom = map.getZoom();

          this._zoomAnimationId = requestAnimationFrame(
            this._updateWheelZoom.bind(this)
          );
        },
      });

      map.addHandler("smoothWheelZoom", L.Map.SmoothWheelZoom);
    })();
  }, []);

  return (
    <Marker
      ref={(ref) => (markerRefs[id] = ref)}
      position={marker.coord}
      icon={L.icon({
        iconUrl: `/images/icons/${gameSlug}/${category}.png`,
        iconSize: [35, 45],
        iconAnchor: [17, 45],
      })}
      zIndexOffset={100 + rank}
      eventHandlers={{
        click: () => {
          setFetchInfo(true);
          
          map.flyTo(coord, map.getZoom(), {
            animate: true,
            duration: 0.5,
          });
        },
      }}
      {...rest}
    >
      {children(ReactLeaflet, fetchInfo, setFetchInfo, L)}
    </Marker>
  );
};

export default DynamicMarker;
