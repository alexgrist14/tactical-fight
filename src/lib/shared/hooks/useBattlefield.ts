import { useCallback, useEffect, useMemo, useState } from "react";
import type { Unit, UnitAction } from "../types/Unit";
import { TeamType } from "../types/enums";
import { getStrategy } from "../utils/common";
import { initTeams } from "../utils/initTeams";

export const useBattlefield = () => {
  const [turnOrder, setTurnOrder] = useState<Unit[]>([]);
  const [winner, setWinner] = useState<TeamType | null>(null);
  const [possibleTargets, setPossibleTargets] = useState<Unit[]>([]);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [actionType, setActionType] = useState<UnitAction>();

  const currentUnit = useMemo(
    () => turnOrder[currentIndex],
    [currentIndex, turnOrder]
  );

  const checkWinner = useCallback((order: Unit[]) => {
    const redAlive = order.some((u) => u.team === TeamType.RED && !u.isDead);

    const blueAlive = order.some((u) => u.team === TeamType.BLUE && !u.isDead);

    if (!redAlive) {
      setWinner(TeamType.BLUE);
    } else if (!blueAlive) {
      setWinner(TeamType.RED);
    }
  }, []);

  const nextTurn = useCallback(
    (currentIndex: number, order?: Unit[]) => {
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

      checkWinner(tempOrder);

      if (isUnableToMove || unit.isDefending) {
        nextTurn(nextIndex, tempOrder);
      } else {
        setCurrentIndex(nextIndex);
      }
    },
    [checkWinner, turnOrder]
  );

  const completeTurn = useCallback(
    (order: Unit[]) => {
      setTurnOrder(order);
      setPossibleTargets([]);
      nextTurn(currentIndex, order);
    },
    [nextTurn, currentIndex]
  );

  const handleTargetClick = useCallback(
    (target: Unit) => {
      if (!actionType) return;

      const strategy = getStrategy(currentUnit, actionType);

      const newOrder = strategy.perform({
        current: currentUnit,
        target,
        turnOrder,
      });

      completeTurn(newOrder);
    },
    [completeTurn, currentUnit, actionType, turnOrder]
  );

  const handleActionSelect = useCallback(
    (actionType: UnitAction) => {
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

        completeTurn(newOrder);
      }
    },
    [completeTurn, currentUnit, turnOrder]
  );

  useEffect(() => {
    const { red, blue } = initTeams();

    const units = [...Object.values(red), ...Object.values(blue)].sort(
      (a, b) => b.initiative - a.initiative || Math.random() - 0.5
    );
    setTurnOrder(units);
  }, []);

  return {
    winner,
    currentUnit,
    turnOrder,
    possibleTargets,
    hoveredUnitId,
    setHoveredUnitId,
    handleActionSelect,
    handleTargetClick,
  };
};
