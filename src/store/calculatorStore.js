import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const COMPONENT_WIDTH = 60;  // Standard width for components
const COMPONENT_HEIGHT = 60; // Standard height for components
const GRID_SNAP = 10;       // Snap to grid value

export const useCalculatorStore = create(
  persist(
    (set, get) => ({
      components: [],
      history: [[]],
      historyIndex: 0,
      isDarkMode: false,
      result: '0',

      addComponent: (component) => {
        const components = get().components;
        // Find the rightmost component's position
        const lastComponent = components[components.length - 1];
        const newPosition = lastComponent
          ? { 
              x: lastComponent.position.x + COMPONENT_WIDTH + 10, 
              y: lastComponent.position.y 
            }
          : { x: 50, y: 50 };

        const newComponent = {
          ...component,
          position: newPosition
        };

        const newComponents = [...components, newComponent];
        set((state) => ({
          components: newComponents,
          history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
          historyIndex: state.historyIndex + 1,
        }));
      },

      updatePosition: (id, newPosition) => {
        const components = get().components;
        
        // Snap to grid
        const snappedPosition = {
          x: Math.round(newPosition.x / GRID_SNAP) * GRID_SNAP,
          y: Math.round(newPosition.y / GRID_SNAP) * GRID_SNAP,
        };

        // Check for collisions with other components
        const isColliding = components.some(comp => {
          if (comp.id === id) return false;
          
          const xOverlap = Math.abs(comp.position.x - snappedPosition.x) < COMPONENT_WIDTH;
          const yOverlap = Math.abs(comp.position.y - snappedPosition.y) < COMPONENT_HEIGHT;
          
          return xOverlap && yOverlap;
        });

        if (isColliding) {
          // Find the nearest non-colliding position
          let adjustedX = snappedPosition.x;
          while (components.some(comp => {
            if (comp.id === id) return false;
            return Math.abs(comp.position.x - adjustedX) < COMPONENT_WIDTH &&
                   Math.abs(comp.position.y - snappedPosition.y) < COMPONENT_HEIGHT;
          })) {
            adjustedX += COMPONENT_WIDTH + 10;
          }
          snappedPosition.x = adjustedX;
        }

        const newComponents = components.map((comp) =>
          comp.id === id ? { ...comp, position: snappedPosition } : comp
        );

        set((state) => ({
          components: newComponents,
          history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
          historyIndex: state.historyIndex + 1,
        }));
      },

      undo: () => {
        set((state) => ({
          historyIndex: Math.max(0, state.historyIndex - 1),
          components: state.history[Math.max(0, state.historyIndex - 1)],
        }));
      },

      redo: () => {
        set((state) => ({
          historyIndex: Math.min(state.history.length - 1, state.historyIndex + 1),
          components: state.history[Math.min(state.history.length - 1, state.historyIndex + 1)],
        }));
      },

      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      calculateResult: () => {
        const components = get().components;
        
        const sortedComponents = [...components].sort((a, b) => {
          if (Math.abs(a.position.y - b.position.y) < 50) {
            return a.position.x - b.position.x;
          }
          return a.position.y - b.position.y;
        });

        const expression = sortedComponents
          .filter(comp => comp.type !== 'result')
          .map(comp => comp.value)
          .join('');

        try {
          const result = Function(`'use strict'; return (${expression})`)();
          set({ result: String(result) });
        } catch (error) {
          set({ result: 'Error' });
        }
      },

      removeComponent: (id) => {
        const newComponents = get().components.filter(comp => comp.id !== id);
        set((state) => ({
          components: newComponents,
          history: [...state.history.slice(0, state.historyIndex + 1), newComponents],
          historyIndex: state.historyIndex + 1,
        }));
      },
    }),
    {
      name: 'calculator-storage',
    }
  )
); 