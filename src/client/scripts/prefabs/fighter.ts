import { Entity } from '../lib/ecs/Entity';
import { Engine } from '../lib/ecs/Engine';
import { Display, DisplayType } from '../components/Display';
import { Camera } from '../components/Camera';
import { HeroControl } from '../components/HeroControl';
import { Motion } from '../components/Motion';
import { Position } from '../components/Position';

export default function addFighter(engine: Engine, camera: Camera) {
  const fighter = new Entity();
  const fighterLegs = new Entity();

  fighterLegs
    .addComponent(new Display(
      DisplayType.MovieClip,
      {
        zOrder: 1,
        pattern: 'feet/run/survivor-run_%d.png',
        frames: Array.from(new Array(20), (x, i) => (i < 10) ? '0' + i.toString() : i.toString()),
        animationSpeed: 0.5
      }
    ))
    .addComponent(new Position(4, 17, 0));
    //.addComponent(new Position(-16, -4, 0));

  fighter
    .addComponent(new Display(
      DisplayType.MovieClip,
      {
        zOrder: 2,
        pattern: 'handgun/move/survivor-move_handgun_%d.png',
        frames: Array.from(new Array(20), (x, i) => (i < 10) ? '0' + i.toString() : i.toString()),
        animationSpeed: 0.5,
        pivot: { x: 20, y: 21 }
      }
    ))
    .addComponent(new Position(0, 0, 0))
    .addComponent(new HeroControl())
    .addComponent(new Motion(300))
    .addComponent(camera)
    .addChildEntity(fighterLegs);

  engine.addEntity(fighter);
}
