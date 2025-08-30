import { Component } from '../Component';

export class Velocity extends Component {
  public x: number;
  public y: number;
  public maxSpeed: number;
  public friction: number;

  constructor(x = 0, y = 0, maxSpeed = 100, friction = 0.8) {
    super();
    this.x = x;
    this.y = y;
    this.maxSpeed = maxSpeed;
    this.friction = friction;
  }

  public clampToMaxSpeed() {
    const speed = Math.sqrt(this.x * this.x + this.y * this.y);
    if (speed > this.maxSpeed) {
      this.x = (this.x / speed) * this.maxSpeed;
      this.y = (this.y / speed) * this.maxSpeed;
    }
  }
}