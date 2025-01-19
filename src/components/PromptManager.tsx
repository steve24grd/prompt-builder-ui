import React, { useState, useEffect } from 'react';
import { useCacheContext } from '../context/CacheContext';

interface Props {
    rootDir: string;
}

const PromptManager: React.FC<Props> = ({ rootDir }) => {
    const [files, setFiles] = useState('');
    const [tokenCount, setTokenCount] = useState(0);
    const { cachedFileTrees } = useCacheContext();

    useEffect(() => {
        // Removed updateCachedFileTrees(rootDir) as it's not used in the provided code edit
    }, [rootDir]);

    const handleAppend = () => {
        if (!rootDir) {
            alert('Please set the root directory first.');
            return;
        }
        const fileArr = files
            .split('\n')
            .map(f => f.trim())
            .filter(Boolean);

        fetch('http://localhost:4000/api/append-to-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rootDir, files: fileArr }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.totalTokens !== undefined) {
                    setTokenCount(data.totalTokens);
                } else if (data.error) {
                    alert(`Error: ${data.error}`);
                }
            })
            .catch(err => {
                console.error(err);
                alert(`Failed to append: ${err.message}`);
            });
    };

    const handleRefreshCount = () => {
        if (!rootDir) return;
        fetch('http://localhost:4000/api/prompt-token-count', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rootDir }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.tokenCount !== undefined) {
                    setTokenCount(data.tokenCount);
                } else if (data.error) {
                    alert(`Error: ${data.error}`);
                }
            })
            .catch(err => {
                console.error(err);
                alert(`Failed to get token count: ${err.message}`);
            });
    };

    return (
        <div>
            <h2>Prompt Manager</h2>

            <h3>Cached Context</h3>
            <div style={{ marginBottom: '20px' }}>
                {cachedFileTrees ? (
                    <pre style={{ 
                        maxHeight: '200px', 
                        overflow: 'auto', 
                        backgroundColor: '#f5f5f5', 
                        padding: '10px',
                        marginBottom: '20px',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                    }}>
                        {cachedFileTrees}
                    </pre>
                ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No cached content</p>
                )}
            </div>

            <p>Enter files to append to prompt.txt (one per line)</p>
            <textarea
                rows={5}
                cols={50}
                value={files}
                onChange={e => setFiles(e.target.value)}
                placeholder="file1.js
file2.ts
src/components/Hello.tsx
"
            />
            <br />
            <button onClick={handleAppend}>Append to Prompt</button>
            <button style={{ marginLeft: '10px' }} onClick={handleRefreshCount}>
                Refresh Token Count
            </button>
            <div style={{ marginTop: '10px' }}>
                <strong>Total Tokens in prompt.txt: {tokenCount}</strong>
            </div>
        </div>
    );
};

export default PromptManager;