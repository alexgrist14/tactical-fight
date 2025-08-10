import { type ActionStrategy } from "./ActionStrategy";

export const healMass: ActionStrategy = {
  getTargets: ({ current, turnOrder }) => {
    return turnOrder.filter((e) => e.team === current.team && !e.isDead);
  },
  perform: ({ current, turnOrder }) => {
    const heal = current.heal || 0;

    const tempOrder = structuredClone(turnOrder);

    tempOrder.forEach((unit) => {
      if (unit.isDead || unit.team !== current.team) return;

      const resultHeal = unit.health + heal;

      unit.health = resultHeal > unit.maxHealth ? unit.maxHealth : resultHeal;
    });

    return tempOrder;
  },
};
