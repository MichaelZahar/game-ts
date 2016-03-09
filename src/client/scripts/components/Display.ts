'use strict';

import { IPoint } from './Position';

export class Display {
  position: IPoint;

  constructor(position: IPoint) {
    this.position = position;
  }
}
