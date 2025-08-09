import { type ActionStrategy } from "./ActionStrategy";

export const paralyze: ActionStrategy = {
  getTargets: ({ enemies }) => {
    return Object.values(enemies).filter((e) => !e.isDead);
  },
  perform: ({ target, enemies }) => {
    const tempEnemies = structuredClone(enemies);
    const tempTarget = tempEnemies[`${target.position.y}-${target.position.x}`];

    tempTarget.isParalyzed = true;
    tempTarget.isDefending = false;

    return { enemiesResult: tempEnemies };
  },
};
