import { EntityNode } from './EntityNode';
import { Signal } from 'signals';

export class EntityNodeList extends Set {
  nodeAdded: Signal = new Signal();
  nodeRemoved: Signal = new Signal();

  add(node: EntityNode): this {
    super.add(node);

    this.nodeAdded.dispatch(node);

    return this;
  }

  delete(node: EntityNode): boolean {
    const result = super.delete(node);

    if (result) {
      this.nodeRemoved.dispatch(node);
    }

    return result;
  }
}
