import React, { useEffect, useState } from 'react';

interface Props {
    rootDir: string;
}

const DirectoryView: React.FC<Props> = ({ rootDir }) => {
    const [directoryTree, setDirectoryTree] = useState('');

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

    if (!rootDir) {
        return <div>Please set the root directory above.</div>;
    }

    return (
        <div>
            <h2>Directory Structure</h2>
            <pre>{directoryTree}</pre>
        </div>
    );
};

export default DirectoryView;