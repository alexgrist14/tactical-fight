import { type FC } from "react";
import type { Unit } from "../../shared/types/Unit";
import styles from "./RoundInfo.module.scss";
import { UnitComponent } from "../Unit/UnitComponent";

interface RoundInfoProps {
  unitsTurnOrder: Unit[];
  currentUnit: Unit | null;
  hoveredUnitId?: string | null;
  setHoveredUnitId?: (id: string | null) => void;
}

const RoundInfo: FC<RoundInfoProps> = ({
  unitsTurnOrder,
  currentUnit,
  hoveredUnitId,
  setHoveredUnitId,
}) => {
  return (
    <div className={styles.container}>
      <h2>Round order:</h2>
      <div className={styles.units}>
        {unitsTurnOrder.map((unit) => (
          <div key={unit.id}>
            <UnitComponent
              unit={unit}
              hideInfo
              isCurrent={unit.id === currentUnit?.id}
              isHovered={hoveredUnitId === unit.id}
              onMouseEnter={() => setHoveredUnitId?.(unit.id)}
              onMouseLeave={() => setHoveredUnitId?.(null)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoundInfo;
