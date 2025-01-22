import React, { useState, useEffect } from 'react';
import { useCacheContext } from '../context/CacheContext';

interface Props {
    rootDir: string;
}

const PromptManager: React.FC<Props> = ({ rootDir }) => {
    const [cachedContent, setCachedContent] = useState('');
    const [composition, setComposition] = useState('');
    const [tokenCount, setTokenCount] = useState(0);
    const [previewContent, setPreviewContent] = useState('');
    const { 
        cachedSourceFileTrees,
        cachedTargetFileTrees,
        retrievedFiles
    } = useCacheContext();

    useEffect(() => {
        // Remove combined trees effect since we'll handle source and target separately
        setCachedContent('');
    }, [rootDir]);

    const replaceFileTrees = (prompt: string): string => {
        let result = prompt;
        
        // Replace <file_trees_source> with source trees
        if (result.includes('<file_trees_source>')) {
            result = result.replace(/<file_trees_source>/g, cachedSourceFileTrees || '');
        }
        
        // Replace <file_trees_target> with target trees
        if (result.includes('<file_trees_target>')) {
            result = result.replace(/<file_trees_target>/g, cachedTargetFileTrees || '');
        }
        
        return result;
    };

    useEffect(() => {
        let reconstructedPrompt = composition;
            
        // Replace file trees tags
        reconstructedPrompt = replaceFileTrees(reconstructedPrompt);

        // Replace <retrieved_files> with cached retrieved files
        if (reconstructedPrompt.includes('<retrieved_files>')) {
            reconstructedPrompt = reconstructedPrompt.replace(/<retrieved_files>/g, retrievedFiles || '');
        }

        // Replace <custom_instructions> with cached custom instructions
        if (reconstructedPrompt.includes('<custom_instructions>')) {
            const customInstructions = localStorage.getItem('customInstructions') || '';
            reconstructedPrompt = reconstructedPrompt.replace(/<custom_instructions>/g, customInstructions);
        }

        // Replace <specs> with cached specs
        if (reconstructedPrompt.includes('<specs>')) {
            const specs = localStorage.getItem('specs') || '';
            reconstructedPrompt = reconstructedPrompt.replace(/<specs>/g, specs);
        }

        setPreviewContent(reconstructedPrompt);
    }, [composition, cachedSourceFileTrees, cachedTargetFileTrees, retrievedFiles]);

    const handleAppend = async () => {
        if (!rootDir) {
            alert('Please set the root directory first.');
            return;
        }

        try {
            // Reconstruct prompt by replacing tags with cached content
            let reconstructedPrompt = composition;
            
            // Replace file trees tags
            reconstructedPrompt = replaceFileTrees(reconstructedPrompt);

            // Replace <retrieved_files> with cached retrieved files
            if (reconstructedPrompt.includes('<retrieved_files>')) {
                reconstructedPrompt = reconstructedPrompt.replace(/<retrieved_files>/g, retrievedFiles || '');
            }

            // Replace <custom_instructions> with cached custom instructions
            if (reconstructedPrompt.includes('<custom_instructions>')) {
                const customInstructions = localStorage.getItem('customInstructions') || '';
                reconstructedPrompt = reconstructedPrompt.replace(/<custom_instructions>/g, customInstructions);
            }

            // Replace <specs> with cached specs
            if (reconstructedPrompt.includes('<specs>')) {
                const specs = localStorage.getItem('specs') || '';
                reconstructedPrompt = reconstructedPrompt.replace(/<specs>/g, specs);
            }

            // Save using File System Access API
            if ('showSaveFilePicker' in window) {
                const handle = await window.showSaveFilePicker({
                    suggestedName: 'prompt.txt',
                    types: [{
                        description: 'Text Files',
                        accept: { 'text/plain': ['.txt'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(reconstructedPrompt);
                await writable.close();
                alert('Successfully saved prompt.txt');
            } else {
                // Fallback for browsers that don't support File System Access API
                const blob = new Blob([reconstructedPrompt], { type: 'text/plain;charset=utf-8' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'prompt.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }
        } catch (err) {
            console.error(err);
            alert(`Failed to save prompt: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
        }
    };

    const handleRefreshCount = () => {
        if (!rootDir) {
            alert('Please set the root directory first using the "Set Root" button at the top of the page.');
            return;
        }

        try {
            // Reconstruct prompt by replacing tags with cached content
            let reconstructedPrompt = composition;
            
            // Replace file trees tags
            reconstructedPrompt = replaceFileTrees(reconstructedPrompt);

            // Replace <retrieved_files> with cached retrieved files
            if (reconstructedPrompt.includes('<retrieved_files>')) {
                reconstructedPrompt = reconstructedPrompt.replace(/<retrieved_files>/g, retrievedFiles || '');
            }

            // Replace <custom_instructions> with cached custom instructions
            if (reconstructedPrompt.includes('<custom_instructions>')) {
                const customInstructions = localStorage.getItem('customInstructions') || '';
                reconstructedPrompt = reconstructedPrompt.replace(/<custom_instructions>/g, customInstructions);
            }

            // Replace <specs> with cached specs
            if (reconstructedPrompt.includes('<specs>')) {
                const specs = localStorage.getItem('specs') || '';
                reconstructedPrompt = reconstructedPrompt.replace(/<specs>/g, specs);
            }

            fetch('http://localhost:4000/api/prompt-token-count', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: reconstructedPrompt }),
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
        } catch (err) {
            console.error(err);
            alert(`Failed to get token count: ${err instanceof Error ? err.message : 'Unknown error occurred'}`);
        }
    };

    return (
        <div>
            <h2>Prompt Manager</h2>

            <h3>Cached Context</h3>
            <div style={{ marginBottom: '20px' }}>
                {cachedSourceFileTrees || cachedTargetFileTrees ? (
                    <pre style={{ 
                        maxHeight: '200px', 
                        overflow: 'auto', 
                        backgroundColor: '#f5f5f5', 
                        padding: '10px',
                        marginBottom: '20px',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word'
                    }}>
                        {cachedSourceFileTrees}
                        {cachedTargetFileTrees && <br />}
                        {cachedTargetFileTrees}
                    </pre>
                ) : (
                    <p style={{ color: '#666', fontStyle: 'italic' }}>No cached content</p>
                )}
            </div>

            <p>Compose your prompt here by including <b>{`<file_trees_source>, <file_trees_target>, <retrieved_files>, <custom_instructions>, and <specs>`}</b> to embed additional context</p>
            <textarea
                rows={5}
                cols={50}
                value={composition}
                onChange={e => setComposition(e.target.value)}
                placeholder="Example:
<file_trees_source>
<file_trees_target>
<retrieved_files>
<custom_instructions>
<specs>
"
            />
            <br />
            <button onClick={handleAppend}>Save to prompt.txt</button>
            <button style={{ marginLeft: '10px' }} onClick={handleRefreshCount}>
                Refresh Token Count
            </button>
            <div style={{ marginTop: '10px', paddingBottom: '20px' }}>
                <strong>Total Tokens in prompt.txt: {tokenCount}</strong>
            </div>

            <div style={{ marginTop: '20px' }}>
                <h3>Preview</h3>
                <pre style={{ 
                    maxHeight: '200px', 
                    overflow: 'auto', 
                    backgroundColor: '#f5f5f5', 
                    padding: '10px',
                    marginBottom: '20px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                }}>
                    {previewContent}
                </pre>
            </div>
        </div>
    );
};

export default PromptManager;