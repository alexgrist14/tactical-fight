import { type Unit } from "../types/Unit";

export interface ActionStrategy {
  getTargets: (params: {
    current: Unit;
    turnOrder: Unit[];
    // allies: Units;
    // enemies: Units;
  }) => Unit[];
  perform: (params: {
    current: Unit;
    target: Unit;
    turnOrder: Unit[];
    // allies: Units;
    // enemies: Units;
  }) => Unit[];
}
