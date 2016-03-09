import { EntityNode, IEntityNodeStatic } from './EntityNode';
import { EntityNodeList } from './EntityNodeList';
import { Entity } from './Entity';
import { Engine }  from './Engine';
import { IFamily } from './IFamily';

export type CMFConstructor = { new(nodeClass: Function, engine: Engine): ComponentMatchingFamily };

export class ComponentMatchingFamily implements IFamily {
  private nodes: EntityNodeList = new EntityNodeList();
  private entities: Map<Entity, EntityNode> = new Map();
  private nodeClass: IEntityNodeStatic;
  private engine: Engine;

  constructor(nodeClass, engine) {
    this.nodeClass = nodeClass;
    this.engine = engine;
  }

  get nodeList(): EntityNodeList {
    return this.nodes;
  }

  newEntity = (entity: Entity) => {
    this.addIfMatch(entity);
  }

  componentAddedToEntity = (entity: Entity) => {
    this.addIfMatch(entity);
  }

  removeEntity(entity: Entity) {
    this.removeIfMatch(entity);
  }

  componentRemovedFromEntity = (entity: Entity) => {
    this.removeIfMatch(entity);
  }

  addIfMatch(entity: Entity) {
    if (!this.entities.has(entity)) {
      for (let componentClass of this.nodeClass.components) {
        if (!entity.hasComponent(componentClass)) {
          return;
        }
      }

      const node = new this.nodeClass(entity);

      this.entities.set(entity, node);
      entity.componentRemoved.add(this.componentRemovedFromEntity);
      this.nodes.add(node);
    }
  }

  removeIfMatch(entity: Entity) {
    if (this.entities.has(entity)) {
      const node = this.entities.get(entity);
      entity.componentRemoved.remove(this.componentRemovedFromEntity);

      this.entities.delete(entity);
      this.nodes.delete(node);
    }
  }

  clean() {
    this.entities.clear();
    this.nodes.clear();
  }
}
