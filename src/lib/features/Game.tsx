import React, { useEffect, useMemo, useState } from "react";
import { UnitComponent } from "./UnitComponent";
import type { Unit, UnitAction, Units } from "../shared/types/Unit";
import { initTeams } from "../shared/utils/initTeams";
import { TeamType, UnitType } from "../shared/types/enums";
import type { ActionStrategy } from "../shared/strategies/ActionStrategy";
import { defend } from "../shared/strategies/Defend";
import { meleeAttack } from "../shared/strategies/MeleeAttack";
import { mageAttack } from "../shared/strategies/MageAttack";
import { rangedAttack } from "../shared/strategies/RangedAttack";
import { paralyze } from "../shared/strategies/Paralyze";
import { healSingle } from "../shared/strategies/HealSingle";
import { healMass } from "../shared/strategies/HealMass";

const redGrid = [
  ["1-0", "1-1", "1-2"],
  ["0-0", "0-1", "0-2"],
];
const blueGrid = [
  ["0-0", "0-1", "0-2"],
  ["1-0", "1-1", "1-2"],
];

export const Game: React.FC = () => {
  const [redTeam, setRedTeam] = useState<Units>({});
  const [blueTeam, setBlueTeam] = useState<Units>({});

  const [turnOrder, setTurnOrder] = useState<Unit[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [possibleTargets, setPossibleTargets] = useState<Unit[]>([]);
  const [actionType, setActionType] = useState<UnitAction>();

  useEffect(() => {
    const { red, blue } = initTeams();

    const units = [...Object.values(red), ...Object.values(blue)].sort(
      (a, b) => b.initiative - a.initiative || Math.random() - 0.5
    );

    setRedTeam(red);
    setBlueTeam(blue);
    setTurnOrder(units);
  }, []);

  const currentUnit = turnOrder[currentIndex];
  const nextUnit =
    turnOrder[currentIndex + 1 > turnOrder.length - 1 ? 0 : currentIndex + 1];

  // const { currentUnit, turnOrder } = useMemo(() => {
  //   const units = [...Object.values(redTeam), ...Object.values(blueTeam)].sort(
  //     (a, b) => b.initiative - a.initiative || Math.random() - 0.5
  //   );

  //   return { turnOrder: units, currentUnit: units[currentIndex] };
  // }, [blueTeam, currentIndex, redTeam]);

  const getAllies = (unit: Unit) =>
    unit.team === TeamType.RED ? redTeam : blueTeam;
  const getEnemies = (unit: Unit) =>
    unit.team === TeamType.RED ? blueTeam : redTeam;

  const getStrategy = (unit: Unit, type: UnitAction): ActionStrategy => {
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

  const handleActionSelect = (actionType: UnitAction) => {
    const allies = getAllies(currentUnit);
    const enemies = getEnemies(currentUnit);
    const strategy = getStrategy(currentUnit, actionType);

    const targets = strategy.getTargets({
      current: currentUnit,
      allies,
      enemies,
    });

    setPossibleTargets(targets);
    setActionType(actionType);

    if (actionType === "defend") {
      const { enemiesResult, alliesResult } = strategy.perform({
        current: currentUnit,
        target: currentUnit,
        allies,
        enemies,
      });

      updateTeams(alliesResult || allies, enemiesResult || enemies);
      nextTurn(currentIndex);
    }
  };

  const updateTeams = (allies: Units, enemies: Units) => {
    if (currentUnit.team === TeamType.RED) {
      setRedTeam(structuredClone(allies));
      setBlueTeam(structuredClone(enemies));
    } else {
      setRedTeam(structuredClone(enemies));
      setBlueTeam(structuredClone(allies));
    }
  };

  const handleTargetClick = (target: Unit) => {
    if (!actionType) return;

    const allies = getAllies(currentUnit);
    const enemies = getEnemies(currentUnit);

    const strategy = getStrategy(currentUnit, actionType);

    const { alliesResult, enemiesResult } = strategy.perform({
      current: currentUnit,
      target,
      allies,
      enemies,
    });

    updateTeams(alliesResult || allies, enemiesResult || enemies);

    // setSelectedTarget(null);
    setPossibleTargets([]);

    nextTurn(currentIndex);
  };

  const nextTurn = (currentIndex: number) => {
    const nextIndex =
      currentIndex + 1 > turnOrder.length - 1 ? 0 : currentIndex + 1;

    // for (let i = 0; i < turnOrder.length; i++) {
    // const idx = (nextIndex + i) % turnOrder.length;
    const unit = turnOrder[nextIndex];

    const allies = structuredClone(getAllies(unit));
    const enemies = getEnemies(unit);

    const tempUnit = allies[`${unit.position.y}-${unit.position.x}`];

    if (!!tempUnit && (tempUnit.isParalyzed || tempUnit.isDefending)) {
      tempUnit.isParalyzed = false;
      tempUnit.isDefending = false;

      updateTeams(allies, enemies);
    }

    if (tempUnit?.isDead || tempUnit?.isParalyzed) nextTurn(nextIndex);

    setCurrentIndex(nextIndex);
    // found = true;
    // break;
    // }

    // if (!found) setCurrentIndex(0);
  };

  const renderTeam = (type: TeamType) => {
    const grid = type === "red" ? redGrid : blueGrid;
    const team = type === "red" ? redTeam : blueTeam;

    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 100px)",
          gap: 10,
        }}
      >
        {grid.map((row) =>
          row.map((key) => {
            const unit = team[key];

            return (
              <UnitComponent
                key={unit.id}
                unit={unit}
                isCurrent={unit.id === currentUnit?.id}
                isSelectable={possibleTargets.some((t) => t.id === unit.id)}
                onClick={() =>
                  possibleTargets.some((t) => t.id === unit.id) &&
                  handleTargetClick(unit)
                }
              />
            );
          })
        )}
      </div>
    );
  };

  if (!currentUnit) return <div>Loading...</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>RED TEAM</h2>
      {renderTeam(TeamType.RED)}

      <h2>BLUE TEAM</h2>
      {renderTeam(TeamType.BLUE)}

      <hr />

      <div>
        <h3>
          Current Unit: {currentUnit.name} ({currentUnit.team})
        </h3>
        <h3>
          Next Unit: {nextUnit.name} ({nextUnit.team})
        </h3>

        {[UnitType.MAGE, UnitType.MELEE, UnitType.RANGED].includes(
          currentUnit.type
        ) && (
          <button onClick={() => handleActionSelect("attack")}>Attack</button>
        )}
        {[UnitType.PARALYZER].includes(currentUnit.type) && (
          <button onClick={() => handleActionSelect("paralyze")}>
            Paralyze
          </button>
        )}
        {[UnitType.HEALER_SINGLE].includes(currentUnit.type) && (
          <button onClick={() => handleActionSelect("heal")}>Heal</button>
        )}
        {[UnitType.HEALER_MASS].includes(currentUnit.type) && (
          <button onClick={() => handleActionSelect("heal")}>Mass Heal</button>
        )}
        <button onClick={() => handleActionSelect("defend")}>Defend</button>
      </div>
    </div>
  );
};
