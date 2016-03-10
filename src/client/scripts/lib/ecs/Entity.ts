'use strict';

import { Signal } from 'signals';

export interface IComponentAdded {
  entity: Entity;
  addedComponent: Object
}

export interface IComponentRemoved {
  entity: Entity;
  removedComponent: Object
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

  hasComponent(ctr: Function): boolean {
    return !!this.components.get(ctr);
  }

  getComponent<T>(ctr: { new (...args: any[]): T }): T {
    return this.components.get(ctr);
  }

  addComponent(component: Object): this {
    this.components.set(component.constructor, component);

    const addComponentEvent: IComponentAdded = {
      entity: this,
      addedComponent: component
    };

    this.componentAdded.dispatch(addComponentEvent);

    return this;
  }

  removeComponent(component: { new(...args: any[]): Object }): this;
  removeComponent(component: Object): this;
  removeComponent(component): this {
    let componentInstance: Object;
    let componentConstructor: Function;

    if (component instanceof Function) {
        componentInstance = this.getComponent(component);
        componentConstructor = component;
    } else {
        componentInstance = component;
        componentConstructor = component.constructor;
    }

    const removedComponentEvent: IComponentRemoved = {
      entity: this,
      removedComponent: componentInstance
    };

    if (this.components.delete(componentConstructor)) {
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
