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

  constructor(velocity: number) {
    this.velocity = velocity;
  }
}
