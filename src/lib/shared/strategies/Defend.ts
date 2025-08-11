import { type ActionStrategy } from "./ActionStrategy";

export const defend: ActionStrategy = {
  getTargets: ({ current }) => {
    return [current];
  },
  perform: ({ current, turnOrder }) => {
    const tempOrder = structuredClone(turnOrder);
    const target = tempOrder.find((unit) => unit.id === current.id);

    if (target) {
      target.isDefending = true;
    }

    return tempOrder;
  },
};
