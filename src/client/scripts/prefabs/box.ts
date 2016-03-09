import { Entity } from '../lib/ecs/Entity';
import { Engine } from '../lib/ecs/Engine';
import { Appearance, AppearanceType } from '../components/Appearance';
import { Position } from '../components/Position';

export default function addBox(engine: Engine) {
  const box = new Entity();

  box
    .addComponent(new Appearance(
      AppearanceType.Sprite,
      {
        zOrder: 1,
        image: '/assets/box.png'
      }
    ))
    .addComponent(new Position(300, 280));

  engine.addEntity(box);
}
