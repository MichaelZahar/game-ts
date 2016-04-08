/// <reference path="../../../../typings/tsd.d.ts" />

import * as PIXI from 'pixi.js';
import { CameraNode } from '../nodes/CameraNode';
import { RenderNode } from '../nodes/RenderNode';
import { Position } from '../components/Position';
import { EntityNodeList } from '../lib/ecs/EntityNodeList';
import { Engine } from '../lib/ecs/Engine';
import { ISystem } from '../lib/ecs/ISystem';

export class RenderSystem implements ISystem {
  private static instance: RenderSystem;

  private renderer: PIXI.WebGLRenderer | PIXI.CanvasRenderer;
  private resizeTimeoutId: number;
  private cameras: EntityNodeList;
  private objects: EntityNodeList;

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
    this.cameras = engine.getNodeList(CameraNode);
    this.objects = engine.getNodeList(RenderNode);

    this.objects.forEach(this.addToDisplay);

    this.objects.nodeAdded.add(this.addToDisplay);
    this.objects.nodeRemoved.add(this.removeFromDisplay);
  }

  removeFromEngine(engine: Engine) {
    this.objects.nodeAdded.remove(this.addToDisplay);
    this.objects.nodeRemoved.remove(this.removeFromDisplay);
    this.objects = null;
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
    const display = node.display;
    const object = display.object;
    const zOrder = display.options.zOrder || 0;

    this.getZOrderContainer(zOrder).addChild(object);
  }

  removeFromDisplay = (node: RenderNode) => {
    const display = node.display;
    const zOrder = display.options.zOrder;
    const object = display.object;

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

  private getCameraOPoint(node: CameraNode): Position {
    const camera = node.camera;
    const cameraPosition = Position.getByEntity(node.entity);
    const cameraO = new Position(
      camera.pointOfView.x - camera.fieldOfView.width / 2,
      camera.pointOfView.y - camera.fieldOfView.height / 2
    );
    const rotation = (camera.followRotation) ? (camera.rotation + cameraPosition.rotation) % 360 : camera.rotation;
    const rotationInRad = rotation * Math.PI / 180;
    const cos = Math.cos(rotationInRad);
    const sin = Math.sin(rotationInRad);

    return new Position(
      cameraPosition.x + cameraO.x * cos - cameraO.y * sin,
      cameraPosition.y + cameraO.x * sin + cameraO.y * cos,
      rotation
    );
  }

  update(time: number) {
    this.cameras.forEach((cameraNode: CameraNode) => {
      if (cameraNode.camera.isRendering) {
        const oPoint = this.getCameraOPoint(cameraNode);
        const cos = Math.cos(oPoint.rotationInRad);
        const sin = Math.sin(oPoint.rotationInRad);

        this.objects.forEach((renderNode: RenderNode) => {
          const position = Position.getByEntity(renderNode.entity);
          const object = renderNode.display.object;

          object.position.set(
            getFixed(position.x * cos + position.y * sin - oPoint.x * cos - oPoint.y * sin, 5000),
            getFixed(-position.x * sin + position.y * cos + oPoint.x * sin - oPoint.y * cos, 5000)
          );
          object.rotation = ((position.rotation - oPoint.rotation) % 360) * Math.PI / 180;
        });
      }
    });

    this.render();
  }

  render() {
    this.renderer.render(this.stage);
  }
}

function getFixed(value: number, maxValue: number): number {
  if (value < 0) {
    return maxValue + value;
  }

  if (value > maxValue) {
    return value % maxValue;
  }

  return value;
}
