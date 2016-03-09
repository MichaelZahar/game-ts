'use strict';

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

      position.x += motion.velocityX * time;
      position.y += motion.velocityY * time;

      if (position.x < 0) {
        position.x = this.worldWidth + position.x;
      } else if (position.x > this.worldWidth) {
        position.x = position.x % this.worldWidth;
      }

      if (position.y < 0) {
        position.y = this.worldHeight + position.y;
      } else if (position.y > this.worldHeight) {
        position.y = position.y % this.worldHeight;
      }
    });
  }
}
