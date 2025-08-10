import React, { useEffect, useState } from "react";
import { UnitComponent } from "../Unit/UnitComponent";
import type { Unit, UnitAction } from "../../shared/types/Unit";
import { initTeams } from "../../shared/utils/initTeams";
import { TeamType, UnitType } from "../../shared/types/enums";
import type { ActionStrategy } from "../../shared/strategies/ActionStrategy";
import { defend } from "../../shared/strategies/Defend";
import { meleeAttack } from "../../shared/strategies/MeleeAttack";
import { mageAttack } from "../../shared/strategies/MageAttack";
import { rangedAttack } from "../../shared/strategies/RangedAttack";
import { paralyze } from "../../shared/strategies/Paralyze";
import { healSingle } from "../../shared/strategies/HealSingle";
import { healMass } from "../../shared/strategies/HealMass";
import styles from "./Battlefield.module.scss";
import Button from "../../shared/ui/Button/Button";
import RoundInfo from "../RoundInfo/RoundInfo";
import Team from "./Team/Team";
import { blueGrid, redGrid } from "../../shared/utils/common";

export const Game: React.FC = () => {
  const [turnOrder, setTurnOrder] = useState<Unit[]>([]);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [possibleTargets, setPossibleTargets] = useState<Unit[]>([]);
  const [actionType, setActionType] = useState<UnitAction>();
  const [winner, setWinner] = useState<TeamType | null>(null);

  useEffect(() => {
    const { red, blue } = initTeams();

    const units = [...Object.values(red), ...Object.values(blue)].sort(
      (a, b) => b.initiative - a.initiative || Math.random() - 0.5
    );
    setTurnOrder(units);
  }, []);

  useEffect(() => {
    const redAlive = turnOrder.some(
      (u) => u.team === TeamType.RED && !u.isDead
    );

    console.log(redAlive);
    const blueAlive = turnOrder.some(
      (u) => u.team === TeamType.BLUE && !u.isDead
    );

    console.log(blueAlive);

    if (!redAlive) {
      setWinner(TeamType.BLUE);
    } else if (!blueAlive) {
      setWinner(TeamType.RED);
    }
  }, [turnOrder]);

  const currentUnit = turnOrder[currentIndex];
  const nextUnit =
    turnOrder[currentIndex + 1 > turnOrder.length - 1 ? 0 : currentIndex + 1];

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
    const strategy = getStrategy(currentUnit, actionType);

    const targets = strategy.getTargets({
      current: currentUnit,
      turnOrder,
    });

    setPossibleTargets(targets);
    setActionType(actionType);

    if (actionType === "defend") {
      const newOrder = strategy.perform({
        current: currentUnit,
        target: currentUnit,
        turnOrder,
      });

      setTurnOrder(newOrder);
      setPossibleTargets([]);
      nextTurn(currentIndex, newOrder);
    }
  };

  const handleTargetClick = (target: Unit) => {
    if (!actionType) return;

    const strategy = getStrategy(currentUnit, actionType);

    const newOrder = strategy.perform({
      current: currentUnit,
      target,
      turnOrder,
    });

    nextTurn(currentIndex, newOrder);
    setTurnOrder(newOrder);
    setPossibleTargets([]);
  };

  const nextTurn = (currentIndex: number, order?: Unit[]) => {
    const nextIndex =
      currentIndex + 1 > turnOrder.length - 1 ? 0 : currentIndex + 1;

    const tempOrder = order || structuredClone(turnOrder);
    const unit = tempOrder[nextIndex];
    const isUnableToMove = unit.isParalyzed || unit.isDead;

    if (unit.isParalyzed) {
      unit.isParalyzed = false;

      setTurnOrder(tempOrder);
    }

    if (currentIndex === turnOrder.length - 1) {
      tempOrder.forEach((unit) => (unit.isDefending = false));
    }

    if (isUnableToMove || unit.isDefending) {
      nextTurn(nextIndex, tempOrder);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  // const renderTeam = (type: TeamType) => {
  //   const grid = type === "red" ? redGrid : blueGrid;
  //   const team = turnOrder.filter((unit) => unit.team === type);

  //   return (
  //     <div
  //       style={{
  //         display: "grid",
  //         gridTemplateColumns: "repeat(3, 100px)",
  //         gap: 10,
  //       }}
  //     >
  //       {grid.map((row) =>
  //         row.map((key) => {
  //           const unit = team.find(
  //             (u) => `${u.position.y}-${u.position.x}` === key
  //           );

  //           if (!unit) return null;

  //           return (
  //             <UnitComponent
  //               key={unit.id}
  //               unit={unit}
  //               isCurrent={unit.id === currentUnit?.id}
  //               isSelectable={possibleTargets.some((t) => t.id === unit.id)}
  //               onClick={() =>
  //                 possibleTargets.some((t) => t.id === unit.id) &&
  //                 handleTargetClick(unit)
  //               }
  //               isHovered={hoveredUnitId === unit.id}
  //             />
  //           );
  //         })
  //       )}
  //     </div>
  //   );
  // };
  if (!currentUnit) return <div>Loading...</div>;
  return (
    <div className={styles.container}>
      <div className={styles.container__top}>
        <div className={styles.teams__container}>
          <div className={styles.teams}>
            <h2 style={{ color: "rgb(236, 73, 73)" }}>RED TEAM</h2>

            <Team
              team={turnOrder.filter((unit) => unit.team === TeamType.RED)}
              teamGrid={redGrid}
              possibleTargets={possibleTargets}
              hoveredUnitId={hoveredUnitId}
              currentUnit={currentUnit}
              handleTargetClick={handleTargetClick}
            />
          </div>
          <div className={styles.teams}>
            <h2 style={{ color: "rgb(73, 73, 236)" }}>BLUE TEAM</h2>
            <Team
              team={turnOrder.filter((unit) => unit.team === TeamType.BLUE)}
              teamGrid={blueGrid}
              possibleTargets={possibleTargets}
              hoveredUnitId={hoveredUnitId}
              currentUnit={currentUnit}
              handleTargetClick={handleTargetClick}
            />
          </div>
        </div>

        <div className={styles.actions}>
          {winner ? (
            <h3>Winner: {winner} team</h3>
          ) : (
            <div className={styles.actions__container}>
              {[UnitType.MAGE, UnitType.MELEE, UnitType.RANGED].includes(
                currentUnit.type
              ) && (
                <Button
                  className={styles.button}
                  color="danger"
                  onClick={() => handleActionSelect("attack")}
                >
                  Attack
                </Button>
              )}
              {[UnitType.PARALYZER].includes(currentUnit.type) && (
                <Button
                  className={styles.button}
                  color="primary"
                  onClick={() => handleActionSelect("paralyze")}
                >
                  Paralyze
                </Button>
              )}
              {[UnitType.HEALER_SINGLE].includes(currentUnit.type) && (
                <Button
                  className={styles.button}
                  color="edit"
                  onClick={() => handleActionSelect("heal")}
                >
                  Heal
                </Button>
              )}
              {[UnitType.HEALER_MASS].includes(currentUnit.type) && (
                <Button
                  className={styles.button}
                  color="edit"
                  onClick={() => handleActionSelect("heal")}
                >
                  Mass Heal
                </Button>
              )}
              <Button
                className={styles.button}
                color="accent"
                onClick={() => handleActionSelect("defend")}
              >
                Defend
              </Button>
            </div>
          )}
        </div>
      </div>
      <RoundInfo
        unitsTurnOrder={turnOrder}
        currentUnit={currentUnit}
        hoveredUnitId={hoveredUnitId}
        setHoveredUnitId={setHoveredUnitId}
      />
    </div>
  );
};
