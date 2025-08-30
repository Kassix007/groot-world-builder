import { System } from '../System';
import { Transform } from '../components/Transform';
import { Sprite } from '../components/Sprite';
import { Animation } from '../components/Animation';

export class RenderSystem extends System {
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    super();
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public update(deltaTime: number) {
    // RenderSystem doesn't need update, only render
  }

  public render(alpha: number) {
    const entities = this.world.getEntitiesWith(Transform, Sprite);
    
    for (const entity of entities) {
      const transform = this.world.getComponent(entity.id, Transform)!;
      const sprite = this.world.getComponent(entity.id, Sprite)!;
      const animation = this.world.getComponent(entity.id, Animation);
      
      if (!sprite.visible || !sprite.image) continue;
      
      // Get interpolated position for smooth rendering
      const x = Math.round(transform.getInterpolatedX(alpha));
      const y = Math.round(transform.getInterpolatedY(alpha));
      
      this.ctx.save();
      
      // Apply transform
      this.ctx.translate(x + sprite.width / 2, y + sprite.height / 2);
      this.ctx.rotate(transform.rotation);
      this.ctx.scale(transform.scaleX, transform.scaleY);
      
      // Draw sprite
      if (animation && animation.getCurrentFrame()) {
        const frame = animation.getCurrentFrame()!;
        this.ctx.drawImage(
          sprite.image,
          frame.x, frame.y, frame.width, frame.height,
          -sprite.width / 2 + sprite.offsetX,
          -sprite.height / 2 + sprite.offsetY,
          sprite.width,
          sprite.height
        );
      } else {
        this.ctx.drawImage(
          sprite.image,
          -sprite.width / 2 + sprite.offsetX,
          -sprite.height / 2 + sprite.offsetY,
          sprite.width,
          sprite.height
        );
      }
      
      this.ctx.restore();
    }
  }
}