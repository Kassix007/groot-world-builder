
import { useState, useCallback, useEffect } from 'react';
import { GameTile, GameStats, BiomeType } from '../types/gameTypes';
import { toast } from 'sonner';

export const useGameState = () => {
  const [tiles, setTiles] = useState<GameTile[]>([]);
  const [stats, setStats] = useState<GameStats>({
    lifeForce: 50,
    maxLifeForce: 100,
    plantsPlanted: 0,
    treesMature: 0,
    terrainRestored: 0,
    currentMission: "Plant 5 saplings to begin restoring life to the homeworld",
    missionProgress: 0,
    score: 0,
    water: 30,
    maxWater: 50,
    nutrients: 20,
    maxNutrients: 40,
    oxygen: 15,
    maxOxygen: 30,
    biodiversity: 0,
    climate: 'harsh',
    season: 'spring',
    dayNight: 'day',
    weather: 'clear',
  });
  
  const [gameSettings, setGameSettings] = useState({
    isPaused: false,
    showGrid: false,
    autoSave: true,
    difficulty: 'normal' as 'easy' | 'normal' | 'hard',
    soundEnabled: true,
  });

  const [selectedPlantType, setSelectedPlantType] = useState<string | null>(null);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);

  // Initialize game grid with biomes
  const initializeGrid = useCallback(() => {
    const newTiles: GameTile[] = [];
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 10; x++) {
        let biome: BiomeType = 'wasteland';
        
        // Create varied biomes across the map
        if (y < 2) biome = 'mountain';
        else if (y > 5 && x < 4) biome = 'desert';
        else if (x > 6 && y > 3) biome = 'wetland';
        else if (Math.random() < 0.3) biome = 'forest';

        newTiles.push({
          id: `${x}-${y}`,
          x,
          y,
          terrain: 'desolate',
          plant: undefined,
          biome,
          fertility: Math.floor(Math.random() * 3) + 1,
          waterLevel: Math.floor(Math.random() * 3) + 1,
          pollution: Math.floor(Math.random() * 2),
          temperature: 20 + Math.random() * 15,
          isAnimating: false,
          lastWatered: 0,
          growthStage: 0,
        });
      }
    }
    setTiles(newTiles);
  }, []);

  // Enhanced planting logic with resource costs
  const plantOnTile = useCallback((tile: GameTile, plantType: string) => {
    const costs = {
      sapling: { lifeForce: 10, water: 5, nutrients: 3 },
      flowers: { lifeForce: 5, water: 3, nutrients: 2 },
      'mature-tree': { lifeForce: 25, water: 15, nutrients: 10 },
    };

    const cost = costs[plantType as keyof typeof costs];
    
    if (stats.lifeForce < cost.lifeForce || stats.water < cost.water || stats.nutrients < cost.nutrients) {
      toast.error("Insufficient resources!");
      return false;
    }

    // Check biome compatibility
    const biomeBonus = getBiomeBonus(tile.biome, plantType);
    if (biomeBonus < 0.5) {
      toast.warning(`${plantType} struggles in ${tile.biome} biome!`);
    }

    setTiles(prevTiles => 
      prevTiles.map(t => 
        t.id === tile.id 
          ? { 
              ...t, 
              plant: plantType as GameTile['plant'], 
              terrain: 'restored',
              isAnimating: true,
              growthStage: 1,
              lastWatered: Date.now(),
            }
          : t
      )
    );

    setStats(prev => ({
      ...prev,
      lifeForce: prev.lifeForce - cost.lifeForce,
      water: prev.water - cost.water,
      nutrients: prev.nutrients - cost.nutrients,
      plantsPlanted: prev.plantsPlanted + 1,
      terrainRestored: prev.terrainRestored + 1,
      score: prev.score + Math.floor(cost.lifeForce * biomeBonus * 2),
    }));

    toast.success(`Planted ${plantType}! Biome compatibility: ${Math.floor(biomeBonus * 100)}%`);
    return true;
  }, [stats]);

  const getBiomeBonus = (biome: BiomeType, plantType: string): number => {
    const compatibility = {
      forest: { sapling: 1.5, flowers: 1.2, 'mature-tree': 1.3 },
      desert: { sapling: 0.6, flowers: 0.8, 'mature-tree': 0.5 },
      wetland: { sapling: 1.3, flowers: 1.5, 'mature-tree': 1.1 },
      mountain: { sapling: 0.9, flowers: 0.7, 'mature-tree': 0.8 },
      wasteland: { sapling: 0.8, flowers: 0.6, 'mature-tree': 0.7 },
    };
    
    return compatibility[biome]?.[plantType as keyof typeof compatibility.forest] || 1.0;
  };

  // Initialize on mount
  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  return {
    tiles,
    stats,
    gameSettings,
    selectedPlantType,
    currentMissionIndex,
    setTiles,
    setStats,
    setGameSettings,
    setSelectedPlantType,
    setCurrentMissionIndex,
    plantOnTile,
    initializeGrid,
  };
};
