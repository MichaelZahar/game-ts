/// <reference path="../../../../typings/tsd.d.ts" />

import * as PIXI from 'pixi.js';
import { Position } from '../components/Position';
import { RenderNode } from '../nodes/RenderNode';
import { EntityNodeList } from '../lib/ecs/EntityNodeList';
import { Engine } from '../lib/ecs/Engine';
import { ISystem } from '../lib/ecs/ISystem';

export class RenderSystem implements ISystem {
  private static instance: RenderSystem;

  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  private resizeTimeoutId: number;
  private nodes: EntityNodeList;

  public priority: number = 10;
  public zOrders: { zOrder: number, container: PIXI.Container }[] = [];

  public stage: PIXI.Container;

  constructor(width: number, height: number, color?: number) {
    if (RenderSystem.instance) {
      return RenderSystem.instance;
    }

    RenderSystem.instance = this;

    this.renderer = PIXI.autoDetectRenderer(width, height);
    this.renderer.backgroundColor = color || 0xFFFFFF;
    this.stage = new PIXI.Container();

    document.body.appendChild(this.renderer.view);
    this.renderer.view.style.border = 'solid 1px #f0f';
  }

  addToEngine(engine: Engine) {
    this.nodes = engine.getNodeList(RenderNode);

    this.nodes.forEach(this.addToDisplay);

    this.nodes.nodeAdded.add(this.addToDisplay);
    this.nodes.nodeRemoved.add(this.removeFromDisplay);
  }

  removeFromEngine(engine: Engine) {
    this.nodes.nodeAdded.remove(this.addToDisplay);
    this.nodes.nodeRemoved.remove(this.removeFromDisplay);
    this.nodes = null;
  }

  private getZOrderContainer(zOrder: number) {
    let container;

    for (let i = 0, length = this.zOrders.length; i < length; i++) {
      if (this.zOrders[i].zOrder === zOrder) {
        container = this.zOrders[i].container;
        break;
      }
    }

    if (!container) {
      container = new PIXI.Container();
      this.zOrders.push({ zOrder, container });
      this.stage.addChild(container);
      this.zOrders = this.zOrders.sort((a, b) => a.zOrder - b.zOrder);
      this.zOrders.forEach((options, i) => {
        this.stage.setChildIndex(options.container, i);
      });
    }

    return container;
  }

  addToDisplay = (node: RenderNode) => {
    const appearance = node.appearance;
    const object = appearance.object;
    const pivot = appearance.options.pivot;
    const zOrder = appearance.options.zOrder || 0;

    if (!!pivot) {
      const pivot = appearance.options.pivot;
      object.pivot = new PIXI.Point(pivot.x, pivot.y);
    }

    this.getZOrderContainer(zOrder).addChild(object);
  }

  removeFromDisplay = (node: RenderNode) => {
    const appearance = node.appearance;
    const zOrder = appearance.options.zOrder;
    const object = appearance.object;

    this.getZOrderContainer(zOrder).removeChild(object);
  }

  set backgroundColor(value: number) {
    this.renderer.backgroundColor = value;
  }

  get backgroundColor() {
    return this.renderer.backgroundColor;
  }

  set width(value: number) {
    this.renderer.width = value;
  }

  get width() {
    return this.renderer.width;
  }

  set height(value: number) {
    this.renderer.height = value;
  }

  get height() {
    return this.renderer.height;
  }

  resize() {
    clearTimeout(this.resizeTimeoutId);

    this.resizeTimeoutId = setTimeout(() => {
      this.renderer.resize(this.renderer.width, this.renderer.height);
    }, 300);
  }

  update(time: number) {
    this.nodes.forEach((node) => {
      const object = node.appearance.object;
      const display = node.display;
      const position = Position.getByEntity(node.entity);

      object.x = display.x;
      object.y = display.y;
      object.rotation = position.rotationInRad;
    });

    this.render();
  }

  render() {
    this.renderer.render(this.stage);
  }
}
