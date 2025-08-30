import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import grootCharacter from '@/assets/groot-character.png';
import treeSapling from '@/assets/tree-sapling.png';
import treeMature from '@/assets/tree-mature.png';
import flowers from '@/assets/flowers.png';
import terrainDesolate from '@/assets/terrain-desolate.png';
import terrainLush from '@/assets/terrain-lush.png';

export interface GameTile {
  id: string;
  x: number;
  y: number;
  terrain: 'desolate' | 'restored' | 'flourishing';
  plant?: 'sapling' | 'mature-tree' | 'flowers';
  isAnimating?: boolean;
}

export interface GameGridProps {
  tiles: GameTile[];
  onTileClick: (tile: GameTile) => void;
  selectedPlantType: string | null;
  canPlant: (tile: GameTile) => boolean;
}

export const GameGrid = ({ tiles, onTileClick, selectedPlantType, canPlant }: GameGridProps) => {
  const [hoveredTile, setHoveredTile] = useState<string | null>(null);

  const getTerrainImage = (terrain: GameTile['terrain']) => {
    switch (terrain) {
      case 'desolate':
        return terrainDesolate;
      case 'restored':
      case 'flourishing':
        return terrainLush;
      default:
        return terrainDesolate;
    }
  };

  const getPlantImage = (plant: GameTile['plant']) => {
    switch (plant) {
      case 'sapling':
        return treeSapling;
      case 'mature-tree':
        return treeMature;
      case 'flowers':
        return flowers;
      default:
        return null;
    }
  };

  const handleTileClick = useCallback((tile: GameTile) => {
    if (selectedPlantType && canPlant(tile)) {
      onTileClick(tile);
    }
  }, [selectedPlantType, canPlant, onTileClick]);

  return (
    <div className="relative">
      {/* Groot Character */}
      <div className="absolute -top-16 left-4 z-10">
        <img 
          src={grootCharacter} 
          alt="Groot" 
          className="w-24 h-24 animate-float filter drop-shadow-lg"
        />
        <div className="text-center mt-2">
          <span className="text-sm font-bold text-primary animate-pulse-life">
            "I am Groot!"
          </span>
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-8 gap-1 p-4 bg-card rounded-lg shadow-card border border-border">
        {tiles.map((tile) => {
          const isHovered = hoveredTile === tile.id;
          const canPlantHere = selectedPlantType && canPlant(tile);
          const plantImage = getPlantImage(tile.plant);
          
          return (
            <button
              key={tile.id}
              className={`
                relative w-16 h-16 rounded border-2 transition-all duration-300 overflow-hidden
                ${canPlantHere 
                  ? 'border-life-force shadow-growth cursor-pointer' 
                  : tile.plant 
                    ? 'border-primary cursor-default' 
                    : 'border-border cursor-pointer'
                }
                ${isHovered && canPlantHere ? 'transform scale-105' : ''}
                ${tile.isAnimating ? 'animate-grow' : ''}
              `}
              onClick={() => handleTileClick(tile)}
              onMouseEnter={() => setHoveredTile(tile.id)}
              onMouseLeave={() => setHoveredTile(null)}
              disabled={!canPlantHere && !!selectedPlantType}
            >
              {/* Terrain Background */}
              <img 
                src={getTerrainImage(tile.terrain)} 
                alt={`${tile.terrain} terrain`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Plant/Tree */}
              {plantImage && (
                <img 
                  src={plantImage}
                  alt={tile.plant}
                  className={`
                    absolute inset-0 w-full h-full object-contain z-10
                    ${tile.plant === 'mature-tree' ? 'animate-pulse-life' : ''}
                  `}
                />
              )}
              
              {/* Hover Effect */}
              {isHovered && canPlantHere && (
                <div className="absolute inset-0 bg-gradient-life opacity-30 animate-sparkle" />
              )}
              
              {/* Growth Particles */}
              {tile.terrain === 'flourishing' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-life-force rounded-full animate-sparkle opacity-70" />
              )}
            </button>
          );
        })}
      </div>
      
      {/* Grid Instructions */}
      {selectedPlantType && (
        <div className="text-center mt-4">
          <p className="text-sm text-muted-foreground">
            Click on desolate terrain to plant your {selectedPlantType}!
          </p>
        </div>
      )}
    </div>
  );
};