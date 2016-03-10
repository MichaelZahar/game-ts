'use strict';

import { ISystem } from '../lib/ecs/ISystem';
import { Engine } from '../lib/ecs/Engine';
import { EntityNodeList } from '../lib/ecs/EntityNodeList';
import { CameraNode } from '../nodes/CameraNode';
import { DisplayNode } from '../nodes/DisplayNode';
import { Display } from '../components/Display';
import { Position } from '../components/Position';

export class CameraSystem implements ISystem {
  /*private cameras: EntityNodeList;
  private objects: EntityNodeList;*/
  public cameras: EntityNodeList;
  public objects: EntityNodeList;

  public priority: number = 1;

  addToEngine(engine: Engine) {
    this.cameras = engine.getNodeList(CameraNode);
    this.objects = engine.getNodeList(DisplayNode);
  }

  removeFromEngine() {
    this.cameras = null;
  }

  update1(time: number) {
    this.cameras.forEach((cameraNode: CameraNode) => {
      if (cameraNode.camera.isRendering) {
        // камера привязана к entity и "наследует" его Positon
        const camera = cameraNode.camera;
        const position = Position.getByEntity(cameraNode.entity);
        // const angle = position.rotationInRad;
        const angle = 0;
        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);
        // при этом камера — новая система координат, начало которой зависит от точки
        // обзора (смещение центра камеры, относительно ее места положения)
        const cameraPosition = {
          x: position.x + camera.pointOfView.x - camera.fieldOfView.width / 2,
          y: position.y + camera.pointOfView.y - camera.fieldOfView.height / 2
        };

        const minX = cameraPosition.x;
        const maxX = cameraPosition.x + camera.fieldOfView.width;
        const minY = cameraPosition.y;
        const maxY = cameraPosition.y + camera.fieldOfView.height;

        this.objects.forEach((displayNode) => {
          const entity = displayNode.entity;
          const position = Position.getByEntity(displayNode.entity);
          const translatedPosition = {
            x: position.x * cosAngle + position.y * sinAngle - cameraPosition.x * cosAngle - cameraPosition.y * sinAngle,
            y: -position.x * sinAngle + position.y * cosAngle + cameraPosition.x * sinAngle - cameraPosition.y * cosAngle
          };

          const object = displayNode.appearance.object;
          const hitX = position.x <= minX && position.x + object.width >= minX || position.x >= minX && position.x <= maxX;
          const hitY = position.y <= minY && position.y + object.height >= minY || position.y >= minY && position.y <= maxY;
          const isVisible = hitX && hitY;

          if (entity.id === 3) {
            // console.log(isVisible);
          }

          if (isVisible) {
            if (entity.hasComponent(Display)) {
              const display = entity.getComponent(Display);
              display.x = translatedPosition.x;
              display.y = translatedPosition.y;
            } else {
              entity.addComponent(new Display(translatedPosition));
            }
          } else {
            entity.removeComponent(Display);
          }
        });
      }
    });
  }

  update(time: number) {
    this.cameras.forEach((cameraNode: CameraNode) => {
      const camera = cameraNode.camera;

      if (camera.isRendering) {
        // получаем позицию камеры в базовой системе координат
         const cameraPosition = Position.getByEntity(cameraNode.entity);

         this.objects.forEach((displayNode: DisplayNode) => {
           const positionInCamera = Position.getTranslatePosition(cameraPosition, Position.getByEntity(displayNode.entity));
         });
      }
    })
  }
}
