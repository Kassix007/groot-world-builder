export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private world: World;
  private lastTime = 0;
  private accumulator = 0;
  private readonly FIXED_TIMESTEP = 1000 / 60; // 60 FPS
  private readonly MAX_DELTA = 250; // Max 250ms frame time
  private running = false;
  
  // Virtual resolution for pixel-perfect scaling
  private readonly VIRTUAL_WIDTH = 320;
  private readonly VIRTUAL_HEIGHT = 180;
  private scale = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    
    this.ctx = ctx;
    this.ctx.imageSmoothingEnabled = false; // Pixel-perfect rendering
    this.world = new World();
    
    this.setupSystems();
    this.resize();
  }

  private setupSystems() {
    // Add systems in order of execution
    this.world.addSystem(new MovementSystem());
    this.world.addSystem(new AnimationSystem());
    this.world.addSystem(new CollisionSystem());
    this.world.addSystem(new RenderSystem(this.ctx, this.VIRTUAL_WIDTH, this.VIRTUAL_HEIGHT));
  }

  public resize() {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (!rect) return;

    // Calculate scale to fit virtual resolution
    const scaleX = rect.width / this.VIRTUAL_WIDTH;
    const scaleY = rect.height / this.VIRTUAL_HEIGHT;
    this.scale = Math.floor(Math.min(scaleX, scaleY));
    
    // Set actual canvas size
    this.canvas.width = this.VIRTUAL_WIDTH * this.scale;
    this.canvas.height = this.VIRTUAL_HEIGHT * this.scale;
    
    // Set CSS size to fill container
    this.canvas.style.width = rect.width + 'px';
    this.canvas.style.height = rect.height + 'px';
    
    // Scale context for pixel-perfect rendering
    this.ctx.scale(this.scale, this.scale);
    this.ctx.imageSmoothingEnabled = false;
  }

  public start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.gameLoop();
  }

  public stop() {
    this.running = false;
  }

  private gameLoop = () => {
    if (!this.running) return;

    const currentTime = performance.now();
    let deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Clamp delta time to prevent spiral of death
    deltaTime = Math.min(deltaTime, this.MAX_DELTA);
    this.accumulator += deltaTime;

    // Fixed timestep updates
    while (this.accumulator >= this.FIXED_TIMESTEP) {
      this.world.update(this.FIXED_TIMESTEP);
      this.accumulator -= this.FIXED_TIMESTEP;
    }

    // Render with interpolation
    const alpha = this.accumulator / this.FIXED_TIMESTEP;
    this.render(alpha);

    requestAnimationFrame(this.gameLoop);
  };

  private render(alpha: number) {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.VIRTUAL_WIDTH, this.VIRTUAL_HEIGHT);
    
    // Render world
    this.world.render(alpha);
  }

  public getWorld(): World {
    return this.world;
  }
}

// Import types we'll need
import { World } from './World';
import { MovementSystem } from './systems/MovementSystem';
import { AnimationSystem } from './systems/AnimationSystem';
import { CollisionSystem } from './systems/CollisionSystem';
import { RenderSystem } from './systems/RenderSystem';