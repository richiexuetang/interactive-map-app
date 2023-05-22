import React from "react";

import NoteMarker from "./NoteMarker";

const NoteMarkers = ({ setRefresh, noteMarkers }) => {
  return (
    <div>
      {noteMarkers &&
        noteMarkers.map((pos) => (
          <NoteMarker key={pos[0]} position={pos} setRefresh={setRefresh} />
        ))}
    </div>
  );
};

export default NoteMarkers;
