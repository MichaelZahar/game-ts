'use strict';

interface IPropertyDescriptor {
  value?: any;
  writable?: boolean;
  configurable?: boolean;
  enumerable?: boolean;
  get?: Function;
  set?: Function;
}

export default function autobind(target: Object, key: string, descriptor: IPropertyDescriptor) {
  let fn = descriptor.value;

  if (typeof fn !== 'function') {
    throw new Error(`@autobind decorator can only be applied to methods not: ${typeof fn}`);
  }

  return {
    configurable: true,
    get() {
      let boundFn = fn.bind(this);

      Object.defineProperty(this, key, {
        value: boundFn,
        configurable: true,
        writable: true
      });

      return boundFn;
    }
  };
}
