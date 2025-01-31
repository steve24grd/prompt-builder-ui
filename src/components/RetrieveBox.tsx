import React, { useState } from 'react';
import { useCacheContext } from '../context/CacheContext';
import { useRootDirectories } from '../context/RootDirectoriesContext';

const RetrieveBox: React.FC = () => {
    const { rootDir } = useRootDirectories(); // <--- from context
    const [pathsText, setPathsText] = useState('');
    const [output, setOutput] = useState('');
    const [addToContext, setAddToContext] = useState(false);
    const { 
        cachedSourceFileTrees, 
        setCachedSourceFileTrees,
        cachedTargetFileTrees,
        setCachedTargetFileTrees,
        setRetrievedFiles
    } = useCacheContext();

    const handleRetrieve = () => {
        if (!rootDir) {
            alert('Please set the root directory first.');
            return;
        }
        fetch('http://localhost:4000/api/retrieve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rootDir, pathsContent: pathsText }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.extracted) {
                    setOutput(data.extracted);
                } else if (data.error) {
                    alert(`Error: ${data.error}`);
                }
            })
            .catch(err => {
                console.error(err);
                alert(`Failed to retrieve: ${err.message}`);
            });
    };

    const handleAddToContextChange = (checked: boolean) => {
        setAddToContext(checked);
        
        if (checked && output) {
            setRetrievedFiles(output);
            // Store in localStorage as backup
            localStorage.setItem('retrievedFiles', output);
        } else if (!checked) {
            setRetrievedFiles('');
            localStorage.removeItem('retrievedFiles');
        }
    };

    const handleSaveToFile = async () => {
        if (!rootDir) {
            alert('Please set the root directory first.');
            return;
        }

        try {
            // Check if File System Access API is supported
            if ('showDirectoryPicker' in window) {
                try {
                    // Ask user to select a directory
                    const dirHandle = await window.showDirectoryPicker();
                    
                    // Create a new file in the selected directory
                    const fileHandle = await dirHandle.getFileHandle('extract.txt', { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(output);
                    await writable.close();
                    
                    alert('Successfully saved to the selected directory');
                } catch (err) {
                    // If user cancels directory selection or permission denied, fall back to download
                    console.warn('Directory access failed, falling back to download:', err);
                    fallbackDownload();
                }
            } else {
                // Fall back to regular download for unsupported browsers
                fallbackDownload();
            }
        } catch (err) {
            console.error(err);
            alert(`Failed to save file: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
        }
    };

    const fallbackDownload = () => {
        const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'extract.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        alert('File download started');
    };

    return (
        <div>
            <h2>Retrieve Files</h2>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleRetrieve} style={{ marginRight: '1rem' }}>Retrieve</button>
                {output && (
                    <>
                        <button onClick={handleSaveToFile}>Save to extract.txt</button>
                        <label style={{ marginLeft: '10px' }}>
                            <input
                                type="checkbox"
                                checked={addToContext}
                                onChange={(e) => handleAddToContextChange(e.target.checked)}
                            />
                            Add to context
                        </label>
                    </>
                )}
            </div>
            <textarea
                rows={5}
                cols={50}
                value={pathsText}
                onChange={e => setPathsText(e.target.value)}
                placeholder="Enter one file path per line..."
            />
            <br />

            {output && (
                <div style={{ marginTop: '1rem' }}>
                    <h4>Output (preview)</h4>
                    <pre style={{ 
                        maxHeight: '200px', 
                        overflow: 'auto', 
                        padding: '1rem',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '4px'
                    }}>{output}</pre>
                </div>
            )}
        </div>
    );
};

export default RetrieveBox;