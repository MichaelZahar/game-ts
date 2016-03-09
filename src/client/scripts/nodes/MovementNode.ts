'use strict';

import { EntityNode } from '../lib/ecs/EntityNode';
import { Motion } from '../components/Motion';
import { Position } from '../components/Position';

export class MovementNode extends EntityNode {
  static components = [Motion, Position];

  get motion(): Motion {
    return this.entity.getComponent(Motion);
  }

  get position(): Position {
    return this.entity.getComponent(Position);
  }
}
