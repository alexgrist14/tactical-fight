import classNames from "classnames";
import { useMemo, type FC } from "react";
import type { Unit } from "../../shared/types/Unit";
import { SvgShield } from "../../shared/ui/SvgShield/SvgShield";
import { SvgStun } from "../../shared/ui/SvgStun/SvgStun";
import styles from "./UnitComponent.module.scss";

interface UnitComponentProps {
  unit: Unit;
  isCurrent: boolean;
  isSelectable?: boolean;
  hideInfo?: boolean;
  onClick?: () => void;
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const UnitComponent: FC<UnitComponentProps> = ({
  unit,
  isCurrent,
  isSelectable,
  hideInfo,
  onClick,
  isHovered,
  onMouseEnter,
  onMouseLeave,
}) => {
  const percent = useMemo(
    () => 100 - (unit.health / unit.maxHealth) * 100,
    [unit.health, unit.maxHealth]
  );

  return (
    <div
      className={classNames(styles.container, {
        [styles.current]: isCurrent,
        [styles.selectable]: isSelectable,
        [styles.paralyzed]: unit.isParalyzed,
        [styles.defending]: unit.isDefending,
        [styles.current_active]: isCurrent && hideInfo,
        [styles.container_active]: isCurrent && hideInfo,
        [styles.hovered]: isHovered,
        [styles.dead]: unit.isDead,
      })}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={styles.content}>
        {unit.isParalyzed && (
          <SvgStun className={styles.svg} pathStyle={{ fill: "white" }} />
        )}
        {unit.isDefending && <SvgShield className={styles.svg} />}
        <img className={styles.icon} src={`/${unit.icon}`} alt={unit.name} />
        {percent < 100 && (
          <div
            className={styles.health}
            style={{
              height: `${percent}%`,
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
