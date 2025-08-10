import { type FC } from "react";
import type { Unit } from "../../../shared/types/Unit";
import { UnitComponent } from "../../Unit/UnitComponent";

interface TeamProps {
  teamGrid: string[][];
  team: Unit[];
  hoveredUnitId: string | null;
  currentUnit: Unit;
  possibleTargets: Unit[];
  handleTargetClick: (target: Unit) => void;
}

const Team: FC<TeamProps> = ({
  teamGrid,
  team,
  hoveredUnitId,
  currentUnit,
  possibleTargets,
  handleTargetClick,
}) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 100px)",
        gap: 10,
      }}
    >
      {teamGrid.map((row) =>
        row.map((key) => {
          const unit = team.find(
            (u) => `${u.position.y}-${u.position.x}` === key
          );

          if (!unit) return null;

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
              isHovered={hoveredUnitId === unit.id}
            />
          );
        })
      )}
    </div>
  );
};

export default Team;
