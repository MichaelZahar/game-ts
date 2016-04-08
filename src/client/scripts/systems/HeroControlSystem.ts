'use strict';

import { ISystem } from '../lib/ecs/ISystem';
import { Engine } from '../lib/ecs/Engine';
import { EntityNodeList } from '../lib/ecs/EntityNodeList';
import { HeroControlNode } from '../nodes/HeroControlNode';

export class HeroControlSystem implements ISystem {
  private nodes: EntityNodeList;
  private state: {[keyCode: number]: boolean} = {};

  public priority: number = 2;

  constructor() {
    window.addEventListener('keydown', (event) => {
      this.state[event.keyCode] = true;
    });

    window.addEventListener('keyup', (event) => {
      this.state[event.keyCode] = false;
    });
  }

  addToEngine(engine: Engine) {
    this.nodes = engine.getNodeList(HeroControlNode);
  }

  removeFromEngine() {
    this.nodes = null;
  }

  update(time: number) {
    this.nodes.forEach((node) => {
      this.updateRotation(node, time);
      this.updateVelocity(node);
    });
  }

  updateRotation(node: HeroControlNode, time: number) {
    const heroControl = node.heroControl;
    const position = node.position;

    const leftRotation = this.state[heroControl.left];
    const rightRotation = this.state[heroControl.right];

    if (this.state[heroControl.down] && !heroControl.turned) {
      heroControl.turned = true;
      position.rotation += 180;
    }

    if (!this.state[heroControl.down]) {
      heroControl.turned = false;
    }

    if (leftRotation) {
      position.rotation -= Math.round(heroControl.rotationSpeed * time / 1000);
    }

    if (rightRotation) {
      position.rotation += Math.round(heroControl.rotationSpeed * time / 1000)  ;
    }

    position.rotation = position.rotation % 360;
  }

  updateVelocity(node: HeroControlNode) {
    const heroControl = node.heroControl;
    const position = node.position;
    const motion = node.motion;
    const move = this.state[heroControl.up];
    const back = this.state[heroControl.down];
    const cos = Math.cos(position.rotationInRad);
    const sin = Math.sin(position.rotationInRad);

    if (back) {
      motion.velocityX = -motion.velocity / 2 * cos;
      motion.velocityY = -motion.velocity / 2 * sin;
    } else if (move) {
      motion.velocityX = motion.velocity * cos;
      motion.velocityY = motion.velocity * sin;
    } else {
      motion.velocityX = motion.velocityY = 0;
    }
  }
}
