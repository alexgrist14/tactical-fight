import { type ActionStrategy } from "./ActionStrategy";

export const rangedAttack: ActionStrategy = {
  getTargets: ({ current, turnOrder }) => {
    return turnOrder.filter((e) => e.team !== current.team && !e.isDead);
  },
  perform: ({ current, target, turnOrder }) => {
    const damage = current.damage || 0;
    const effectiveDamage = target.isDefending ? damage * 0.5 : damage;

    const tempOrder = structuredClone(turnOrder);
    const tempTarget = tempOrder.find((unit) => unit.id === target.id);

    if (tempTarget) {
      tempTarget.health -= effectiveDamage;
      if (tempTarget.health <= 0) tempTarget.isDead = true;
    }

    return tempOrder;
  },
};
