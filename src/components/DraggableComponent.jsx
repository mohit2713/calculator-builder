import { useDrag } from 'react-dnd';
import { useCalculatorStore } from '../store/calculatorStore';

export const DraggableComponent = ({ id, type, value, position }) => {
  const result = useCalculatorStore((state) => state.result);
  const removeComponent = useCalculatorStore((state) => state.removeComponent);
  
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'calculator-component',
    item: { id, type, value, position },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const baseClasses = "transition-all duration-200 relative group";
  const typeClasses = {
    number: "bg-blue-500 text-white w-12 h-12 flex items-center justify-center rounded",
    operator: "bg-green-500 text-white w-12 h-12 flex items-center justify-center rounded",
    result: "bg-gray-500 text-white w-28 h-12 flex items-center justify-center rounded",
  };

  const displayValue = type === 'result' ? `= ${result}` : value;

  return (
    <div
      ref={drag}
      className={`${baseClasses} ${typeClasses[type]} ${isDragging ? 'opacity-50 scale-105 z-50' : ''}`}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        transform: 'translate(0, 0)', // Ensures accurate positioning
        touchAction: 'none', // Improves touch device handling
      }}
    >
      {displayValue}
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeComponent(id);
        }}
        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full 
                 flex items-center justify-center opacity-0 group-hover:opacity-100 
                 transition-opacity duration-200 hover:bg-red-600 z-10"
      >
        ×
      </button>
    </div>
  );
}; 