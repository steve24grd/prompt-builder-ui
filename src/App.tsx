import React, { useState } from 'react';
import './App.css';
import DirectorySelector from './components/DirectorySelector';
import DirectoryView from './components/DirectoryView';
import CustomInstructionBox from './components/CustomInstructionBox';
import PromptManager from './components/PromptManager';
import RetrieveBox from './components/RetrieveBox';
import ErrorBoundary from './components/ErrorBoundary';

// Import your theme hook
import { useTheme } from './context/ThemeContext';

function App() {
    // Access theme and toggle function
    const { theme, toggleTheme } = useTheme();
    const [rootDir, setRootDir] = useState('');

    const handleRootDirChange = (newDir: string) => {
        setRootDir(newDir);
    };

    return (
        <div className={`app-container ${theme}`}>
            {/* Top heading area */}
            <header className="app-header">
                <h1>Prompt Builder UI</h1>
                <button
                    onClick={toggleTheme}
                    aria-label="Toggle Dark/Light Mode"
                >
                    Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
                </button>
            </header>

            {/* Other components */}
            <DirectorySelector rootDir={rootDir} onRootDirChange={handleRootDirChange} />
            <ErrorBoundary>
                <DirectoryView rootDir={rootDir} />
            </ErrorBoundary>
            <CustomInstructionBox rootDir={rootDir} />
            <RetrieveBox rootDir={rootDir} />
            <PromptManager rootDir={rootDir} />
        </div>
    );
}

export default App;