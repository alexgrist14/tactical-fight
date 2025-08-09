import { type ActionStrategy } from "./ActionStrategy";

export const rangedAttack: ActionStrategy = {
  getTargets: ({ enemies }) => {
    return Object.values(enemies).filter((e) => !e.isDead);
  },
  perform: ({ current, target, enemies }) => {
    const damage = current.damage || 0;
    const effectiveDamage = target.isDefending ? damage * 0.5 : damage;

    const tempEnemies = structuredClone(enemies);
    const tempTarget = tempEnemies[`${target.position.y}-${target.position.x}`];

    tempTarget.health -= effectiveDamage;
    if (tempTarget.health <= 0) tempTarget.isDead = true;

    return { enemiesResult: tempEnemies };
  },
};
