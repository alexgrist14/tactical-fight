import { type Unit, type Units } from "../types/Unit";

export interface ActionStrategy {
  getTargets: (params: {
    current: Unit;
    allies: Units;
    enemies: Units;
  }) => Unit[];
  perform: (params: {
    current: Unit;
    target: Unit;
    allies: Units;
    enemies: Units;
  }) => { alliesResult?: Units; enemiesResult?: Units };
}
