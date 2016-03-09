'use strict';

import { EntityNode } from '../lib/ecs/EntityNode';
import { HeroControl } from '../components/HeroControl';
import { Position } from '../components/Position';
import { Motion } from '../components/Motion';

export class HeroControlNode extends EntityNode {
  static components = [HeroControl, Position, Motion];

  get heroControl(): HeroControl {
    return this.entity.getComponent(HeroControl);
  }

  get position(): Position {
    return this.entity.getComponent(Position);
  }

  get motion(): Motion {
    return this.entity.getComponent(Motion);
  }
}
