import {Popup, Tooltip} from "react-leaflet";
import styled from "styled-components";

export const CustomPopup = styled(Popup)`
    border-radius: 0;
    white-space: nowrap;
    min-width: 350px;
    max-width: 450px;
    white-space: initial;

    .leaflet-popup-content-wrapper {
        border-radius: 0;
        background: #221c0f;
        border: 0.2px solid #fbe4bd;
        color: #967959;
        overflow-wrap: hidden;
        padding-bottom: 0;
    }

    .leaflet-popup-content-wrapper::after {
        content: "";
        position: absolute;
        top: 90%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: black transparent transparent transparent;
    }

    .leaflet-popup-tip {
        background: transparent;
    }
`;

export const CustomTooltip = styled(Tooltip)`
    margin-left: 15px;

    background: #221c0f;
    border: 1px solid #584835;
    color: #af894d;
    overflow: hidden;

    > p {
        margin-right: 10px;
        margin-bottom: 10px;
        margin-top: 15px !important;
    }
`;