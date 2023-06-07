import { Tooltip } from "react-leaflet";
import styled from "styled-components";

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

const RMTooltip = ({children }) => {
    return <CustomTooltip>{children}</CustomTooltip>
  };
  
  export default RMTooltip;