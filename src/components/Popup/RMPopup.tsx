import styled from "styled-components";
import { Popup } from "react-leaflet";

const CustomPopup = styled(Popup)`
    border-radius: 0;
    white-space: nowrap;
    min-width: 350px;
    max-width: 450px;
    white-space: initial;
    bottom: 25px !important;

    .leaflet-popup-content {
      p {
        margin-top: 0 !important;
        line-height: 1.5em;
      }
    }
    .leaflet-popup-content-wrapper {
      border-radius: 0;
      background: #221c0f;
      border: 0.2px solid #fbe4bd;
      color: #967959;
      overflow-wrap: hidden;
    }

    .leaflet-popup-content-wrapper::after {
      content: "";
      position: absolute;
      left: 50%;
      margin-left: -5px;
      border-width: 5px;
      border-style: solid;
      border-color: black transparent transparent transparent;
    }

    .leaflet-popup-tip {
      background: #221c0f;
    }

    .leaflet-popup-tip-container {
      background: transparent;
    }
  `;

const RMPopup = ({children }) => {
  return <CustomPopup>{children}</CustomPopup>
};

export default RMPopup;