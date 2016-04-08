import { Entity } from '../lib/ecs/Entity';
import { Engine } from '../lib/ecs/Engine';
import { Display, DisplayType } from '../components/Display';
import { Position } from '../components/Position';

export default function addBox(engine: Engine, x?: number, y?: number) {
  const box = new Entity();

  box
    .addComponent(new Display(
      DisplayType.Sprite,
      {
        zOrder: 1,
        image: '/assets/box.png',
        pivot: {
          x: 62,
          y: 64
        }
      }
    ))
    .addComponent(new Position(x || 300, y || 280));

  engine.addEntity(box);
}
