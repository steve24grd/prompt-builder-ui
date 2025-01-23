import React, { useState, ChangeEvent } from 'react';
import { useCacheContext } from '../context/CacheContext';
import { useRootDirectories } from '../context/RootDirectoriesContext';

const CustomInstructionBox: React.FC = () => {
  const { rootDir } = useRootDirectories();
  const [instructionType, setInstructionType] = useState<'file' | 'new'>('new');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [addToContext, setAddToContext] = useState(false);
  const { 
    cachedSourceFileTrees, 
    setCachedSourceFileTrees,
    cachedTargetFileTrees,
    setCachedTargetFileTrees,
    customInstructions,
    setCustomInstructions
  } = useCacheContext();

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const content = await file.text();
      setFileContent(content);
    }
  };

  const handleSaveInstruction = async () => {
    if (!rootDir) {
      alert('Please set the root directory first.');
      return;
    }

    try {
      if ('showSaveFilePicker' in window) {
        const handle = await window.showSaveFilePicker({
          suggestedName: 'custom_instructions.txt',
          types: [{
            description: 'Text Files',
            accept: { 'text/plain': ['.txt'] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(newInstruction);
        await writable.close();
        alert('Successfully saved custom instructions');
      } else {
        // Fallback for browsers that don't support File System Access API
        const blob = new Blob([newInstruction], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'custom_instructions.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to save custom instructions');
    }
  };

  const handleAddToContextChange = (checked: boolean) => {
    setAddToContext(checked);
    const content = instructionType === 'file' ? fileContent : newInstruction;
    
    if (checked && content) {
      setCustomInstructions(content);
    } else if (!checked) {
      setCustomInstructions('');
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Custom Instruction</h2>
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '1rem' }}>
          <input
            type="radio"
            value="file"
            checked={instructionType === 'file'}
            onChange={(e) => setInstructionType('file')}
          /> From File
        </label>
        <label>
          <input
            type="radio"
            value="new"
            checked={instructionType === 'new'}
            onChange={(e) => setInstructionType('new')}
          /> New Instruction
        </label>
      </div>

      {instructionType === 'file' && (
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="file"
            accept=".txt"
            onChange={handleFileSelect}
            style={{ marginRight: '1rem' }}
          />
          {selectedFile && (
            <div style={{ marginTop: '1rem' }}>
              <h4>Custom Instruction (Preview)</h4>
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

      {instructionType === 'new' && (
        <div>
          <textarea
            rows={10}
            cols={50}
            value={newInstruction}
            onChange={(e) => setNewInstruction(e.target.value)}
            placeholder="Type your custom instruction here..."
            style={{ marginBottom: '1rem', width: '100%' }}
          />
          <button onClick={handleSaveInstruction}>
            Save to custom_instructions.txt
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

export default CustomInstructionBox;
