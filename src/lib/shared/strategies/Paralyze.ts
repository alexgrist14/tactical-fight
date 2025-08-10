import { type ActionStrategy } from "./ActionStrategy";

export const paralyze: ActionStrategy = {
  getTargets: ({ current, turnOrder }) => {
    return turnOrder.filter((e) => e.team !== current.team && !e.isDead);
  },
  perform: ({ target, turnOrder }) => {
    const tempOrder = structuredClone(turnOrder);
    const tempTarget = tempOrder.find((unit) => unit.id === target.id);

    if (tempTarget) {
      tempTarget.isParalyzed = true;
      tempTarget.isDefending = false;
    }

    return tempOrder;
  },
};
