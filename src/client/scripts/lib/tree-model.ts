'use strict';

export interface TreeTreeNodeConfig {
  childrenPropertyName?: string;
  modelComparatorFn?: Function;
}

export type TreeOptions = {
  strategy: 'pre' | 'post' | 'breadth';
}

export type TreeArgs = {
  fn: Function;
  ctx: any;
  options: TreeOptions;
}

const walkStrategies: any = {};

/**
 * Find the index to insert an element in array keeping the sort order.
 */
function findInsertIndex(comparatorFn: Function, arr: any[], el: any): number {
  let i = 0, len = arr.length;
  for (; i < len; i++) {
    if (comparatorFn(arr[i], el) > 0) {
      break;
    }
  }

  return i;
}

/**
 * Sort an array using the merge sort algorithm.
 */
function mergeSort<T>(comparatorFn: Function, arr: Array<T>): Array<T> {
  const len = arr.length;
  let firstHalf, secondHalf;

  if (len >= 2) {
    firstHalf = arr.slice(0, len / 2);
    secondHalf = arr.slice(len / 2, len);

    return merge<T>(
      comparatorFn,
      mergeSort<T>(
        comparatorFn,
        firstHalf
      ),
      mergeSort<T>(
        comparatorFn,
        secondHalf
      )
    );
  }

  return arr.slice();
}

/**
 * The merge part of the merge sort algorithm.
 */
function merge<T>(comparatorFn: Function, arr1: Array<T>, arr2: Array<T>): Array<T> {
  const result = [];
  let left1 = arr1.length, left2 = arr2.length;

  while (left1 > 0 && left2 > 0) {
    if (comparatorFn(arr1[0], arr2[0]) <= 0) {
      result.push(arr1.shift());
      left1--;
    } else {
      result.push(arr2.shift());
      left2--;
    }
  }

  if (left1 > 0) {
    result.push.apply(result, arr1);
  } else {
    result.push.apply(result, arr2);
  }

  return result;
}

function k(result: any): Function {
  return function (): any {
    return result;
  };
}

export class TreeModel {
  config: TreeTreeNodeConfig = {};

  constructor(config?: TreeTreeNodeConfig) {
    if (config) {
      this.config = config;
    }

    this.config.childrenPropertyName = this.config.childrenPropertyName || 'children';
  }

  parse(model: { [key: string]: any }): TreeNode {
    if (!(model instanceof Object)) {
      throw new TypeError('Model must be of type object.');
    }

    const node = new TreeNode(this.config, model);
    const propName = this.config.childrenPropertyName;
    const fn = this.config.modelComparatorFn;

    if (model[propName] instanceof Array) {
      if (fn) {
        model[propName] = mergeSort(
          fn,
          model[propName]
        );
      }

      for (let i = 0, childCount = model[propName].length; i < childCount; i++) {
        addChildToTreeNode(node, this.parse(model[propName][i]));
      }
    }
    return node;
  }
}

function addChildToTreeNode(node: TreeNode, child: TreeNode): TreeNode {
  child.parent = node;
  node.children.push(child);

  return child;
}

function hasComparatorFunction(node: TreeNode): boolean {
  return typeof node.config.modelComparatorFn === 'function';
}

export interface ITreeNode {
  [key: string]: any;
  parent: TreeNode;
  children: TreeNode[];

  isRoot(): boolean;
  hasChildren(): boolean;
  addChild(child: TreeNode): TreeNode;
  addChildAtIndex(child: TreeNode, index: number): TreeNode;
  walk(fn: Function): void;
  walk(options: TreeOptions): void;
  walk(fn: Function, ctx: any): void;
  walk(options: TreeOptions, fn: Function): void;
  walk(options: TreeOptions, fn: Function, ctx: any): void;
  all(fn: Function): TreeNode[];
  all(options: TreeOptions): TreeNode[];
  all(fn: Function, ctx: any): TreeNode[];
  all(options: TreeOptions, fn: Function): TreeNode[];
  all(options: TreeOptions, fn: Function, ctx: any): TreeNode[];
  first(fn: Function): TreeNode;
  first(options: TreeOptions): TreeNode;
  first(fn: Function, ctx: any): TreeNode;
  first(options: TreeOptions, fn: Function): TreeNode;
  first(options: TreeOptions, fn: Function, ctx: any): TreeNode;
  drop(): this;
  getPath(): string[];
}

interface IGetArgs {
  (fn: Function): TreeArgs;
  (options: TreeOptions): TreeArgs;
  (fn: Function, ctx: any): TreeArgs;
  (options: TreeOptions, fn: Function): TreeArgs;
  (options: TreeOptions, fn: Function, ctx: any): TreeArgs;
}

const parseArgs: IGetArgs = function parseArgs() {
  let fn;
  let options;
  let ctx;

  if (arguments.length === 1) {
    if (typeof arguments[0] === 'function') {
      fn = arguments[0];
    } else {
      options = arguments[0];
    }
  } else if (arguments.length === 2) {
    if (typeof arguments[0] === 'function') {
      fn = arguments[0];
      ctx = arguments[1];
    } else {
      options = arguments[0];
      fn = arguments[1];
    }
  } else {
    options = arguments[0];
    fn = arguments[1];
    ctx = arguments[2];
  }

  if (!options) {
    options = { strategy: 'pre' };
  }

  if (!options.strategy) {
    options.strategy = 'pre';
  }

  if (!walkStrategies[options.strategy]) {
    throw new Error('Unknown tree walk strategy. Valid strategies are \'pre\' [default], \'post\' and \'breadth\'.');
  }

  return {
    fn: fn,
    ctx: ctx,
    options: options
  };
}

export class TreeNode implements ITreeNode {
  config: TreeTreeNodeConfig;
  model: Object;
  parent: TreeNode;
  children: TreeNode[] = [];

  constructor(config: TreeTreeNodeConfig, model: Object) {
    this.config = config;
    this.model = model;
  }

  isRoot(): boolean {
    return this.parent === undefined;
  }

  hasChildren(): boolean {
    return this.children.length > 0;
  }

  addChild(child: TreeNode): TreeNode {
    return addChild(this, child);
  }

  addChildAtIndex(child: TreeNode, index: number): TreeNode {
    if (hasComparatorFunction(this)) {
      throw new Error('Cannot add child at index when using a comparator function.');
    }

    return addChild(this, child, index);
  }

  walk() {
    const args = parseArgs.apply(this, arguments);
    walkStrategies[args.options.strategy].call(this, args.fn, args.ctx);
  }

  all(): TreeNode[] {
    const args = parseArgs.apply(this, arguments);
    const all = [];

    args.fn = args.fn || k(true);

    walkStrategies[args.options.strategy].call(this, function (node) {
      if (args.fn.call(args.ctx, node)) {
        all.push(node);
      }
    }, args.ctx);

    return all;
  }

  first(): TreeNode {
    const args = parseArgs.apply(this, arguments);
    args.fn = args.fn || k(true);

    let first;

    walkStrategies[args.options.strategy].call(this, function (node) {
      if (args.fn.call(args.ctx, node)) {
        first = node;
        return false;
      }
    }, args.ctx);

    return first;
  }

  drop(): this {
    if (!this.isRoot()) {
      let indexOfChild = this.parent.children.indexOf(this);
      this.parent.children.splice(indexOfChild, 1);
      this.parent.model[this.config.childrenPropertyName].splice(indexOfChild, 1);
      this.parent = undefined;
      delete this.parent;
    }
    return this;
  }

  getPath(): string[] {
    const path = [];

    (function addToPath(node) {
      path.unshift(node);
      if (!node.isRoot()) {
        addToPath(node.parent);
      }
    })(this);

    return path;
  }
}

function addChild(self: TreeNode, child: TreeNode, insertIndex?: number): TreeNode {
  const propName = self.config.childrenPropertyName;
  let index;

  if (!(child instanceof TreeNode)) {
    throw new TypeError('Child must be of type TreeNode.');
  }

  child.parent = self;

  if (!(self.model[propName] instanceof Array)) {
    self.model[propName] = [];
  }

  if (hasComparatorFunction(self)) {
    // Find the index to insert the child
    index = findInsertIndex(
      self.config.modelComparatorFn,
      self.model[propName],
    child.model);

    // Add to the model children
    self.model[propName].splice(index, 0, child.model);

    // Add to the node children
    self.children.splice(index, 0, child);
  } else {
    if (insertIndex === undefined) {
      self.model[propName].push(child.model);
      self.children.push(child);
    } else {
      if (insertIndex < 0 || insertIndex > self.children.length) {
        throw new Error('Invalid index.');
      }
      self.model[propName].splice(insertIndex, 0, child.model);
      self.children.splice(insertIndex, 0, child);
    }
  }
  return child;
}

walkStrategies.pre = function depthFirstPreOrder(callback: Function, context: any): boolean {
  let keepGoing = callback.call(context, this);

  for (let i = 0, childCount = this.children.length; i < childCount; i++) {
    if (keepGoing === false) {
      return false;
    }
    keepGoing = depthFirstPreOrder.call(this.children[i], callback, context);
  }

  return keepGoing;
};

walkStrategies.post = function depthFirstPostOrder(callback: Function, context: any): boolean {
  let keepGoing;

  for (let i = 0, childCount = this.children.length; i < childCount; i++) {
    keepGoing = depthFirstPostOrder.call(this.children[i], callback, context);
    if (keepGoing === false) {
      return false;
    }
  }

  keepGoing = callback.call(context, this);

  return keepGoing;
};

walkStrategies.breadth = function breadthFirst(callback: Function, context: any) {
  const queue = [this];

  (function processQueue() {
    if (queue.length === 0) {
      return;
    }
    let node = queue.shift();
    for (let i = 0, childCount = node.children.length; i < childCount; i++) {
      queue.push(node.children[i]);
    }
    if (callback.call(context, node) !== false) {
      processQueue();
    }
  })();
};
