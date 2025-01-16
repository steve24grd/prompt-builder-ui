import React, { useState } from 'react';

interface Props {
    rootDir: string;
    onRootDirChange: (newDir: string) => void;
}

const DirectorySelector: React.FC<Props> = ({ rootDir, onRootDirChange }) => {
    const [inputValue, setInputValue] = useState(rootDir);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSubmit = () => {
        onRootDirChange(inputValue);
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