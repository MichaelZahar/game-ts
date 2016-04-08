'use strict';

import { IPoint } from './Position';

/**
 * Описывает отображаемый объект.
 * Такой объект может иметь настройки внешнего вида (options)
 * и настройки отображения в камере.
 */
export class Display {
  visible: boolean = false;
  type: DisplayType;
  options: IDisplayOptions;

  protected _object: PIXIObject;

  constructor(type: DisplayType, options: IDisplayOptions) {
    this.visible = false;
    this.type = type;
    this.options = options;
  }

  get object() {
    return this._object || (this._object = getPIXIObject(this));
  }

  get width() {
    return this.object.width;
  }

  get height() {
    return this.object.height;
  }
}

export enum DisplayType {
  MovieClip,
  Sprite,
  TilingSprite
}

export interface IDisplayOptions {
  zOrder?: number;
  image?: string;
  width?: number;
  height?: number;
  pattern?: string;
  frames?: string[];
  animationSpeed?: number;
  pivot?: IPoint;
}

export interface ISprite {
  image: string;
  zOrder?: number;
  pivot?: IPoint;
}

export interface ITilingSprite {
  image: string;
  width: number;
  height: number;
  zOrder?: number;
  pivot?: IPoint;
}

export interface IMovieClip {
  pattern: string;
  frames: string[];
  zOrder?: number;
  pivot?: IPoint;
  animationSpeed?: number;
}

export type PIXIObject = PIXI.Sprite | PIXI.extras.MovieClip | PIXI.extras.TilingSprite;

function getPIXIObject(display: Display): PIXIObject {
  let object;

  switch (display.type) {
    case DisplayType.TilingSprite:
      object = getPIXITilingSprite(display);
      break;

    case DisplayType.MovieClip:
      object = getPIXIMovieClip(display);
      break;

    default:
      object = getPIXISprite(display);
  }

  const pivot = display.options.pivot;

  if (!!pivot) {
    object.pivot = new PIXI.Point(pivot.x, pivot.y);
  }

  return object;
}

function getPIXIMovieClip(display: Display): PIXI.extras.MovieClip {
  const options = display.options as IMovieClip;
  const pattern = options.pattern;
  const frames = [];

  display.options.frames.forEach((frame) => {
    frames.push(PIXI.Texture.fromFrame(pattern.replace(/%d/, frame)));
  });

  const movie = new PIXI.extras.MovieClip(frames);

  movie.animationSpeed = options.animationSpeed;
  movie.play();

  return movie;
}

function getPIXITilingSprite(display: Display): PIXI.extras.TilingSprite {
  const options = display.options as ITilingSprite;

  return PIXI.extras.TilingSprite.fromFrame(
    options.image,
    options.width,
    options.height
  );
}

function getPIXISprite(display: Display): PIXI.Sprite {
  const options = display.options as ISprite;

  return new PIXI.Sprite(PIXI.Texture.fromFrame(options.image));
}
