import { System } from '../System';
import { Transform } from '../components/Transform';
import { Velocity } from '../components/Velocity';

export class MovementSystem extends System {
  public update(deltaTime: number) {
    const entities = this.world.getEntitiesWith(Transform, Velocity);
    
    for (const entity of entities) {
      const transform = this.world.getComponent(entity.id, Transform)!;
      const velocity = this.world.getComponent(entity.id, Velocity)!;
      
      // Update previous position for interpolation
      transform.updatePrevious();
      
      // Apply velocity
      transform.x += velocity.x * (deltaTime / 1000);
      transform.y += velocity.y * (deltaTime / 1000);
      
      // Apply friction
      velocity.x *= velocity.friction;
      velocity.y *= velocity.friction;
      
      // Clamp to max speed
      velocity.clampToMaxSpeed();
    }
  }
}