import "./App.css";
import { DndProvider } from  'react-dnd' ;
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useCalculatorStore } from './store/calculatorStore';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';

function App() {
  const isDarkMode = useCalculatorStore((state) => state.isDarkMode);

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
        <DndProvider backend={HTML5Backend}>
          <Toolbar />
          <Canvas />
        </DndProvider>
      </div>
    </div>
  );
}

export default App; 
