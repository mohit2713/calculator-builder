import { v4 as uuidv4 } from 'uuid';
import { useCalculatorStore } from '../store/calculatorStore';

export const Toolbar = () => {
  const { addComponent, undo, redo, toggleDarkMode, isDarkMode, calculateResult } = useCalculatorStore();

  const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
  const operators = ['+', '-', '*', '/'];

  const handleAddComponent = (type, value) => {
    addComponent({
      id: uuidv4(),
      type,
      value,
      position: { x: 0, y: 0 },
    });
    calculateResult();
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 border-b dark:border-gray-700 overflow-x-auto">
      <div className="flex flex-wrap gap-2 items-center min-w-full">
        <div className="flex flex-wrap gap-2">
          {numbers.map((num) => (
            <button
              key={num}
              onClick={() => handleAddComponent('number', num)}
              className="p-2 w-12 h-12 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
            >
              {num}
            </button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {operators.map((op) => (
            <button
              key={op}
              onClick={() => handleAddComponent('operator', op)}
              className="p-2 w-12 h-12 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
            >
              {op}
            </button>
          ))}
        </div>

        <button
          onClick={() => handleAddComponent('result', '=')}
          className="p-2 h-12 px-4 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center"
        >
          Result
        </button>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={undo}
            className="p-2 h-12 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Undo
          </button>
          <button
            onClick={redo}
            className="p-2 h-12 px-4 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            Redo
          </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </div>
  );
}; 