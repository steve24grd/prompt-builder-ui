import React, { useState } from 'react';
import DirectorySelector from './components/DirectorySelector';
import DirectoryView from './components/DirectoryView';
import RetrieveBox from './components/RetrieveBox';
import PromptManager from './components/PromptManager';
import CustomInstructionBox from './components/CustomInstructionBox';

const App: React.FC = () => {
    const [rootDir, setRootDir] = useState<string>('');

    return (
        <div style={{ margin: '20px' }}>
            <h1>Prompt Builder (TypeScript + React)</h1>
            <DirectorySelector rootDir={rootDir} onRootDirChange={setRootDir} />

            <DirectoryView rootDir={rootDir} />
            <hr />

            <RetrieveBox rootDir={rootDir} />
            <hr />

            <CustomInstructionBox rootDir={rootDir} />
            <hr />

            <PromptManager rootDir={rootDir} />
        </div>
    );
};

export default App;