import { Component } from '../Component';

export class Transform extends Component {
  public x: number;
  public y: number;
  public prevX: number;
  public prevY: number;
  public rotation: number;
  public scaleX: number;
  public scaleY: number;

  constructor(x = 0, y = 0, rotation = 0, scaleX = 1, scaleY = 1) {
    super();
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.rotation = rotation;
    this.scaleX = scaleX;
    this.scaleY = scaleY;
  }

  public updatePrevious() {
    this.prevX = this.x;
    this.prevY = this.y;
  }

  // Linear interpolation for smooth rendering
  public getInterpolatedX(alpha: number): number {
    return this.prevX + (this.x - this.prevX) * alpha;
  }

  public getInterpolatedY(alpha: number): number {
    return this.prevY + (this.y - this.prevY) * alpha;
  }
}