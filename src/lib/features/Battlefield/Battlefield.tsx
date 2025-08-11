import React from "react";
import { useBattlefield } from "../../shared/hooks/useBattlefield";
import { TeamType } from "../../shared/types/enums";
import type { UnitAction } from "../../shared/types/Unit";
import Button from "../../shared/ui/Button/Button";
import { blueGrid, redGrid, unitButtons } from "../../shared/utils/common";
import RoundInfo from "../RoundInfo/RoundInfo";
import styles from "./Battlefield.module.scss";
import Team from "./Team/Team";

export const Game: React.FC = () => {
  const {
    winner,
    currentUnit,
    turnOrder,
    handleActionSelect,
    handleTargetClick,
    hoveredUnitId,
    possibleTargets,
    setHoveredUnitId,
  } = useBattlefield();

  if (!currentUnit) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.container__top}>
        <div className={styles.teams__container}>
          <div className={styles.teams}>
            <h2 className={styles.red}>RED TEAM</h2>
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
            <h2 className={styles.blue}>BLUE TEAM</h2>
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
              {Object.keys(unitButtons).map((key, i) => {
                const button = unitButtons[key];

                if (button.types && !button.types.includes(currentUnit.type)) {
                  return null;
                }

                return (
                  <Button
                    key={key + i}
                    className={styles.button}
                    color={button.color}
                    onClick={() => handleActionSelect(key as UnitAction)}
                  >
                    {button.text}
                  </Button>
                );
              })}
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
