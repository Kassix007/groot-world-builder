
import { useEffect, useCallback } from 'react';

export interface KeyboardControls {
  onSelectSapling: () => void;
  onSelectFlowers: () => void;
  onSelectMatureTree: () => void;
  onClearSelection: () => void;
  onToggleGrid: () => void;
  onPauseGame: () => void;
  onShowHelp: () => void;
}

export const useKeyboardControls = (controls: KeyboardControls) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Prevent default behavior for game keys
    if (['1', '2', '3', 'Escape', 'g', 'p', 'h'].includes(event.key.toLowerCase())) {
      event.preventDefault();
    }

    switch (event.key.toLowerCase()) {
      case '1':
        controls.onSelectSapling();
        break;
      case '2':
        controls.onSelectFlowers();
        break;
      case '3':
        controls.onSelectMatureTree();
        break;
      case 'escape':
        controls.onClearSelection();
        break;
      case 'g':
        controls.onToggleGrid();
        break;
      case 'p':
        controls.onPauseGame();
        break;
      case 'h':
        controls.onShowHelp();
        break;
    }
  }, [controls]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};
