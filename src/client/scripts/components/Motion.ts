'use strict';

/**
 * Компонент хранит данные о скорости объекта.
 * Объекту задается модуль скорости, скорости по
 * `x` и `y` определяет MovementSystem.
 */
export class Motion {
  velocity: number;
  velocityX: number = 0;
  velocityY: number = 0;

  constructor(velocity: number, velocityX?: number, velocityY?: number) {
    this.velocity = velocity;
    this.velocityX = velocityX || this.velocityX;
    this.velocityY = velocityY || this.velocityY;
  }
}
