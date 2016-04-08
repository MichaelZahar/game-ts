'use strict';

import { EntityNode } from '../lib/ecs/EntityNode';
import { Camera } from '../components/Camera';
import { Position } from '../components/Position';

export class CameraNode extends EntityNode {
  static components = [Camera, Position];

  get camera(): Camera {
    return this.entity.getComponent(Camera);
  }

  get position(): Position {
    return this.entity.getComponent(Position);
  }
}
