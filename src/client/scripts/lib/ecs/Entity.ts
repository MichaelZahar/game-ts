'use strict';

import { Signal } from 'signals';

export interface IComponentAdded<T> {
  entity: Entity;
  addedComponent: T
}

export interface IComponentRemoved<T> {
  entity: Entity;
  removedComponent: T
}

export interface IChildAdded {
  entity: Entity;
  addedChild: Entity;
}

export interface IChildRemoved {
  entity: Entity;
  removedChild: Entity;
}

export interface IEntityDestroyed {
  entity: Entity;
}

export class Entity {
  private static id: number = 1;

  public id: number;
  public components: Map<Function, any> = new Map();

  public parent: Entity = null;
  public childs: Array<Entity> = [];

  public childAdded: Signal = new Signal();
  public childRemoved: Signal = new Signal();
  public componentAdded: Signal = new Signal();
  public componentRemoved: Signal = new Signal();
  public destroyed: Signal = new Signal();

  constructor() {
    this.id = Entity.id++;
    this.components = new Map();
  }

  hasComponent<T>(ctr: { new(...args: any[]): T }): boolean {
    return !!this.components.get(ctr);
  }

  getComponent<T>(ctr: { new (...args: any[]): T }): T {
    return this.components.get(ctr);
  }

  addComponent<T>(component: T): this {
    this.components.set(component.constructor, component);

    const addComponentEvent: IComponentAdded<T> = {
      entity: this,
      addedComponent: component
    };

    this.componentAdded.dispatch(addComponentEvent);

    return this;
  }

  removeComponent<T>(component: T): this {
    const removedComponentEvent: IComponentRemoved<T> = {
      entity: this,
      removedComponent: component
    };

    if (this.components.delete(component.constructor)) {
      this.componentRemoved.dispatch(removedComponentEvent);
    }

    return this;
  }

  addChildEntity(child: Entity): this {
    const hasChild = this.childs.some((entity) => {
      return entity.id === child.id;
    });
    const addChildEvent: IChildAdded = {
      entity: this,
      addedChild: child
    };

    if (hasChild) {
      return;
    }

    child.parent = this;

    this.childs.push(child);
    this.childAdded.dispatch(addChildEvent);

    return this;
  }

  removeChildEntity(child: Entity): this {
    const childsCount = this.childs.length;
    const removeChildEvent: IChildRemoved = {
      entity: this,
      removedChild: child
    };

    this.childs = this.childs.filter((entity) => {
      return entity.id !== child.id;
    });

    child.parent = null;

    if (childsCount !== this.childs.length) {
      this.childRemoved.dispatch(removeChildEvent);
    }

    return this;
  }

  getChildComponents<T>(ctr: { new (...args: any[]): T }): Array<T> {
    return this.childs.reduce((result, child) => {
      const component = child.getComponent(ctr);

      if (!!component) {
        result.push(component)
      }

      return result;
    }, []);
  }

  destroy() {
    if (this.parent) {
      this.parent.removeChildEntity(this);
    }

    if (this.childs.length > 0) {
      this.childs.forEach((child) => {
        child.destroy();
      });
    }

    const destroyedEvent = {
      entity: this
    };

    this.destroyed.dispatch(destroyedEvent);
  }

  serialize(): Object {
    let result = {
      id: this.id,
      components: {}
    };

    this.components.forEach((value, key) => {
      result.components[key.name] = value;
    });

    return result;
  }
}
