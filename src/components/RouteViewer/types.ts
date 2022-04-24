export type BoxLink = {
  id: number;
  type: number;
};

export enum BoxTypes {
  Default = 0,
  Start = 1,
  End = 2,
  Boss = 3,
  Position = 4,
  NPC = 5,
  Action = 6,
}

export type Box = {
  id: number;
  name: string;
  pids: BoxLink[];
  type: BoxTypes;
  isAchievement?: boolean;
  isMain?: boolean;
};

export type Point = {
  x: number;
  y: number;
};

