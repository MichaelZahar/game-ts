'use strict';

import { Signal } from 'signals';
import { Entity, IComponentAdded, IComponentRemoved } from './Entity';
import { ComponentMatchingFamily, CMFConstructor } from './ComponentMatchingFamily';
import { EntityNode } from './EntityNode';
import { EntityNodeList } from './EntityNodeList';
import { ISystem } from './ISystem';

export class Engine {
  private entityList: Set<Entity> = new Set();
  private systemList: Set<ISystem> = new Set();
  private families: Map<any, any> = new Map();
  private familyClass: CMFConstructor = ComponentMatchingFamily;

  public updateComplete: Signal = new Signal();
  public updating: boolean = false;

  addEntity = (entity: Entity) => {
    const entitiesCount = this.entityList.size;

    this.entityList.add(entity);

    if (entitiesCount !== this.entityList.size) {
      entity.componentAdded.add(this.componentAdded);
      entity.componentRemoved.add(this.componentRemoved);
      entity.childAdded.add(this.addEntity);
      entity.childRemoved.add(this.removeEntity);

      this.families.forEach((nodeObject, family) => family.addEntity(entity));

      entity.childs.forEach(this.addEntity);
    }
  }

  removeEntity = (entity: Entity) => {
    const result = this.entityList.delete(entity);

    if (result) {
      entity.componentAdded.remove(this.componentAdded);
      entity.componentRemoved.remove(this.componentRemoved);
      entity.childAdded.remove(this.addEntity);
      entity.childRemoved.remove(this.removeEntity);

      this.families.forEach((nodeObject, family) => family.removeEntity(entity));
      this.entityList.delete(entity);

      entity.childs.forEach(this.removeEntity);
    }
  }

  removeAllEntities() {
    this.entityList.forEach(this.removeEntity);
  }

  componentAdded = <T>(event: IComponentAdded<T>) => {
    this.families.forEach((family, nodeObject) => {
      family.componentAddedToEntity(event.entity, event.addedComponent);
    });
  }

  componentRemoved = <T>(event: IComponentRemoved<T>) => {
    this.families.forEach((family, nodeObject) => {
      family.componentRemovedFromEntity(event.entity, event.removedComponent);
    });
  }

  getNodeList(nodeClass: { new(...args: Array<any>): EntityNode }): EntityNodeList {
    if (this.families.has(nodeClass)) {
      return this.families.get(nodeClass).nodes;
    }

    const family = new this.familyClass(nodeClass, this);
    this.families.set(nodeClass, family);

    this.entityList.forEach(family.newEntity);

    return family.nodeList;
  }

  releaseNodeList(nodeClass: { new(...args: Array<any>): EntityNode }) {
    if (this.families.has(nodeClass)) {
      this.families.get(nodeClass).clear();
    }

    this.families.delete(nodeClass);
  }

  addSystem(system: ISystem, priority: number) {
    system.priority = priority;
    system.addToEngine(this);
    this.systemList.add(system);
  }

  getSystem(ctr: { new(...args: Array<any>): ISystem }): ISystem {
    let result: ISystem;

    this.systemList.forEach((system) => {
      if (system instanceof ctr) {
        result = system;
      }
    });

    return result;
  }

  removeSystem = (system: ISystem) => {
    this.systemList.delete(system);
    system.removeFromEngine(this);
  }

  removeAllSystems() {
    this.systemList.forEach(this.removeSystem);
  }

  update(time: number) {
    this.updating = true;

    for (let system of this.systemList) {
      system.update(time);
    }

    this.updating = false;
    this.updateComplete.dispatch();
  }
}
