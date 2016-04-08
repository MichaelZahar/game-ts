'use strict';

import * as PIXI from 'pixi.js';
import { IPoint } from './Position';

export enum AppearanceType {
  MovieClip,
  Sprite,
  TilingSprite
}

export interface IAppearance {
  zOrder?: number;
  image?: string;
  width?: number;
  height?: number;
  rotation?: number;
  pattern?: string;
  frames?: string[];
  animationSpeed?: number;
  pivot?: IPoint;
}

export interface ISprite {
  image: string;
  zOrder?: number;
  rotation?: number;
  pivot?: IPoint;
}

export interface ITilingSprite {
  image: string;
  width: number;
  height: number;
  zOrder?: number;
  rotation?: number;
  pivot?: IPoint;
}

export interface IMovieClip {
  pattern: string;
  frames: string[];
  zOrder?: number;
  rotation?: number;
  pivot?: IPoint;
  animationSpeed?: number;
}

export class Appearance {
  public type: AppearanceType = AppearanceType.Sprite;
  public options: IAppearance;

  protected _object: PIXIObject;

  constructor(type: AppearanceType, options: IAppearance) {
    this.type = type;
    this.options = options;
  }

  get object(): PIXIObject {
    return this._object || (this._object = getPIXIObject(this));
  }

  get width(): number {
    return this.object.width;
  }

  get height(): number {
    return this.object.height;
  }

  get rotation(): number {
    return this.options.rotation || 0;
  }

  get rotationInRad(): number {
    return this.rotation * Math.PI / 180;
  }
}

export type PIXIObject = PIXI.Sprite | PIXI.extras.MovieClip | PIXI.extras.TilingSprite;

function getPIXIObject(appearance): PIXIObject {
  let object;

  switch (appearance.type) {
    case AppearanceType.TilingSprite:
      object = getPIXITilingSprite(appearance);
      break;

    case AppearanceType.MovieClip:
      object = getPIXIMovieClip(appearance);
      break;

    default:
      object = getPIXISprite(appearance);
  }

  return object;
}

function getPIXIMovieClip(appearance: Appearance): PIXI.extras.MovieClip {
  const options = appearance.options as IMovieClip;
  const pattern = options.pattern;
  const frames = [];

  appearance.options.frames.forEach((frame) => {
    frames.push(PIXI.Texture.fromFrame(pattern.replace(/%d/, frame)));
  });

  const movie = new PIXI.extras.MovieClip(frames);

  movie.animationSpeed = options.animationSpeed;
  movie.play();

  return movie;
}

function getPIXITilingSprite(appearance: Appearance): PIXI.extras.TilingSprite {
  const options = appearance.options as ITilingSprite;

  return PIXI.extras.TilingSprite.fromFrame(
    options.image,
    options.width,
    options.height
  );
}

function getPIXISprite(appearance: Appearance): PIXI.Sprite {
  const options = appearance.options as ISprite;

  return new PIXI.Sprite(PIXI.Texture.fromFrame(options.image));
}
