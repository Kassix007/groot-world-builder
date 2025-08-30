import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import lifeForceIcon from '@/assets/life-force-icon.png';

export interface GameStats {
  lifeForce: number;
  maxLifeForce: number;
  plantsPlanted: number;
  treesMature: number;
  terrainRestored: number;
  currentMission: string;
  missionProgress: number;
  score: number;
}

export interface GameUIProps {
  stats: GameStats;
  selectedPlantType: string | null;
  onPlantSelect: (plantType: string) => void;
  onMissionComplete: () => void;
}

const PLANT_COSTS = {
  sapling: 10,
  flowers: 5,
  'mature-tree': 25,
};

const PLANT_DESCRIPTIONS = {
  sapling: 'Small tree that grows over time',
  flowers: 'Beautiful blooms that spread life',
  'mature-tree': 'Instant mature tree with high impact',
};

export const GameUI = ({ stats, selectedPlantType, onPlantSelect, onMissionComplete }: GameUIProps) => {
  const canAfford = (plantType: keyof typeof PLANT_COSTS) => {
    return stats.lifeForce >= PLANT_COSTS[plantType];
  };

  const getButtonVariant = (plantType: string) => {
    if (selectedPlantType === plantType) return 'default';
    if (!canAfford(plantType as keyof typeof PLANT_COSTS)) return 'secondary';
    return 'outline';
  };

  return (
    <div className="space-y-4">
      {/* Life Force Display */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <img src={lifeForceIcon} alt="Life Force" className="w-6 h-6 animate-pulse-life" />
            Life Force Energy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Progress 
              value={(stats.lifeForce / stats.maxLifeForce) * 100} 
              className="h-3"
            />
            <div className="flex justify-between text-sm">
              <span className="text-life-force font-bold">{stats.lifeForce}</span>
              <span className="text-muted-foreground">/ {stats.maxLifeForce}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plant Inventory */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-primary">Plant Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(PLANT_COSTS).map(([plantType, cost]) => (
            <Button
              key={plantType}
              variant={getButtonVariant(plantType)}
              size="sm"
              className="w-full justify-start text-left p-3 h-auto"
              onClick={() => onPlantSelect(plantType)}
              disabled={!canAfford(plantType as keyof typeof PLANT_COSTS)}
            >
              <div className="flex flex-col items-start w-full">
                <div className="flex justify-between items-center w-full">
                  <span className="font-medium capitalize">{plantType.replace('-', ' ')}</span>
                  <Badge variant={canAfford(plantType as keyof typeof PLANT_COSTS) ? 'default' : 'secondary'}>
                    {cost} <img src={lifeForceIcon} alt="LF" className="w-3 h-3 ml-1 inline" />
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground mt-1">
                  {PLANT_DESCRIPTIONS[plantType as keyof typeof PLANT_DESCRIPTIONS]}
                </span>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Current Mission */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-accent">Current Mission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-foreground">{stats.currentMission}</p>
          <Progress value={stats.missionProgress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Progress: {Math.round(stats.missionProgress)}%
          </div>
          {stats.missionProgress >= 100 && (
            <Button 
              onClick={onMissionComplete}
              className="w-full shadow-cosmic"
              variant="default"
            >
              Complete Mission! ✨
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Stats Display */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-bold text-primary">{stats.plantsPlanted}</div>
            <div className="text-muted-foreground">Plants</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-bold text-flourishing">{stats.treesMature}</div>
            <div className="text-muted-foreground">Trees</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-bold text-accent">{stats.terrainRestored}</div>
            <div className="text-muted-foreground">Restored</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="font-bold text-cosmic-energy">{stats.score}</div>
            <div className="text-muted-foreground">Score</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};