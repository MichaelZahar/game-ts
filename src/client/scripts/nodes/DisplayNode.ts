'use strict';

import { EntityNode } from '../lib/ecs/EntityNode';
import { Appearance } from '../components/Appearance';
import { Position } from '../components/Position';

export class DisplayNode extends EntityNode {
  static components = [Appearance, Position];

  get appearance() {
    return this.entity.getComponent(Appearance);
  }

  get position() {
    return this.entity.getComponent(Position);
  }
}
