import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCalculatorStore } from './store/calculatorStore';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { useEffect } from 'react';

function App() {
  const isDarkMode = useCalculatorStore((state) => state.isDarkMode);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-200">
      <DndProvider backend={HTML5Backend}>
        <Toolbar />
        <Canvas />
      </DndProvider>
    </div>
  );
}

export default App; 