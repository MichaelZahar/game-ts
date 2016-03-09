import { Engine } from './Engine';

export interface ISystem {
  priority: number;
  addToEngine(engine: Engine): void;
  removeFromEngine(engine: Engine): void;
  update(time: number): void;
}
