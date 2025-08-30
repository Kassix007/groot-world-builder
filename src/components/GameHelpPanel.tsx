
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Keyboard, Mouse, Gamepad2 } from 'lucide-react';

interface GameHelpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GameHelpPanel = ({ isOpen, onClose }: GameHelpPanelProps) => {
  if (!isOpen) return null;

  const keyboardControls = [
    { key: '1-6', action: 'Select plant types' },
    { key: 'ESC', action: 'Clear selection / Close menus' },
    { key: 'G', action: 'Toggle grid overlay' },
    { key: 'P', action: 'Pause/Resume game' },
    { key: 'H', action: 'Show/Hide this help panel' },
    { key: 'SPACE', action: 'Quick plant (selected type)' },
    { key: 'R', action: 'Rotate view' },
    { key: 'M', action: 'Toggle minimap' },
  ];

  const mouseControls = [
    { action: 'Left Click', description: 'Plant on tile / Select UI elements' },
    { action: 'Right Click', description: 'Quick info about tile' },
    { action: 'Mouse Wheel', description: 'Zoom in/out' },
    { action: 'Middle Click', description: 'Center view on tile' },
  ];

  const gameplayTips = [
    'Different biomes affect plant growth rates',
    'Water your plants regularly for better yields',
    'Combine different plant types for biodiversity bonus',
    'Weather affects resource generation',
    'Complete missions for major resource rewards',
    'Crystal trees provide passive life force generation',
    'Mushrooms clean pollution and generate nutrients',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-cosmic">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-primary" />
              Game Controls & Help
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Keyboard Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Keyboard Controls
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {keyboardControls.map((control, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <kbd className="px-2 py-1 bg-background rounded border text-sm font-mono">
                    {control.key}
                  </kbd>
                  <span className="text-sm text-muted-foreground flex-1 ml-3">
                    {control.action}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Mouse Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Mouse className="w-4 h-4" />
              Mouse Controls
            </h3>
            <div className="space-y-2">
              {mouseControls.map((control, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                  <Badge variant="outline" className="text-sm">
                    {control.action}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex-1 ml-3">
                    {control.description}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gameplay Tips */}
          <div>
            <h3 className="text-lg font-semibold mb-3">🌟 Gameplay Tips</h3>
            <div className="grid grid-cols-1 gap-2">
              {gameplayTips.map((tip, index) => (
                <div key={index} className="p-3 bg-gradient-to-r from-muted/50 to-accent/10 rounded border-l-4 border-primary">
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-center pt-4">
            <Button onClick={onClose} className="px-8">
              Got it! Let's play 🚀
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
