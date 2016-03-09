import { Entity } from './Entity';
import { EntityNodeList } from './EntityNodeList';

export interface IFamily {
  nodeList: EntityNodeList;
  newEntity(entity: Entity): void;
  removeEntity(entity: Entity): void;
  componentAddedToEntity<T>(entityEntity, componentClass: { new(...args: Array<any>): T }): void;
  componentRemovedFromEntity<T>(entityEntity, componentClass: { new(...args: Array<any>): T }): void;
  clean(): void;
}
