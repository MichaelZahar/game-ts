'use strict';

import { EntityNode } from '../lib/ecs/EntityNode';
import { Appearance } from '../components/Appearance';
import { Camera } from '../components/Camera';
import { Position } from '../components/Position';

export class CameraNode extends EntityNode {
  static components = [Appearance, Camera, Position];

  get appearance(): Appearance {
    return this.entity.getComponent(Appearance);
  }

  get camera(): Camera {
    return this.entity.getComponent(Camera);
  }

  get position(): Position {
    return this.entity.getComponent(Position);
  }
}
