import { type ActionStrategy } from "./ActionStrategy";

export const meleeAttack: ActionStrategy = {
  getTargets: ({ current, turnOrder }) => {
    const teammates = turnOrder.filter((unit) => unit.team === current.team);
    const firstLineAllies = teammates.filter((ally) => ally.position.y === 0);
    const isFirstLineAlliesDead = !firstLineAllies.some((ally) => !ally.isDead);

    if (!isFirstLineAlliesDead && current.position.y !== 0) return [];

    const targets = turnOrder.filter((unit) => unit.team !== current.team);
    const firstLine = targets.filter((e) => e.position.y === 0);
    const secondLine = targets.filter((e) => e.position.y === 1);
    const isFirstLineDead = !firstLine.some((unit) => !unit.isDead);
    const aliveEnemies = (isFirstLineDead ? secondLine : firstLine).filter(
      (e) => !e.isDead
    );

    return aliveEnemies.filter((e) => {
      return (
        aliveEnemies.length === 1 ||
        Math.abs(e.position.x - current.position.x) <= 1
      );
    });
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
