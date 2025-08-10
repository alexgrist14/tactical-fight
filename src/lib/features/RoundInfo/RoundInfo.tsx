import { type FC } from "react";
import type { Unit } from "../../shared/types/Unit";
import styles from "./RoundInfo.module.scss";
import { UnitComponent } from "../Unit/UnitComponent";

interface RoundInfoProps {
  unitsTurnOrder: Unit[];
  currentUnit: Unit | null;
}

const RoundInfo: FC<RoundInfoProps> = ({ unitsTurnOrder, currentUnit }) => {
  return (
    <div className={styles.container}>
      <h2>Round order:</h2>
      <div className={styles.units}>
        {unitsTurnOrder.map((unit) => (
          <UnitComponent
            key={unit.id}
            unit={unit}
            hideInfo
            isCurrent={unit.id === currentUnit?.id}
          />
        ))}
      </div>
    </div>
  );
};

export default RoundInfo;
