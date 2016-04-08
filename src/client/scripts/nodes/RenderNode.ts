'use strict';

import { EntityNode } from '../lib/ecs/EntityNode';
import { Display } from '../components/Display';
import { Position } from '../components/Position';

export class RenderNode extends EntityNode {
  static components = [ Display, Position ];

  get display(): Display {
    return this.entity.getComponent(Display);
  }

  get position(): Position {
    return this.entity.getComponent(Position);
  }
}
