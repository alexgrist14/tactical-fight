import { type ActionStrategy } from "./ActionStrategy";

export const healMass: ActionStrategy = {
  getTargets: ({ allies }) => {
    return Object.values(allies).filter((e) => !e.isDead);
  },
  perform: ({ current, allies }) => {
    const heal = current.heal || 0;

    const tempAllies = structuredClone(allies);

    Object.keys(tempAllies).forEach((key) => {
      const tempTarget = tempAllies[key];
      const resultHeal = tempTarget.health + heal;

      tempTarget.health =
        resultHeal > tempTarget.maxHealth ? tempTarget.maxHealth : resultHeal;
    });

    return { alliesResult: tempAllies };
  },
};
