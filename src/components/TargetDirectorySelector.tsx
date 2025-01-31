import React, { useState } from 'react';
import { useRootDirectories } from '../context/RootDirectoriesContext';

const TargetDirectorySelector: React.FC = () => {
  const { targetDir, setTargetDir } = useRootDirectories();
  const [inputValue, setInputValue] = useState(targetDir);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = () => {
    setTargetDir(inputValue);
  };

  return (
    <div>
      <label>Select Target Repository Root:</label>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter absolute path..."
        style={{ width: '300px', marginLeft: '10px' }}
      />
      <button onClick={handleSubmit} style={{ marginLeft: '10px' }}>
        Set Target Root
      </button>
    </div>
  );
};

export default TargetDirectorySelector;