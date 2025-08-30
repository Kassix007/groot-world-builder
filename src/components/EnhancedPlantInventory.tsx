
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GameStats } from '../types/gameTypes';
import { 
  Leaf, 
  Flower, 
  TreePine, 
  CircleDot, 
  Gem, 
  Heart 
} from 'lucide-react';

interface EnhancedPlantInventoryProps {
  stats: GameStats;
  selectedPlantType: string | null;
  onPlantSelect: (plantType: string) => void;
}

const PLANT_DATA = {
  sapling: {
    name: 'Sapling',
    icon: <TreePine className="w-4 h-4" />,
    cost: { lifeForce: 10, water: 5, nutrients: 3 },
    description: 'Fast-growing tree, provides oxygen',
    rarity: 'common',
    effects: ['oxygen +2', 'biodiversity +1'],
    hotkey: '1',
  },
  flowers: {
    name: 'Flowers',
    icon: <Flower className="w-4 h-4" />,
    cost: { lifeForce: 5, water: 3, nutrients: 2 },
    description: 'Beautiful blooms, attracts wildlife',
    rarity: 'common',
    effects: ['biodiversity +3', 'beauty +2'],
    hotkey: '2',
  },
  'mature-tree': {
    name: 'Mature Tree',
    icon: <TreePine className="w-4 h-4" />,
    cost: { lifeForce: 25, water: 15, nutrients: 10 },
    description: 'Ancient tree with deep roots',
    rarity: 'rare',
    effects: ['oxygen +5', 'stability +3', 'shade +2'],
    hotkey: '3',
  },
  mushroom: {
    name: 'Mushroom',
    icon: <CircleDot className="w-4 h-4" />,
    cost: { lifeForce: 8, water: 2, nutrients: 5 },
    description: 'Decomposes waste, enriches soil',
    rarity: 'uncommon',
    effects: ['nutrients +2', 'cleansing +3'],
    hotkey: '4',
  },
  'crystal-tree': {
    name: 'Crystal Tree',
    icon: <Gem className="w-4 h-4" />,
    cost: { lifeForce: 50, water: 20, nutrients: 15 },
    description: 'Mystical energy conductor',
    rarity: 'legendary',
    effects: ['lifeForce regen +1', 'magic +5'],
    hotkey: '5',
  },
  'healing-herb': {
    name: 'Healing Herb',
    icon: <Heart className="w-4 h-4" />,
    cost: { lifeForce: 15, water: 8, nutrients: 6 },
    description: 'Medicinal plant, boosts recovery',
    rarity: 'epic',
    effects: ['healing +4', 'resistance +2'],
    hotkey: '6',
  },
};

export const EnhancedPlantInventory = ({ stats, selectedPlantType, onPlantSelect }: EnhancedPlantInventoryProps) => {
  const canAfford = (plantType: keyof typeof PLANT_DATA) => {
    const cost = PLANT_DATA[plantType].cost;
    return stats.lifeForce >= cost.lifeForce && 
           stats.water >= cost.water && 
           stats.nutrients >= cost.nutrients;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'uncommon': return 'bg-green-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getButtonVariant = (plantType: string) => {
    if (selectedPlantType === plantType) return 'default';
    if (!canAfford(plantType as keyof typeof PLANT_DATA)) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Leaf className="w-4 h-4 text-primary" />
          Enhanced Plant Laboratory
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground mb-3">
          Use number keys (1-6) for quick selection
        </div>
        
        {Object.entries(PLANT_DATA).map(([plantType, data]) => (
          <Button
            key={plantType}
            variant={getButtonVariant(plantType)}
            size="sm"
            className="w-full justify-start text-left p-3 h-auto"
            onClick={() => onPlantSelect(plantType)}
            disabled={!canAfford(plantType as keyof typeof PLANT_DATA)}
          >
            <div className="flex flex-col items-start w-full space-y-2">
              <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                  {data.icon}
                  <span className="font-medium">{data.name}</span>
                  <Badge className={`text-xs px-1 py-0 ${getRarityColor(data.rarity)} text-white`}>
                    {data.rarity}
                  </Badge>
                  <kbd className="px-1 py-0.5 text-xs bg-muted rounded">
                    {data.hotkey}
                  </kbd>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground w-full">
                {data.description}
              </div>
              
              <div className="flex flex-wrap gap-1 w-full">
                {data.effects.map((effect, index) => (
                  <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                    {effect}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2 text-xs w-full">
                <span className="text-life-force">⚡{data.cost.lifeForce}</span>
                <span className="text-blue-500">💧{data.cost.water}</span>
                <span className="text-green-600">🌱{data.cost.nutrients}</span>
              </div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};
