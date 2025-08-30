import { System } from '../System';
import { Transform } from '../components/Transform';
import { Collider } from '../components/Collider';
import { Velocity } from '../components/Velocity';

export class CollisionSystem extends System {
  public update(deltaTime: number) {
    const entities = this.world.getEntitiesWith(Transform, Collider);
    
    // Simple AABB collision detection
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const entityA = entities[i];
        const entityB = entities[j];
        
        const transformA = this.world.getComponent(entityA.id, Transform)!;
        const colliderA = this.world.getComponent(entityA.id, Collider)!;
        
        const transformB = this.world.getComponent(entityB.id, Transform)!;
        const colliderB = this.world.getComponent(entityB.id, Collider)!;
        
        const aabbA = colliderA.getAABB(transformA);
        const aabbB = colliderB.getAABB(transformB);
        
        if (Collider.checkAABBCollision(aabbA, aabbB)) {
          this.handleCollision(entityA.id, entityB.id, aabbA, aabbB);
        }
      }
    }
  }
  
  private handleCollision(
    entityAId: number,
    entityBId: number,
    aabbA: { x: number; y: number; width: number; height: number },
    aabbB: { x: number; y: number; width: number; height: number }
  ) {
    const colliderA = this.world.getComponent(entityAId, Collider)!;
    const colliderB = this.world.getComponent(entityBId, Collider)!;
    
    // If both are solid, resolve collision
    if (colliderA.solid && colliderB.solid) {
      const transformA = this.world.getComponent(entityAId, Transform)!;
      const transformB = this.world.getComponent(entityBId, Transform)!;
      const velocityA = this.world.getComponent(entityAId, Velocity);
      const velocityB = this.world.getComponent(entityBId, Velocity);
      
      // Calculate overlap
      const overlapX = Math.min(aabbA.x + aabbA.width - aabbB.x, aabbB.x + aabbB.width - aabbA.x);
      const overlapY = Math.min(aabbA.y + aabbA.height - aabbB.y, aabbB.y + aabbB.height - aabbA.y);
      
      // Resolve collision by separating along the smaller overlap axis
      if (overlapX < overlapY) {
        // Horizontal separation
        const separation = overlapX / 2;
        if (aabbA.x < aabbB.x) {
          transformA.x -= separation;
          transformB.x += separation;
        } else {
          transformA.x += separation;
          transformB.x -= separation;
        }
        
        // Stop horizontal velocity
        if (velocityA) velocityA.x = 0;
        if (velocityB) velocityB.x = 0;
      } else {
        // Vertical separation
        const separation = overlapY / 2;
        if (aabbA.y < aabbB.y) {
          transformA.y -= separation;
          transformB.y += separation;
        } else {
          transformA.y += separation;
          transformB.y -= separation;
        }
        
        // Stop vertical velocity
        if (velocityA) velocityA.y = 0;
        if (velocityB) velocityB.y = 0;
      }
    }
  }
}