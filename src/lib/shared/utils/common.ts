import type { ActionStrategy } from "../strategies/ActionStrategy";
import { defend } from "../strategies/Defend";
import { healMass } from "../strategies/HealMass";
import { healSingle } from "../strategies/HealSingle";
import { mageAttack } from "../strategies/MageAttack";
import { meleeAttack } from "../strategies/MeleeAttack";
import { paralyze } from "../strategies/Paralyze";
import { rangedAttack } from "../strategies/RangedAttack";
import { UnitType } from "../types/enums";
import type { Unit, UnitAction } from "../types/Unit";
import type { ButtonProps } from "../ui/Button/Button";

export const redGrid = [
  ["1-0", "1-1", "1-2"],
  ["0-0", "0-1", "0-2"],
];
export const blueGrid = [
  ["0-0", "0-1", "0-2"],
  ["1-0", "1-1", "1-2"],
];

export const unitButtons: {
  [key: string]: {
    types?: UnitType[];
    text: string;
    color: ButtonProps["color"];
  };
} = {
  attack: {
    types: [UnitType.MAGE, UnitType.MELEE, UnitType.RANGED],
    text: "Attack",
    color: "danger",
  },
  paralyze: {
    types: [UnitType.PARALYZER],
    text: "Paralyze",
    color: "primary",
  },
  heal: {
    types: [UnitType.HEALER_SINGLE, UnitType.HEALER_MASS],
    text: "Heal",
    color: "edit",
  },
  defend: {
    text: "Defend",
    color: "accent",
  },
};

export const getStrategy = (unit: Unit, type: UnitAction): ActionStrategy => {
  switch (type) {
    case "defend":
      return defend;
    case "attack":
      switch (unit.type) {
        case UnitType.MELEE:
          return meleeAttack;
        case UnitType.MAGE:
          return mageAttack;
        case UnitType.RANGED:
          return rangedAttack;
        default:
          return meleeAttack;
      }
    case "paralyze":
      switch (unit.type) {
        case UnitType.PARALYZER:
          return paralyze;
        default:
          return paralyze;
      }
    case "heal":
      switch (unit.type) {
        case UnitType.HEALER_MASS:
          return healMass;
        default:
          return healSingle;
      }
  }
};
