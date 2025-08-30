import { World } from './World';

export abstract class System {
  protected world!: World;

  public setWorld(world: World) {
    this.world = world;
  }

  public abstract update(deltaTime: number): void;
}