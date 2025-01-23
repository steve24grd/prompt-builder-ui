import React, { useState, ChangeEvent } from 'react';
import { useCacheContext } from '../context/CacheContext';
import { useRootDirectories } from '../context/RootDirectoriesContext';

const SpecsBox: React.FC = () => {
    const { rootDir } = useRootDirectories();
    const { specs, setSpecs } = useCacheContext();
    const [specsType, setSpecsType] = useState<'file' | 'new'>('new');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [fileContent, setFileContent] = useState('');
    const [newSpecs, setNewSpecs] = useState('');
    const [addToContext, setAddToContext] = useState(false);

    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const content = await file.text();
            setFileContent(content);
        }
    };

    const handleSaveSpecs = async () => {
        if (!rootDir) {
            alert('Please set the root directory first.');
            return;
        }

        try {
            if ('showSaveFilePicker' in window) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: 'specs.txt',
                    types: [{
                        description: 'Text Files',
                        accept: { 'text/plain': ['.txt'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(newSpecs);
                await writable.close();
                alert('Successfully saved specs');
            } else {
                // Fallback for browsers that don't support File System Access API
                const blob = new Blob([newSpecs], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'specs.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to save specs');
        }
    };

    const handleAddToContextChange = (checked: boolean) => {
        setAddToContext(checked);
        const content = specsType === 'file' ? fileContent : newSpecs;
        
        if (checked && content) {
            setSpecs(content);
            // Store in localStorage as backup
            localStorage.setItem('specs', content);
        } else if (!checked) {
            setSpecs('');
            localStorage.removeItem('specs');
        }
    };

    return (
        <div style={{ marginTop: '2rem' }}>
            <h2>Specs</h2>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ marginRight: '1rem' }}>
                    <input
                        type="radio"
                        value="file"
                        checked={specsType === 'file'}
                        onChange={(e) => setSpecsType('file')}
                    /> From File
                </label>
                <label>
                    <input
                        type="radio"
                        value="new"
                        checked={specsType === 'new'}
                        onChange={(e) => setSpecsType('new')}
                    /> New Specs
                </label>
            </div>

            {specsType === 'file' && (
                <div style={{ marginBottom: '1rem' }}>
                    <input
                        type="file"
                        accept=".txt"
                        onChange={handleFileSelect}
                        style={{ marginRight: '1rem' }}
                    />
                    {selectedFile && (
                        <div style={{ marginTop: '1rem' }}>
                            <h4>Specs (Preview)</h4>
                            <pre style={{ 
                                maxHeight: '200px', 
                                overflow: 'auto', 
                                padding: '1rem',
                                backgroundColor: '#f5f5f5',
                                borderRadius: '4px'
                            }}>
                                {fileContent}
                            </pre>
                        </div>
                    )}
                </div>
            )}

            {specsType === 'new' && (
                <div>
                    <textarea
                        rows={10}
                        cols={50}
                        value={newSpecs}
                        onChange={(e) => setNewSpecs(e.target.value)}
                        placeholder="Type your specs here..."
                        style={{ marginBottom: '1rem', width: '100%' }}
                    />
                    <button onClick={handleSaveSpecs}>
                        Save to specs.txt
                    </button>
                </div>
            )}
            <div style={{ marginTop: '10px' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={addToContext}
                        onChange={(e) => handleAddToContextChange(e.target.checked)}
                    />
                    Add to Context
                </label>
            </div>
        </div>
    );
};

export default SpecsBox;
