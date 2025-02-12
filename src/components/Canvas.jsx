import { useDrop } from 'react-dnd';
import { useCalculatorStore } from '../store/calculatorStore';
import { DraggableComponent } from './DraggableComponent';

export const Canvas = () => {
  const { components, updatePosition, calculateResult } = useCalculatorStore();

  const [, drop] = useDrop(() => ({
    accept: 'calculator-component',
    drop: (item, monitor) => {
      const dropOffset = monitor.getSourceClientOffset();
      const canvasElement = document.querySelector('#calculator-canvas');
      
      if (dropOffset && canvasElement) {
        const canvasRect = canvasElement.getBoundingClientRect();
        const x = dropOffset.x - canvasRect.left;
        const y = dropOffset.y - canvasRect.top;
        
        // Snap to grid (optional, adjust grid size as needed)
        const gridSize = 10;
        const snappedX = Math.round(x / gridSize) * gridSize;
        const snappedY = Math.round(y / gridSize) * gridSize;
        
        updatePosition(item.id, { 
          x: snappedX,
          y: snappedY
        });
        calculateResult();
      }
    },
  }));

  return (
    <div
      id="calculator-canvas"
      ref={drop}
      className="w-full min-h-[calc(100vh-200px)] bg-gray-100 dark:bg-gray-800 relative p-4 overflow-auto"
      style={{ 
        touchAction: 'none',
        minHeight: '400px' // Ensures minimum height for dropping
      }}
    >
      {components.map((component) => (
        <DraggableComponent 
          key={component.id} 
          {...component} 
        />
      ))}
    </div>
  );
}; 