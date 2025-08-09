import React from "react";
import type { Unit } from "../shared/types/Unit";

type Props = {
  unit: Unit;
  isCurrent: boolean;
  isSelectable: boolean;
  onClick: () => void;
};

export const UnitComponent: React.FC<Props> = ({
  unit,
  isCurrent,
  isSelectable,
  onClick,
}) => {
  const percent = (unit.health / unit.maxHealth) * 100;

  return (
    <div
      onClick={onClick}
      style={{
        border: isCurrent
          ? "2px solid yellow"
          : isSelectable
          ? "2px solid green"
          : "1px solid gray",
        backgroundColor: unit.isParalyzed
          ? "purple"
          : unit.isDefending
          ? "blue"
          : "white",
        opacity: unit.isDead ? 0.3 : 1,
        padding: 8,
        color: "black",
        cursor: isSelectable ? "pointer" : "default",
      }}
    >
      <div>
        <strong>{unit.name}</strong> ({unit.health})
      </div>
      <div style={{ height: 10, width: "100%", backgroundColor: "#ccc" }}>
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor: "red",
          }}
        />
      </div>
    </div>
  );
};
