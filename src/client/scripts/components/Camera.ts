'use strict';

import { IPoint } from './Position';

export interface ISize {
  width: number;
  height: number;
}

export class Camera {
  isRendering: boolean;
  fieldOfView: ISize;
  pointOfView: IPoint;

  constructor(isRendering: boolean, fieldOfView: ISize, pointOfView: IPoint) {
    this.isRendering = isRendering;
    this.fieldOfView = fieldOfView;
    this.pointOfView = pointOfView;
  }
}
