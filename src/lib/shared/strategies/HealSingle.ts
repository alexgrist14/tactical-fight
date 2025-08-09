import { type ActionStrategy } from "./ActionStrategy";

export const healSingle: ActionStrategy = {
  getTargets: ({ allies }) => {
    return Object.values(allies).filter((e) => !e.isDead);
  },
  perform: ({ current, target, allies }) => {
    console.log(current);
    const heal = current.heal || 0;

    const tempAllies = structuredClone(allies);
    const tempTarget = tempAllies[`${target.position.y}-${target.position.x}`];

    const resultHeal = tempTarget.health + heal;
    tempTarget.health =
      resultHeal > tempTarget.maxHealth ? tempTarget.maxHealth : resultHeal;

    return { alliesResult: tempAllies };
  },
};
