'use strict';

import { Entity } from '../lib/ecs/Entity';
import { Appearance } from './Appearance';

export interface IPoint {
  x: number;
  y: number;
}

/**
 * Класс, который определяет компонент хранящий данные о положении и
 * повороте объекта.
 */
export class Position {
  /**
   * Так как entity может иметь "родителя" (другой entity, кооридинаты
   * которого определяют систему координат дочернего entity) нужна
   * вспомогательная функция для получения Position в главной системе
   * координат.
   */
  static getByEntity(entity: Entity): Position {
    const position = entity.getComponent(Position);
    const result = new Position(position.x, position.y, position.rotation);
    let root = entity;

    while (root.parent) {
      root = root.parent;

      if (!root) {
        break;
      }

      let parentPosition = root.getComponent(Position);
      const pivot = root.getComponent(Appearance).options.pivot || { x: 0, y: 0 };
      const cosA = Math.cos(parentPosition.rotationInRad);
      const sinA = Math.sin(parentPosition.rotationInRad);
      const newX = parentPosition.x + (result.x - pivot.x) * cosA - (result.y - pivot.y) * sinA;
      const newY = parentPosition.y + (result.x - pivot.x) * sinA + (result.y - pivot.y) * cosA;

      result.x = newX;
      result.y = newY;
      result.rotation += parentPosition.rotation;
    }

    return result;
  }

  x: number;
  y: number;
  rotation: number = 0;

  constructor(x: number, y: number, rotation?: number) {
    this.x = x;
    this.y = y;
    this.rotation = rotation || this.rotation;
  }

  get rotationInRad() {
    return this.rotation * Math.PI / 180;
  }
}
