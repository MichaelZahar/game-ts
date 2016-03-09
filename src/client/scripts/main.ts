'use strict';

import * as PIXI from 'pixi.js';
import { Engine } from './lib/ecs/Engine';
import { CameraSystem } from './systems/CameraSystem';
import { HeroControlSystem } from './systems/HeroControlSystem';
import { MovementSystem } from './systems/MovementSystem';
import { RenderSystem } from './systems/RenderSystem';
import { Camera } from './components/Camera';
import addFighter from './prefabs/fighter';
import addBox from './prefabs/box';

PIXI.loader.add([
  '/assets/character/character.json',
  '/assets/asphalt.png',
  '/assets/box.png'
]).load(() => {
  const engine = new Engine();
  const worldWidth = 5000;
  const worldHeight = 5000;
  const sceneWidth = 1600;
  const sceneHeight = 900;
  const camera = new Camera(true, { width: sceneWidth, height: sceneHeight }, { x: 0, y: 0 });

  addFighter(engine, camera);
  addBox(engine);

  engine.addSystem(new CameraSystem(worldWidth, worldHeight), 1);
  engine.addSystem(new HeroControlSystem(), 2);
  engine.addSystem(new MovementSystem(worldWidth, worldHeight), 3);
  engine.addSystem(new RenderSystem(sceneWidth, sceneHeight, 0xFFFFFF), 10);

  let now = Date.now();

  function tick() {
    const time = Date.now() - now;
    now = Date.now();

    engine.update(time);

    window.requestAnimationFrame(tick);
  }

  tick();
});

