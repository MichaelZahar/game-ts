'use strict';

import { ISystem } from '../lib/ecs/ISystem';
import { Engine } from '../lib/ecs/Engine';
import { EntityNodeList } from '../lib/ecs/EntityNodeList';
import { MovementNode } from '../nodes/MovementNode';

export class MovementSystem implements ISystem {
  private nodes: EntityNodeList;
  private worldWidth: number;
  private worldHeight: number;
  private endless: boolean;
  public priority: number = 3;

  constructor(worldWidth: number, worldHeight: number, endless?: boolean) {
    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.endless = endless || false;
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
      const x = Math.round(position.x + motion.velocityX * time / 1000);
      const y = Math.round(position.y + motion.velocityY * time / 1000);

      if (this.endless) {
        position.x = getFixed(x, this.worldWidth);
        position.y = getFixed(y, this.worldHeight);
      } else {
        position.x = Math.max(0, Math.min(x, this.worldWidth));
        position.y = Math.max(0, Math.min(y, this.worldHeight));
      }
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
