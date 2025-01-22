import React from 'react';
import './App.css';
import DirectorySelector from './components/DirectorySelector';
import DirectoryView from './components/DirectoryView';
import CustomInstructionBox from './components/CustomInstructionBox';
import PromptManager from './components/PromptManager';
import RetrieveBox from './components/RetrieveBox';
import ErrorBoundary from './components/ErrorBoundary';
import TargetDirectorySelector from './components/TargetDirectorySelector';
import SpecsBox from './components/SpecsBox';

// Use your theme hook
import { useTheme } from './context/ThemeContext';
// <-- NEW: import our new rootDir/targetDir context
import { useRootDirectories } from './context/RootDirectoriesContext';

function App() {
  // theme from ThemeContext
  const { theme, toggleTheme } = useTheme();

  // root directories from RootDirectoriesContext
  const { rootDir, targetDir } = useRootDirectories();

  return (
    <div className={`app-container ${theme}`}>
      {/* Top heading area */}
      <header className="app-header">
        <h1>Prompt Builder UI</h1>
        <button onClick={toggleTheme} aria-label="Toggle Dark/Light Mode">
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>

      {/* Directory Selection */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <DirectorySelector />
        <TargetDirectorySelector />
      </div>

      {/* Directory Preview */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
        <div style={{ flex: 1 }}>
          <h3>Source Repository Structure:</h3>
          {/* We just tell DirectoryView it’s the "source" */}
          <DirectoryView type="source" />
        </div>
        <div style={{ flex: 1 }}>
          <h3>Target Repository Structure:</h3>
          {/* We just tell DirectoryView it’s the "target" */}
          <DirectoryView type="target" />
        </div>
      </div>

      <ErrorBoundary>
        {/* These components no longer need rootDir as a prop */}
        <CustomInstructionBox />
        <SpecsBox />
        <RetrieveBox />
        <PromptManager />
      </ErrorBoundary>
    </div>
  );
}

export default App;