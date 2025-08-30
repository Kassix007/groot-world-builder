import { useEffect, useRef, useState } from 'react';
import { Game } from '../game/Game';

interface GameCanvasProps {
  className?: string;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Initialize game
    gameRef.current = new Game(canvasRef.current);
    
    // Create a simple test entity
    const world = gameRef.current.getWorld();
    const testEntity = world.createEntity();
    
    // Add components to test entity
    const { Transform } = require('../game/components/Transform');
    const { Velocity } = require('../game/components/Velocity');
    const { Sprite } = require('../game/components/Sprite');
    
    world.addComponent(testEntity.id, new Transform(160, 90)); // Center of screen
    world.addComponent(testEntity.id, new Velocity());
    world.addComponent(testEntity.id, new Sprite('/assets/player.png', 16, 16));
    
    gameRef.current.start();
    setIsLoaded(true);

    // Handle resize
    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.stop();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-gray-900 flex items-center justify-center ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      <canvas
        ref={canvasRef}
        className="border border-gray-600"
        style={{ 
          imageRendering: 'pixelated'
        }}
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-white">Loading game...</div>
        </div>
      )}
    </div>
  );
};