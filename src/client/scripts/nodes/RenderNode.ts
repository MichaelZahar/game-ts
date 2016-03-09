'use strict';

import { EntityNode } from '../lib/ecs/EntityNode';
import { Appearance } from '../components/Appearance';
import { Display } from '../components/Display';

export class RenderNode extends EntityNode {
  static components = [ Appearance, Display ];

  get appearance(): Appearance {
    return this.entity.getComponent(Appearance);
  }

  get display(): Display {
    return this.entity.getComponent(Display);
  }
}
