import { type Unit } from "../types/Unit";
import { UnitType, TeamType } from "../types/enums";
import { v4 as uuidv4 } from "uuid";

const unitTemplates = [
  {
    name: "Skeleton",
    type: UnitType.MELEE,
    health: 100,
    initiative: 50,
    damage: 25,
    icon: "BTNSkeletonWarrior.png",
  },
  {
    name: "Centaur",
    type: UnitType.MELEE,
    health: 150,
    initiative: 50,
    damage: 50,
    icon: "BTNCentaurKhan.png",
  },
  {
    name: "Bandit",
    type: UnitType.RANGED,
    health: 75,
    initiative: 60,
    damage: 30,
    icon: "BTNBandit.png",
  },
  {
    name: "Elf Archer",
    type: UnitType.RANGED,
    health: 90,
    initiative: 60,
    damage: 45,
    icon: "BTNHighElvenArcher.png",
  },
  {
    name: "Skeleton mage",
    type: UnitType.MAGE,
    health: 90,
    initiative: 40,
    damage: 30,
    icon: "BTNSkeletonMage.png",
  },
  {
    name: "Sirena",
    type: UnitType.PARALYZER,
    health: 80,
    initiative: 20,
    icon: "BTNNagaSummoner.png",
  },

  {
    name: "Monk",
    type: UnitType.HEALER_SINGLE,
    health: 90,
    initiative: 20,
    heal: 40,
    icon: "BTNPandarenBrewmaster.png",
  },
  {
    name: "Bishop",
    type: UnitType.HEALER_MASS,
    health: 130,
    initiative: 20,
    heal: 25,
    icon: "BTNPriest.png",
  },
];

export function initTeams(): { red: Unit[]; blue: Unit[] } {
  const createTeam = (team: TeamType) => {
    const units: Unit[] = [];

    for (let i = 0; i < 6; i++) {
      const template =
        unitTemplates[Math.floor(Math.random() * unitTemplates.length)];
      const x = i % 3;
      const y = Math.floor(i / 3);

      units.push({
        id: uuidv4(),
        name: template.name,
        type: template.type,
        team,
        health: template.health,
        maxHealth: template.health,
        damage: template.damage,
        heal: template.heal,
        initiative: template.initiative,
        position: { x, y },
        isDefending: false,
        isParalyzed: false,
        icon: template.icon,
      });
    }

    return units;
  };

  return { red: createTeam(TeamType.RED), blue: createTeam(TeamType.BLUE) };
}
