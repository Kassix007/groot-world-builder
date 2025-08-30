
export type BiomeType = 'forest' | 'desert' | 'wetland' | 'mountain' | 'wasteland';
export type WeatherType = 'clear' | 'rain' | 'drought' | 'storm' | 'fog';
export type ClimateType = 'harsh' | 'temperate' | 'tropical' | 'arctic';
export type SeasonType = 'spring' | 'summer' | 'autumn' | 'winter';
export type DayNightType = 'day' | 'night' | 'dawn' | 'dusk';

export interface GameTile {
  id: string;
  x: number;
  y: number;
  terrain: 'desolate' | 'restored' | 'flourishing';
  plant?: 'sapling' | 'mature-tree' | 'flowers' | 'mushroom' | 'crystal-tree' | 'healing-herb';
  biome: BiomeType;
  fertility: number; // 1-5 scale
  waterLevel: number; // 1-5 scale  
  pollution: number; // 0-3 scale
  temperature: number; // Celsius
  isAnimating?: boolean;
  lastWatered: number; // timestamp
  growthStage: number; // 0-5 growth progression
}

export interface GameStats {
  lifeForce: number;
  maxLifeForce: number;
  plantsPlanted: number;
  treesMature: number;
  terrainRestored: number;
  currentMission: string;
  missionProgress: number;
  score: number;
  
  // Enhanced resources
  water: number;
  maxWater: number;
  nutrients: number;
  maxNutrients: number;
  oxygen: number;
  maxOxygen: number;
  biodiversity: number;
  
  // Environmental factors
  climate: ClimateType;
  season: SeasonType;
  dayNight: DayNightType;
  weather: WeatherType;
}

export interface Mission {
  id: number;
  title: string;
  description: string;
  requirements: MissionRequirement[];
  rewards: MissionReward[];
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  unlocked: boolean;
  completed: boolean;
}

export interface MissionRequirement {
  type: 'plant' | 'biome' | 'resource' | 'time' | 'combo';
  target: string | number;
  current: number;
  description: string;
}

export interface MissionReward {
  type: 'lifeForce' | 'water' | 'nutrients' | 'unlock' | 'score';
  amount: number;
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}
