import { type ActionStrategy } from "./ActionStrategy";

export const mageAttack: ActionStrategy = {
  getTargets: ({ current, turnOrder }) => {
    return turnOrder.filter((e) => e.team !== current.team && !e.isDead);
  },
  perform: ({ current, turnOrder }) => {
    const damage = current.damage || 0;

    const tempOrder = structuredClone(turnOrder);

    tempOrder.forEach((unit) => {
      if (unit.isDead || unit.team === current.team) return;

      const effectiveDamage = unit.isDefending ? damage * 0.5 : damage;

      unit.health -= effectiveDamage;
      if (unit.health <= 0) unit.isDead = true;
    });

    return tempOrder;
  },
};
