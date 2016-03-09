'use strict';

/**
 * Объект хранит настройки управления объектом.
 */
export class HeroControl {
  left: number = 37;
  up: number = 38;
  right: number = 39;
  down: number = 40;
  attack: number = 35;
  run: number = 90;
  reload: number = 100;
  rotationSpeed: number = 0.4;
  turned: boolean = false;

  constructor(left?: number, up?: number, right?: number, down?: number, attack?: number, run?: number, reload?: number, rotationSpeed?: number) {
    this.left = left == null ? this.left : left;
    this.up = up == null ? this.up : up;
    this.right = right == null ? this.right : right;
    this.down = down == null ? this.down : down;
    this.attack = attack == null ? this.attack : attack;
    this.run = run == null ? this.run : run;
    this.reload = reload == null ? this.reload : reload;
    this.rotationSpeed = rotationSpeed == null ? this.rotationSpeed : rotationSpeed;
  }
}
