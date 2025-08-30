
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GameStats } from '../types/gameTypes';
import { Droplets, Leaf, Wind, Thermometer, Cloud, Sun, Moon } from 'lucide-react';

interface ResourceManagerProps {
  stats: GameStats;
  onResourceAction: (action: string) => void;
}

export const ResourceManager = ({ stats, onResourceAction }: ResourceManagerProps) => {
  const resources = [
    {
      name: 'Life Force',
      current: stats.lifeForce,
      max: stats.maxLifeForce,
      icon: <Leaf className="w-4 h-4 text-life-force" />,
      color: 'text-life-force',
      action: 'meditate',
    },
    {
      name: 'Water',
      current: stats.water,
      max: stats.maxWater,
      icon: <Droplets className="w-4 h-4 text-blue-500" />,
      color: 'text-blue-500',
      action: 'collect-water',
    },
    {
      name: 'Nutrients',
      current: stats.nutrients,
      max: stats.maxNutrients,
      icon: <Leaf className="w-4 h-4 text-green-600" />,
      color: 'text-green-600',
      action: 'compost',
    },
    {
      name: 'Oxygen',
      current: stats.oxygen,
      max: stats.maxOxygen,
      icon: <Wind className="w-4 h-4 text-cyan-500" />,
      color: 'text-cyan-500',
      action: 'breathe',
    },
  ];

  const getWeatherIcon = () => {
    switch (stats.weather) {
      case 'rain': return <Cloud className="w-4 h-4 text-blue-400" />;
      case 'clear': return <Sun className="w-4 h-4 text-yellow-400" />;
      case 'storm': return <Cloud className="w-4 h-4 text-gray-600" />;
      default: return <Sun className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getTimeIcon = () => {
    return stats.dayNight === 'day' ? 
      <Sun className="w-4 h-4 text-yellow-400" /> : 
      <Moon className="w-4 h-4 text-blue-300" />;
  };

  return (
    <div className="space-y-4">
      {/* Environmental Status */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Environment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              {getWeatherIcon()}
              <span className="capitalize">{stats.weather}</span>
            </div>
            <div className="flex items-center gap-1">
              {getTimeIcon()}
              <span className="capitalize">{stats.dayNight}</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className="w-3 h-3 text-green-500" />
              <span className="capitalize">{stats.season}</span>
            </div>
            <div className="flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-orange-500" />
              <span className="capitalize">{stats.climate}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Biodiversity</span>
              <Badge variant="outline" className="text-xs">
                {stats.biodiversity}%
              </Badge>
            </div>
            <Progress value={stats.biodiversity} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Resource Management */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Resources</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {resources.map((resource) => (
            <div key={resource.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {resource.icon}
                  <span className="text-xs font-medium">{resource.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${resource.color}`}>
                    {resource.current}/{resource.max}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => onResourceAction(resource.action)}
                    disabled={resource.current >= resource.max}
                  >
                    +
                  </Button>
                </div>
              </div>
              <Progress 
                value={(resource.current / resource.max) * 100} 
                className="h-2"
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
