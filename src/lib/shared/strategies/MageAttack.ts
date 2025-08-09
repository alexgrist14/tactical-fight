import { type ActionStrategy } from "./ActionStrategy";

export const mageAttack: ActionStrategy = {
  getTargets: ({ enemies }) => {
    return Object.values(enemies).filter((e) => !e.isDead);
  },
  perform: ({ current, enemies }) => {
    const damage = current.damage || 0;

    const tempEnemies = structuredClone(enemies);

    Object.keys(tempEnemies).forEach((key) => {
      const tempTarget = tempEnemies[key];
      const effectiveDamage = tempTarget.isDefending ? damage * 0.5 : damage;

      tempTarget.health -= effectiveDamage;
      if (tempTarget.health <= 0) tempTarget.isDead = true;
    });

    return { enemiesResult: tempEnemies };
  },
};
