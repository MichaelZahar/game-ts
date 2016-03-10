import { Entity } from './Entity';

export interface IEntityNodeStatic {
  components: Function[];
  new(entity: Entity): EntityNode;
}

export class EntityNode {
  static components: Function[] = [];
  public entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }
}
