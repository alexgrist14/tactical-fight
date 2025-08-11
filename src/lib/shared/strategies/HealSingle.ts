import { type ActionStrategy } from "./ActionStrategy";

export const healSingle: ActionStrategy = {
  getTargets: ({ current, turnOrder }) => {
    return turnOrder.filter((u) => u.team === current.team && !u.isDead);
  },
  perform: ({ current, target, turnOrder }) => {
    const heal = current.heal || 0;

    const tempOrder = structuredClone(turnOrder);
    const tempTarget = tempOrder.find((unit) => unit.id === target.id);

    if (tempTarget) {
      const resultHeal = tempTarget.health + heal;
      tempTarget.health =
        resultHeal > tempTarget.maxHealth ? tempTarget.maxHealth : resultHeal;
    }

    return tempOrder;
  },
};
