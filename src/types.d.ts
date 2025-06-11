export type Mouse = {
  x: number;
  y: number;
  downed: boolean;
  target: HTMLElement | null;
  lastClickTime: number;
};

export type Point = {
  x: number;
  y: number;
};
