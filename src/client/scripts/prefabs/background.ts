import { Entity } from '../lib/ecs/Entity';
import { Engine } from '../lib/ecs/Engine';
import { Display, DisplayType } from '../components/Display';
import { Position } from '../components/Position';

export default function addBackground(engine: Engine) {
  const background = new Entity();

  background
    .addComponent(new Display(
      DisplayType.TilingSprite,
      {
        zOrder: 0,
        image: '/assets/asphalt.png',
        width: 800,
        height: 600
      }
    ))
    .addComponent(new Position(-400, 300));

  engine.addEntity(background);
}
