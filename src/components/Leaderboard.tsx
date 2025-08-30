import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award } from 'lucide-react';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  plantsPlanted: number;
  missionsCompleted: number;
  rank: number;
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentPlayerScore?: number;
}

export const Leaderboard = ({ entries, currentPlayerScore }: LeaderboardProps) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 text-center text-sm font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankBadgeVariant = (rank: number) => {
    if (rank <= 3) return 'default';
    if (rank <= 10) return 'secondary';
    return 'outline';
  };

  return (
    <Card className="shadow-card border-border">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg text-cosmic-energy">
          <Trophy className="w-5 h-5" />
          Global Leaderboard
        </CardTitle>
        {currentPlayerScore !== undefined && (
          <p className="text-sm text-muted-foreground">
            Your score: <span className="text-primary font-bold">{currentPlayerScore}</span>
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto">
        {entries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Be the first to restore Groot's homeworld!</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`
                flex items-center justify-between p-3 rounded-lg border transition-colors
                ${entry.score === currentPlayerScore 
                  ? 'bg-primary/10 border-primary shadow-growth' 
                  : 'bg-muted/50 border-border hover:bg-muted'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {getRankIcon(entry.rank)}
                  <Badge variant={getRankBadgeVariant(entry.rank)}>
                    #{entry.rank}
                  </Badge>
                </div>
                <div>
                  <div className="font-medium text-foreground">
                    {entry.playerName}
                    {entry.score === currentPlayerScore && (
                      <span className="text-xs text-primary ml-2">(You)</span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {entry.plantsPlanted} plants • {entry.missionsCompleted} missions
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-cosmic-energy">{entry.score.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">points</div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};