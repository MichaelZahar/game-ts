'use strict';

import { IPoint } from '../components/Position';
import { ISystem } from '../lib/ecs/ISystem';
import { Engine } from '../lib/ecs/Engine';
import { EntityNodeList } from '../lib/ecs/EntityNodeList';
import { MovementNode } from '../nodes/MovementNode';

export class MovementSystem implements ISystem {
  private nodes: EntityNodeList;
  private worldWidth: number;
  private worldHeight: number;
  public priority: number = 3;

  constructor(worldWidth: number, worldHeight: number) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
  }

  addToEngine(engine: Engine) {
    this.nodes = engine.getNodeList(MovementNode);
  }

  removeFromEngine() {
    this.nodes = null;
  }

  update(time: number) {
    this.nodes.forEach((node) => {
      const motion = node.motion;
      const position = node.position;

      position.x = getFixed(position.x + motion.velocityX * time, this.worldWidth);
      position.y = getFixed(position.y + motion.velocityY * time, this.worldHeight);
    });
  }
}

function getFixed(value: number, maxValue: number): number {
  if (value < 0) {
    return maxValue + value;
  }

  if (value > maxValue) {
    return value % maxValue;
  }

  return value;
}
