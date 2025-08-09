import { type ActionStrategy } from "./ActionStrategy";

export const defend: ActionStrategy = {
  getTargets: ({ current }) => {
    return [current];
  },
  perform: ({ current, allies }) => {
    const tempAllies = structuredClone(allies);

    tempAllies[`${current.position.y}-${current.position.x}`].isDefending =
      true;

    return {
      alliesResult: tempAllies,
    };
  },
};
