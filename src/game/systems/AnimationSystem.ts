import { System } from '../System';
import { Animation } from '../components/Animation';

export class AnimationSystem extends System {
  public update(deltaTime: number) {
    const entities = this.world.getEntitiesWith(Animation);
    
    for (const entity of entities) {
      const animation = this.world.getComponent(entity.id, Animation)!;
      
      if (!animation.playing || !animation.currentClip) continue;
      
      const clip = animation.clips.get(animation.currentClip);
      if (!clip || clip.frames.length === 0) continue;
      
      // Update frame time
      animation.frameTime += deltaTime;
      
      const currentFrame = clip.frames[animation.currentFrame];
      if (animation.frameTime >= currentFrame.duration) {
        animation.frameTime = 0;
        animation.currentFrame++;
        
        // Handle end of animation
        if (animation.currentFrame >= clip.frames.length) {
          if (clip.loop) {
            animation.currentFrame = 0;
          } else {
            animation.playing = false;
            animation.currentFrame = clip.frames.length - 1;
          }
        }
      }
    }
  }
}