import { UnitType, TeamType } from "./enums";

export interface Unit {
  id: string;
  name: string;
  type: UnitType;
  team: TeamType;
  health: number;
  damage?: number;
  heal?: number;
  maxHealth: number;
  initiative: number;
  position: { x: number; y: number };
  isParalyzed?: boolean;
  isDefending?: boolean;
  isDead?: boolean;
  icon: string;
}

export type UnitAction = "attack" | "defend" | "paralyze" | "heal";

export type Units = { [key: string]: Unit };
