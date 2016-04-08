'use strict';

import { IPoint } from './Position';

export interface ISize {
  width: number;
  height: number;
}

export interface ICameraOptions {
  isRendering?: boolean;
  rotation?: number;
  followRotation?: boolean;
  pointOfView?: IPoint;
  fieldOfView: ISize;
}

export class Camera implements ICameraOptions {
  isRendering: boolean = true;
  followRotation: boolean = false;
  rotation: number = 0;
  pointOfView: IPoint = { x: 0, y: 0 };
  fieldOfView: ISize;

  constructor(options: ICameraOptions) {
    if (options.hasOwnProperty('isRendering')) {
      this.isRendering = options.isRendering;
    }

    if (options.hasOwnProperty('followRotation')) {
      this.followRotation = options.followRotation;
    }

    if (options.hasOwnProperty('rotation')) {
      this.rotation = options.rotation;
    }

    this.pointOfView = options.pointOfView || this.pointOfView;
    this.fieldOfView = options.fieldOfView;
  }
}
