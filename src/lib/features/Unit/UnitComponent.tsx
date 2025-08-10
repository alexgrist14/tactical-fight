import React from "react";
import type { Unit } from "../../shared/types/Unit";
import styles from "./UnitComponent.module.scss";
import classNames from "classnames";

type Props = {
  unit: Unit;
  isCurrent: boolean;
  isSelectable?: boolean;
  hideInfo?: boolean;
  onClick?: () => void;
};

export const UnitComponent: React.FC<Props> = ({
  unit,
  isCurrent,
  isSelectable,
  hideInfo,
  onClick,
}) => {
  const percent = 100 - (unit.health / unit.maxHealth) * 100;

  return (
    <div
      className={classNames(styles.container, {
        [styles.current]: isCurrent,
        [styles.selectable]: isSelectable,
        [styles.paralyzed]: unit.isParalyzed,
        [styles.defending]: unit.isDefending,
        [styles.current_active]: isCurrent && hideInfo,
      })}
      onClick={onClick}
      style={{
        opacity: unit.isDead ? 0.3 : 1,
        cursor: isSelectable ? "pointer" : "default",
      }}
    >
      <div className={styles.content}>
        <img className={styles.icon} src={`/${unit.icon}`} alt={unit.name} />
        {percent < 100 && (
          <div
            className={styles.health}
            style={{
              height: `${percent}%`,
              opacity: 0.4,
              transition: "height 0.5s",
            }}
          />
        )}
      </div>
      {!hideInfo && (
        <div className={styles.name}>
          <h3 className={styles.title}>{unit.name}</h3>
          <span className={styles.hp}>
            {!unit.isDead
              ? `${Math.round(unit.health)} / ${unit.maxHealth}`
              : "Dead"}
          </span>
        </div>
      )}
    </div>
  );
};
