import React, { useEffect, useState } from "react";

interface Unit {
  id: string;
  name: string;
  type: UnitType;
  hp: number;
  maxHp: number;
  damage?: number;
  heal?: number;
  initiative: number;
  team: "A" | "B";
  position: number;
  isParalyzed?: boolean;
  defending?: boolean;
}

type UnitType =
  | "melee"
  | "range"
  | "mage"
  | "healer-single"
  | "healer-mass"
  | "paralyzer";

type ActionType = "attack" | "defend";

interface ActionStrategy {
  execute(unit: Unit, allUnits: Unit[]): Unit[];
}

// Strategies
class DefendStrategy implements ActionStrategy {
  execute(unit: Unit, allUnits: Unit[]): Unit[] {
    return allUnits.map((u) =>
      u.id === unit.id ? { ...u, defending: true } : u
    );
  }
}

class AttackStrategy implements ActionStrategy {
  execute(unit: Unit, allUnits: Unit[]): Unit[] {
    if (unit.isParalyzed) {
      unit.isParalyzed = false;
      return allUnits;
    }

    const targets = getValidTargets(unit, allUnits);
    if (targets.length === 0) return allUnits;
    const target = targets[Math.floor(Math.random() * targets.length)];
    const updatedUnits = [...allUnits];

    switch (unit.type) {
      case "melee":
      case "range":
      case "mage": {
        const dmg = unit.damage || 0;
        for (const t of unit.type === "mage" ? targets : [target]) {
          const realTarget = updatedUnits.find((u) => u.id === t.id);
          if (!realTarget) continue;
          const finalDmg = realTarget.defending ? dmg / 2 : dmg;
          realTarget.hp = Math.max(0, realTarget.hp - finalDmg);
        }
        break;
      }
      case "healer-single": {
        const realTarget = updatedUnits.find((u) => u.id === target.id);
        if (realTarget && unit.heal) {
          realTarget.hp = Math.min(realTarget.maxHp, realTarget.hp + unit.heal);
        }
        break;
      }
      case "healer-mass": {
        for (const t of targets) {
          const realTarget = updatedUnits.find((u) => u.id === t.id);
          if (!realTarget || !unit.heal) continue;
          realTarget.hp = Math.min(realTarget.maxHp, realTarget.hp + unit.heal);
        }
        break;
      }
      case "paralyzer": {
        const realTarget = updatedUnits.find((u) => u.id === target.id);
        if (realTarget) {
          realTarget.isParalyzed = true;
        }
        break;
      }
    }

    return updatedUnits;
  }
}

const UNIT_TEMPLATES = {
  Skeleton: { type: "melee", hp: 100, damage: 25, initiative: 50 },
  Centaur: { type: "melee", hp: 150, damage: 50, initiative: 50 },
  Bandit: { type: "range", hp: 75, damage: 30, initiative: 60 },
  "Elf Archer": { type: "range", hp: 90, damage: 45, initiative: 60 },
  "Skeleton Mage": { type: "mage", hp: 50, damage: 20, initiative: 40 },
  Archimage: { type: "mage", hp: 90, damage: 30, initiative: 40 },
  Monk: { type: "healer-single", hp: 90, heal: 40, initiative: 20 },
  Bishop: { type: "healer-mass", hp: 130, heal: 25, initiative: 20 },
  Sirena: { type: "paralyzer", hp: 80, initiative: 20 },
};

function createTeam(
  team: "A" | "B",
  names: (keyof typeof UNIT_TEMPLATES)[]
): Unit[] {
  return names.map((name, i) => {
    const base = UNIT_TEMPLATES[name];
    return {
      id: `${team}-${i}`,
      name,
      type: base.type,
      hp: base.hp,
      maxHp: base.hp,
      damage: 10,
      heal: 10,
      initiative: base.initiative,
      team,
      position: i,
      defending: false,
    };
  });
}

function getEnemies(unit: Unit, allUnits: Unit[]) {
  return allUnits.filter((u) => u.team !== unit.team && u.hp > 0);
}

function getAllies(unit: Unit, allUnits: Unit[]) {
  return allUnits.filter((u) => u.team === unit.team && u.hp > 0);
}

function getFrontLine(team: Unit[]) {
  return team.filter((u) => u.position < 3 && u.hp > 0);
}

function isCenter(pos: number) {
  return pos === 1 || pos === 4;
}

function getValidTargets(unit: Unit, allUnits: Unit[]): Unit[] {
  const enemies = getEnemies(unit, allUnits);
  const allies = getAllies(unit, allUnits);
  const enemyFront = getFrontLine(enemies);
  switch (unit.type) {
    case "melee": {
      if (unit.position < 3) {
        if (enemyFront.length > 0) {
          return isCenter(unit.position)
            ? enemyFront
            : enemyFront.filter((e) => e.position === unit.position);
        }
        return enemies;
      }
      return [];
    }
    case "range":
    case "paralyzer":
      return enemies;
    case "mage":
      return enemies;
    case "healer-single":
      return allies.filter((a) => a.hp < a.maxHp);
    case "healer-mass":
      return allies;
  }
}

const App: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([
    ...createTeam("A", [
      "Skeleton",
      "Centaur",
      "Bandit",
      "Elf Archer",
      "Skeleton Mage",
      "Sirena",
    ]),
    ...createTeam("B", [
      "Centaur",
      "Skeleton",
      "Archimage",
      "Monk",
      "Bishop",
      "Bandit",
    ]),
  ]);

  const [round, setRound] = useState(1);

  useEffect(() => {
    const sorted = [...units]
      .filter((u) => u.hp > 0)
      .sort((a, b) => {
        if (a.initiative === b.initiative) return Math.random() - 0.5;
        return b.initiative - a.initiative;
      });
    let updatedUnits = [...units];

    for (const unit of sorted) {
      // Случайный выбор стратегии: атаковать или защищаться
      const strategy: ActionStrategy =
        Math.random() < 0.8 ? new AttackStrategy() : new DefendStrategy();
      updatedUnits = strategy.execute(unit, updatedUnits);
    }

    // Убираем флаг защиты после раунда
    updatedUnits = updatedUnits.map((u) => ({ ...u, defending: false }));

    setUnits(updatedUnits);
    setRound((r) => r + 1);
  }, [round]);

  return (
    <div className="p-4 font-mono">
      <h1 className="text-xl">Tactical Fight - Round {round}</h1>
      <div className="grid grid-cols-6 gap-2 mt-4">
        {units.map((u) => (
          <div
            key={u.id}
            className={`p-2 border rounded text-sm ${
              u.hp <= 0 ? "opacity-50" : ""
            }`}
          >
            <strong>{u.name}</strong>
            <div>HP: {u.hp}</div>
            <div>Init: {u.initiative}</div>
            <div>{u.type}</div>
            <div>Team: {u.team}</div>
            {u.isParalyzed && <div className="text-red-500">Paralyzed</div>}
            {u.defending && <div className="text-blue-500">Defending</div>}
          </div>
        ))}
      </div>
      <button
        onClick={() => setRound((r) => r + 1)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Next Round
      </button>
    </div>
  );
};

export default App;
