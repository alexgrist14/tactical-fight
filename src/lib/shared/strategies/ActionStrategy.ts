import { type Unit } from "../types/Unit";

export interface ActionStrategy {
  getTargets: (params: { current: Unit; turnOrder: Unit[] }) => Unit[];
  perform: (params: {
    current: Unit;
    target: Unit;
    turnOrder: Unit[];
  }) => Unit[];
}
