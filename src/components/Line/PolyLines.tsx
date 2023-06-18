import Polyline from "./PolyLine";

const PolyLines = (props) => {
  const { pathMarkers } = props;

  return (
    <>
      {pathMarkers &&
        pathMarkers.map(({ parentId, path, _id, categoryId }, i) => {
          return (
            <Polyline
              key={`${parentId} + ${i}`}
              path={path}
              parentId={parentId}
              categoryId={categoryId}
              id={_id}
            />
          );
        })}
    </>
  );
};

export default PolyLines;
