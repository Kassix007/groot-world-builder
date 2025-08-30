import { useState, useEffect, useCallback } from 'react';
import { GameGrid, GameTile } from './GameGrid';
import { GameUI, GameStats } from './GameUI';
import { Leaderboard, LeaderboardEntry } from './Leaderboard';
import { toast } from 'sonner';
import cosmicBackground from '@/assets/cosmic-background.jpg';

// Initialize game grid
const createInitialGrid = (): GameTile[] => {
  const tiles: GameTile[] = [];
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 8; x++) {
      tiles.push({
        id: `${x}-${y}`,
        x,
        y,
        terrain: 'desolate',
        plant: undefined,
      });
    }
  }
  return tiles;
};

const INITIAL_STATS: GameStats = {
  lifeForce: 50,
  maxLifeForce: 100,
  plantsPlanted: 0,
  treesMature: 0,
  terrainRestored: 0,
  currentMission: "Plant 5 saplings to begin restoring life to the homeworld",
  missionProgress: 0,
  score: 0,
};

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', playerName: 'Guardian_Star_Lord', score: 15420, plantsPlanted: 87, missionsCompleted: 12, rank: 1 },
  { id: '2', playerName: 'Gamora_Guardian', score: 12890, plantsPlanted: 76, missionsCompleted: 10, rank: 2 },
  { id: '3', playerName: 'Rocket_Engineer', score: 11250, plantsPlanted: 65, missionsCompleted: 9, rank: 3 },
  { id: '4', playerName: 'Drax_Destroyer', score: 9870, plantsPlanted: 54, missionsCompleted: 8, rank: 4 },
  { id: '5', playerName: 'Mantis_Empath', score: 8640, plantsPlanted: 43, missionsCompleted: 7, rank: 5 },
];

const PLANT_COSTS = {
  sapling: 10,
  flowers: 5,
  'mature-tree': 25,
};

const MISSIONS = [
  { 
    id: 1, 
    description: "Plant 5 saplings to begin restoring life to the homeworld", 
    requirement: { type: 'saplings', count: 5 },
    reward: 30
  },
  { 
    id: 2, 
    description: "Create a beautiful garden with 8 flowers", 
    requirement: { type: 'flowers', count: 8 },
    reward: 40
  },
  { 
    id: 3, 
    description: "Grow 3 mature trees to establish the forest", 
    requirement: { type: 'mature-trees', count: 3 },
    reward: 60
  },
  { 
    id: 4, 
    description: "Restore 20 tiles of terrain to flourishing state", 
    requirement: { type: 'terrain', count: 20 },
    reward: 100
  },
];

export const GrootGame = () => {
  const [tiles, setTiles] = useState<GameTile[]>(createInitialGrid);
  const [stats, setStats] = useState<GameStats>(INITIAL_STATS);
  const [selectedPlantType, setSelectedPlantType] = useState<string | null>(null);
  const [currentMissionIndex, setCurrentMissionIndex] = useState(0);
  const [leaderboard] = useState<LeaderboardEntry[]>(SAMPLE_LEADERBOARD);

  // Auto-generate life force over time
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        lifeForce: Math.min(prev.maxLifeForce, prev.lifeForce + 1),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Auto-grow saplings to mature trees
  useEffect(() => {
    const interval = setInterval(() => {
      setTiles(prevTiles => {
        return prevTiles.map(tile => {
          if (tile.plant === 'sapling' && Math.random() < 0.1) {
            // 10% chance per interval for saplings to grow
            setStats(prev => ({
              ...prev,
              treesMature: prev.treesMature + 1,
              score: prev.score + 50,
            }));
            toast.success("A sapling grew into a mighty tree! 🌳");
            return { ...tile, plant: 'mature-tree', isAnimating: true };
          }
          return tile;
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const canPlant = useCallback((tile: GameTile) => {
    return tile.terrain === 'desolate' && !tile.plant;
  }, []);

  const handleTileClick = useCallback((tile: GameTile) => {
    if (!selectedPlantType || !canPlant(tile)) return;

    const cost = PLANT_COSTS[selectedPlantType as keyof typeof PLANT_COSTS];
    if (stats.lifeForce < cost) {
      toast.error("Not enough Life Force energy!");
      return;
    }

    // Plant the selected plant type
    setTiles(prevTiles => 
      prevTiles.map(t => 
        t.id === tile.id 
          ? { 
              ...t, 
              plant: selectedPlantType as GameTile['plant'], 
              terrain: 'restored',
              isAnimating: true 
            }
          : t
      )
    );

    // Update stats
    setStats(prev => ({
      ...prev,
      lifeForce: prev.lifeForce - cost,
      plantsPlanted: prev.plantsPlanted + 1,
      terrainRestored: prev.terrainRestored + 1,
      score: prev.score + (cost * 2),
    }));

    // Clear animation after delay
    setTimeout(() => {
      setTiles(prevTiles => 
        prevTiles.map(t => 
          t.id === tile.id ? { ...t, isAnimating: false } : t
        )
      );
    }, 800);

    toast.success(`Planted a ${selectedPlantType}! Life is returning! 🌱`);
    setSelectedPlantType(null);
  }, [selectedPlantType, stats.lifeForce, canPlant]);

  // Update mission progress
  useEffect(() => {
    if (currentMissionIndex >= MISSIONS.length) return;

    const mission = MISSIONS[currentMissionIndex];
    let progress = 0;

    switch (mission.requirement.type) {
      case 'saplings':
        const saplings = tiles.filter(t => t.plant === 'sapling').length;
        progress = (saplings / mission.requirement.count) * 100;
        break;
      case 'flowers':
        const flowers = tiles.filter(t => t.plant === 'flowers').length;
        progress = (flowers / mission.requirement.count) * 100;
        break;
      case 'mature-trees':
        progress = (stats.treesMature / mission.requirement.count) * 100;
        break;
      case 'terrain':
        progress = (stats.terrainRestored / mission.requirement.count) * 100;
        break;
    }

    setStats(prev => ({
      ...prev,
      missionProgress: Math.min(100, progress),
    }));
  }, [tiles, stats.treesMature, stats.terrainRestored, currentMissionIndex]);

  const handleMissionComplete = useCallback(() => {
    const mission = MISSIONS[currentMissionIndex];
    if (!mission) return;

    setStats(prev => ({
      ...prev,
      lifeForce: Math.min(prev.maxLifeForce, prev.lifeForce + mission.reward),
      score: prev.score + mission.reward * 5,
      missionProgress: 0,
    }));

    toast.success(`Mission Complete! +${mission.reward} Life Force! 🎉`);

    // Move to next mission
    setCurrentMissionIndex(prev => {
      const nextIndex = prev + 1;
      if (nextIndex < MISSIONS.length) {
        setStats(prevStats => ({
          ...prevStats,
          currentMission: MISSIONS[nextIndex].description,
        }));
        return nextIndex;
      } else {
        setStats(prevStats => ({
          ...prevStats,
          currentMission: "Homeworld restored! Continue growing the perfect ecosystem!",
        }));
        return prev;
      }
    });
  }, [currentMissionIndex]);

  const handlePlantSelect = useCallback((plantType: string) => {
    setSelectedPlantType(prev => prev === plantType ? null : plantType);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 relative overflow-hidden">
      {/* Cosmic Background */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${cosmicBackground})`,
        }}
      />
      
      <div className="relative z-10 container mx-auto p-4">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent animate-pulse-life">
            Project I-Am-Groot
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Help Groot rebuild his devastated homeworld 🌍
          </p>
        </header>

        {/* Game Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {/* Left Panel - Game UI */}
          <div className="lg:col-span-1 space-y-4">
            <GameUI
              stats={stats}
              selectedPlantType={selectedPlantType}
              onPlantSelect={handlePlantSelect}
              onMissionComplete={handleMissionComplete}
            />
          </div>

          {/* Center - Game Grid */}
          <div className="lg:col-span-2 flex justify-center">
            <GameGrid
              tiles={tiles}
              onTileClick={handleTileClick}
              selectedPlantType={selectedPlantType}
              canPlant={canPlant}
            />
          </div>

          {/* Right Panel - Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard
              entries={leaderboard}
              currentPlayerScore={stats.score}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>"I am Groot." - Restore the homeworld, one plant at a time! 🌱</p>
        </footer>
      </div>
    </div>
  );
};