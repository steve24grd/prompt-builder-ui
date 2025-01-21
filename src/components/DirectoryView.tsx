import React, { useEffect, useState } from 'react';
import { useCacheContext } from '../context/CacheContext';

interface Props {
    rootDir: string;
    type: 'source' | 'target';
}

const DirectoryView: React.FC<Props> = ({ rootDir, type }) => {
    const [directoryTree, setDirectoryTree] = useState('');
    const [addToContext, setAddToContext] = useState(false);
    const { 
        setCachedSourceFileTrees,
        setCachedTargetFileTrees
    } = useCacheContext();

    useEffect(() => {
        if (!rootDir) return;

        fetch('http://localhost:4000/api/directory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rootDir }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.directoryTree) {
                    setDirectoryTree(data.directoryTree);
                } else if (data.error) {
                    alert(`Error: ${data.error}`);
                }
            })
            .catch(err => {
                console.error(err);
                alert(`Failed to fetch directory tree: ${err.message}`);
            });
    }, [rootDir]);

    const handleAddToContextChange = (checked: boolean) => {
        if (!directoryTree) {
            alert('No directory structure available to add to context.');
            return;
        }

        setAddToContext(checked);
        const prefix = type === 'source' ? '# file_trees_source' : '# file_trees_target';
        const content = checked ? `${prefix}\n${directoryTree}` : '';
        
        if (type === 'source') {
            setCachedSourceFileTrees(content);
        } else {
            setCachedTargetFileTrees(content);
        }
    };

    const handleSaveDirectoryStructure = async () => {
        if (!directoryTree) {
            alert('No directory structure to save.');
            return;
        }

        try {
            if ('showDirectoryPicker' in window) {
                try {
                    const dirHandle = await window.showDirectoryPicker();
                    const fileHandle = await dirHandle.getFileHandle(`file_trees_${type}.txt`, { create: true });
                    const writable = await fileHandle.createWritable();
                    await writable.write(directoryTree);
                    await writable.close();
                    
                    alert('Successfully saved file tree to the selected directory');
                } catch (err) {
                    console.warn('Directory access failed, falling back to download:', err);
                    downloadDirectoryStructure();
                }
            } else {
                downloadDirectoryStructure();
            }
        } catch (err) {
            console.error(err);
            alert(`Failed to save directory structure: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
        }
    };

    const downloadDirectoryStructure = () => {
        const blob = new Blob([directoryTree], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `directory-structure_${type}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        alert('Directory structure download started');
    };

    if (!rootDir) {
        return <div>Please set the root directory above.</div>;
    }

    return (
        <div>
            <h2>File Trees</h2>
            <div style={{ marginBottom: '1rem' }}>
                <button onClick={handleSaveDirectoryStructure}>Save to file_trees_{type}.txt</button>
                <label style={{ marginLeft: '10px' }}>
                    <input 
                        type="checkbox" 
                        checked={addToContext} 
                        onChange={(e) => handleAddToContextChange(e.target.checked)}
                    /> Add to context
                </label>
            </div>
            <h4>File Trees (Preview)</h4>
            <pre style={{ 
                maxHeight: '200px', 
                overflow: 'auto', 
                padding: '1rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px'
            }}>{directoryTree}</pre>
        </div>
    );
};

export default DirectoryView;