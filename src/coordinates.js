
export const scaledToViewport = (
  scaled,
  viewport,
) => {
  const { width, height } = viewport;

  if (scaled.x1 === undefined) {
    throw new Error("You are using old position format, please update");
  }

  const x1 = width * scaled.x1 / scaled.width;
  const y1 = height * scaled.y1 / scaled.height;

  const x2 = width * scaled.x2 / scaled.width;
  const y2 = height * scaled.y2 / scaled.height;

  return {
    left: x1,
    top: y1,
    width: x2 - x1,
    height: y2 - y1
  };
};
