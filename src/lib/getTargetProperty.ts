export const getTarget = (obj, children) => {
  let result = obj;
  children.map((child) => {
    if (result && result[child]) {
      result = result[child];
    } else {
        result = null;
    } 
  });
  return result;
};
