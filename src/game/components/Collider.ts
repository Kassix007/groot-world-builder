import { Component } from '../Component';
import { Transform } from './Transform';

export interface AABB {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class Collider extends Component {
  public width: number;
  public height: number;
  public offsetX: number;
  public offsetY: number;
  public solid: boolean;
  public trigger: boolean;

  constructor(
    width = 16,
    height = 16,
    offsetX = 0,
    offsetY = 0,
    solid = true,
    trigger = false
  ) {
    super();
    this.width = width;
    this.height = height;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.solid = solid;
    this.trigger = trigger;
  }

  public getAABB(transform: Transform): AABB {
    return {
      x: transform.x + this.offsetX,
      y: transform.y + this.offsetY,
      width: this.width,
      height: this.height
    };
  }

  public static checkAABBCollision(a: AABB, b: AABB): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }
}