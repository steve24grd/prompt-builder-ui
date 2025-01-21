import React, { useState } from 'react';
import './App.css';
import DirectorySelector from './components/DirectorySelector';
import DirectoryView from './components/DirectoryView';
import CustomInstructionBox from './components/CustomInstructionBox';
import PromptManager from './components/PromptManager';
import RetrieveBox from './components/RetrieveBox';
import ErrorBoundary from './components/ErrorBoundary';
import TargetDirectorySelector from './components/TargetDirectorySelector';

// Import your theme hook
import { useTheme } from './context/ThemeContext';

function App() {
    // Access theme and toggle function
    const { theme, toggleTheme } = useTheme();
    const [rootDir, setRootDir] = useState('');
    const [targetDir, setTargetDir] = useState('');

    const handleRootDirChange = (newDir: string) => {
        setRootDir(newDir);
    };

    const handleTargetDirChange = (newDir: string) => {
        setTargetDir(newDir);
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

            {/* Directory Selection */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <DirectorySelector rootDir={rootDir} onRootDirChange={handleRootDirChange} />
                <TargetDirectorySelector targetDir={targetDir} onTargetDirChange={handleTargetDirChange} />
            </div>

            {/* Directory Preview */}
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ flex: 1 }}>
                    <h3>Source Repository Structure:</h3>
                    <DirectoryView rootDir={rootDir} type="source" />
                </div>
                <div style={{ flex: 1 }}>
                    <h3>Target Repository Structure:</h3>
                    <DirectoryView rootDir={targetDir} type="target" />
                </div>
            </div>

            <ErrorBoundary>
                <CustomInstructionBox rootDir={rootDir} />
                <RetrieveBox rootDir={rootDir} />
                <PromptManager rootDir={rootDir} />
            </ErrorBoundary>
        </div>
    );
}

export default App;