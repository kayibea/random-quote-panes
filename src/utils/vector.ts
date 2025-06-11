import { Point } from '../types';

// export const normalize = (p: Point): Point => {
//   const len = Math.hypot(p.x, p.y);
//   return { x: p.x / len, y: p.y / len };
// };

export const reflect = (v: Point, n: Point): Point => {
  const dot = v.x * n.x + v.y * n.y;

  const result = {
    x: v.x - 2 * dot * n.x,
    y: v.y - 2 * dot * n.y,
  };

  return result;
};

export const getRandomVelocity = (): Point => {
  const rx = Math.random() > 0.5 ? 1 : -1;
  const ry = Math.random() > 0.5 ? 1 : -1;

  const vec = {
    x: rx,
    y: ry,
  };

  return vec;
};
