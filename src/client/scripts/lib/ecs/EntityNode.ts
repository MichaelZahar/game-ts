import { Entity } from './Entity';

export interface IEntityNodeStatic {
  components: { new(...args: any[]): Object }[];
  new(entity: Entity): EntityNode;
}

export class EntityNode {
  static components: { new(...args: any[]): Object }[] = [];
  public entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }
}
