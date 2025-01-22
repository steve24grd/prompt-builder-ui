import React, { useState } from 'react';
import { useRootDirectories } from '../context/RootDirectoriesContext';

const DirectorySelector: React.FC = () => {
  // Now we consume from context
  const { rootDir, setRootDir } = useRootDirectories();
  const [inputValue, setInputValue] = useState(rootDir);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    setRootDir(inputValue);
  };

  return (
    <div>
      <label>Select Repository Root:</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter absolute path..."
        style={{ width: '300px', marginLeft: '10px' }}
      />
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
        Set Root
      </button>
    </div>
  );
};

export default DirectorySelector;