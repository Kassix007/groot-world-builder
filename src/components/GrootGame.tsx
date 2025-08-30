
import { useState, useEffect, useCallback } from 'react';
import { GameGrid } from './GameGrid';
import { GameUI } from './GameUI';
import { Leaderboard, LeaderboardEntry } from './Leaderboard';
import { ResourceManager } from './ResourceManager';
import { EnhancedPlantInventory } from './EnhancedPlantInventory';
import { GameHelpPanel } from './GameHelpPanel';
import { useKeyboardControls } from '../hooks/useKeyboardControls';
import { useGameState } from '../hooks/useGameState';
import { toast } from 'sonner';
import cosmicBackground from '@/assets/cosmic-background.jpg';
import { Button } from '@/components/ui/button';
import { Pause, Play, Grid3X3, HelpCircle, Settings, RotateCcw } from 'lucide-react';

const SAMPLE_LEADERBOARD: LeaderboardEntry[] = [
  { id: '1', playerName: 'Guardian_Star_Lord', score: 25420, plantsPlanted: 147, missionsCompleted: 18, rank: 1 },
  { id: '2', playerName: 'Gamora_Guardian', score: 22890, plantsPlanted: 136, missionsCompleted: 16, rank: 2 },
  { id: '3', playerName: 'Rocket_Engineer', score: 19250, plantsPlanted: 125, missionsCompleted: 14, rank: 3 },
  { id: '4', playerName: 'Drax_Destroyer', score: 16870, plantsPlanted: 114, missionsCompleted: 12, rank: 4 },
  { id: '5', playerName: 'Mantis_Empath', score: 14640, plantsPlanted: 103, missionsCompleted: 10, rank: 5 },
];

export const GrootGame = () => {
  const gameState = useGameState();
  const [leaderboard] = useState<LeaderboardEntry[]>(SAMPLE_LEADERBOARD);
  const [showHelp, setShowHelp] = useState(false);

  // Enhanced keyboard controls
  const keyboardControls = {
    onSelectSapling: () => gameState.setSelectedPlantType('sapling'),
    onSelectFlowers: () => gameState.setSelectedPlantType('flowers'),
    onSelectMatureTree: () => gameState.setSelectedPlantType('mature-tree'),
    onClearSelection: () => gameState.setSelectedPlantType(null),
    onToggleGrid: () => gameState.setGameSettings(prev => ({ ...prev, showGrid: !prev.showGrid })),
    onPauseGame: () => gameState.setGameSettings(prev => ({ ...prev, isPaused: !prev.isPaused })),
    onShowHelp: () => setShowHelp(!showHelp),
  };

  useKeyboardControls(keyboardControls);

  // Enhanced resource generation system
  useEffect(() => {
    if (gameState.gameSettings.isPaused) return;

    const interval = setInterval(() => {
      gameState.setStats(prev => {
        const newStats = { ...prev };
        
        // Base resource generation
        newStats.lifeForce = Math.min(prev.maxLifeForce, prev.lifeForce + 1);
        
        // Weather-based generation
        if (prev.weather === 'rain') {
          newStats.water = Math.min(prev.maxWater, prev.water + 2);
        }
        
        // Plant-based generation
        const matureTrees = gameState.tiles.filter(t => t.plant === 'mature-tree').length;
        const crystalTrees = gameState.tiles.filter(t => t.plant === 'crystal-tree').length;
        const mushrooms = gameState.tiles.filter(t => t.plant === 'mushroom').length;
        
        newStats.oxygen = Math.min(prev.maxOxygen, prev.oxygen + matureTrees);
        newStats.lifeForce = Math.min(prev.maxLifeForce, prev.lifeForce + crystalTrees);
        newStats.nutrients = Math.min(prev.maxNutrients, prev.nutrients + mushrooms);
        
        // Calculate biodiversity
        const plantTypes = new Set(gameState.tiles.filter(t => t.plant).map(t => t.plant));
        newStats.biodiversity = Math.min(100, plantTypes.size * 15 + prev.terrainRestored * 2);
        
        return newStats;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [gameState.gameSettings.isPaused, gameState.tiles]);

  // Enhanced plant growth and evolution system
  useEffect(() => {
    if (gameState.gameSettings.isPaused) return;

    const interval = setInterval(() => {
      gameState.setTiles(prevTiles => {
        return prevTiles.map(tile => {
          if (tile.plant === 'sapling' && tile.growthStage >= 3 && Math.random() < 0.08) {
            // Saplings evolve to mature trees
            gameState.setStats(prev => ({
              ...prev,
              treesMature: prev.treesMature + 1,
              score: prev.score + 75,
            }));
            toast.success("🌳 A sapling evolved into a mighty tree!");
            return { 
              ...tile, 
              plant: 'mature-tree', 
              isAnimating: true,
              growthStage: 1,
              terrain: 'flourishing'
            };
          }
          
          // Gradual growth progression
          if (tile.plant && tile.growthStage < 5) {
            return {
              ...tile,
              growthStage: tile.growthStage + (Math.random() < 0.3 ? 1 : 0)
            };
          }
          
          return tile;
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [gameState.gameSettings.isPaused]);

  // Dynamic weather and day/night cycle
  useEffect(() => {
    if (gameState.gameSettings.isPaused) return;

    const weatherInterval = setInterval(() => {
      const weathers = ['clear', 'rain', 'drought', 'storm', 'fog'];
      const randomWeather = weathers[Math.floor(Math.random() * weathers.length)];
      
      gameState.setStats(prev => ({
        ...prev,
        weather: randomWeather as typeof prev.weather,
      }));
    }, 30000); // Change weather every 30 seconds

    const dayNightInterval = setInterval(() => {
      gameState.setStats(prev => {
        const cycle = ['dawn', 'day', 'dusk', 'night'];
        const currentIndex = cycle.indexOf(prev.dayNight);
        const nextIndex = (currentIndex + 1) % cycle.length;
        return {
          ...prev,
          dayNight: cycle[nextIndex] as typeof prev.dayNight,
        };
      });
    }, 20000); // Change time every 20 seconds

    return () => {
      clearInterval(weatherInterval);
      clearInterval(dayNightInterval);
    };
  }, [gameState.gameSettings.isPaused]);

  const handleTileClick = useCallback((tile: any) => {
    if (!gameState.selectedPlantType || !canPlant(tile)) return;
    gameState.plantOnTile(tile, gameState.selectedPlantType);
  }, [gameState]);

  const canPlant = useCallback((tile: any) => {
    return tile.terrain === 'desolate' && !tile.plant;
  }, []);

  const handleResourceAction = useCallback((action: string) => {
    switch (action) {
      case 'meditate':
        gameState.setStats(prev => ({
          ...prev,
          lifeForce: Math.min(prev.maxLifeForce, prev.lifeForce + 5)
        }));
        toast.success("Meditation restored 5 Life Force! 🧘‍♂️");
        break;
      case 'collect-water':
        gameState.setStats(prev => ({
          ...prev,
          water: Math.min(prev.maxWater, prev.water + 3)
        }));
        toast.success("Collected water from the cosmic streams! 💧");
        break;
      case 'compost':
        gameState.setStats(prev => ({
          ...prev,
          nutrients: Math.min(prev.maxNutrients, prev.nutrients + 2)
        }));
        toast.success("Created nutrient-rich compost! 🌱");
        break;
      case 'breathe':
        gameState.setStats(prev => ({
          ...prev,
          oxygen: Math.min(prev.maxOxygen, prev.oxygen + 1)
        }));
        toast.success("Deep breathing increased oxygen levels! 💨");
        break;
    }
  }, [gameState]);

  const handlePlantSelect = useCallback((plantType: string) => {
    gameState.setSelectedPlantType(prev => prev === plantType ? null : plantType);
  }, [gameState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10 relative overflow-hidden">
      {/* Cosmic Background */}
      <div 
        className="absolute inset-0 opacity-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${cosmicBackground})` }}
      />
      
      {/* Game Status Overlay */}
      {gameState.gameSettings.isPaused && (
        <div className="absolute inset-0 bg-black/50 z-30 flex items-center justify-center">
          <div className="text-center text-white">
            <h2 className="text-4xl font-bold mb-4">Game Paused</h2>
            <p className="text-lg">Press P to resume or click the play button</p>
          </div>
        </div>
      )}
      
      <div className="relative z-10 container mx-auto p-4">
        {/* Enhanced Header */}
        <header className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-cosmic bg-clip-text text-transparent animate-pulse-life">
            Project I-Am-Groot: Advanced Edition
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Master the cosmic ecosystem and rebuild Groot's homeworld 🌍✨
          </p>
          
          {/* Game Controls Bar */}
          <div className="flex justify-center gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => gameState.setGameSettings(prev => ({ ...prev, isPaused: !prev.isPaused }))}
              className="gap-2"
            >
              {gameState.gameSettings.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              {gameState.gameSettings.isPaused ? 'Resume' : 'Pause'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => gameState.setGameSettings(prev => ({ ...prev, showGrid: !prev.showGrid }))}
              className="gap-2"
            >
              <Grid3X3 className="w-4 h-4" />
              Grid: {gameState.gameSettings.showGrid ? 'On' : 'Off'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="gap-2"
            >
              <HelpCircle className="w-4 h-4" />
              Help
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                gameState.initializeGrid();
                toast.success("Game world reset! 🔄");
              }}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        </header>

        {/* Enhanced Game Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-4 max-w-8xl mx-auto">
          {/* Left Panel - Resources & Plants */}
          <div className="xl:col-span-1 space-y-4">
            <ResourceManager
              stats={gameState.stats}
              onResourceAction={handleResourceAction}
            />
            <EnhancedPlantInventory
              stats={gameState.stats}
              selectedPlantType={gameState.selectedPlantType}
              onPlantSelect={handlePlantSelect}
            />
          </div>

          {/* Center - Enhanced Game Grid */}
          <div className="xl:col-span-2 flex justify-center">
            <GameGrid
              tiles={gameState.tiles}
              onTileClick={handleTileClick}
              selectedPlantType={gameState.selectedPlantType}
              canPlant={canPlant}
              showGrid={gameState.gameSettings.showGrid}
              weather={gameState.stats.weather}
              dayNight={gameState.stats.dayNight}
            />
          </div>

          {/* Right Panel - Game UI & Leaderboard */}
          <div className="xl:col-span-2 space-y-4">
            <GameUI
              stats={gameState.stats}
              selectedPlantType={gameState.selectedPlantType}
              onPlantSelect={handlePlantSelect}
              onMissionComplete={() => {
                toast.success("Mission completed! 🎉");
                gameState.setStats(prev => ({ ...prev, score: prev.score + 500 }));
              }}
            />
            <Leaderboard
              entries={leaderboard}
              currentPlayerScore={gameState.stats.score}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-8 text-sm text-muted-foreground">
          <p>"I am Groot." - Master the cosmic ecosystem! 🌱✨🌌</p>
          <p className="mt-2">
            <kbd className="px-2 py-1 bg-muted rounded text-xs">H</kbd> for help • 
            <kbd className="px-2 py-1 bg-muted rounded text-xs ml-1">P</kbd> to pause • 
            <kbd className="px-2 py-1 bg-muted rounded text-xs ml-1">1-6</kbd> plant selection
          </p>
        </footer>
      </div>

      {/* Help Panel */}
      <GameHelpPanel
        isOpen={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </div>
  );
};
