import React, { useState } from 'react';

interface Props {
    rootDir: string;
}

const RetrieveBox: React.FC<Props> = ({ rootDir }) => {
    const [pathsText, setPathsText] = useState('');
    const [output, setOutput] = useState('');

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

    return (
        <div>
            <h2>Retrieve Files</h2>
            <textarea
                rows={5}
                cols={50}
                value={pathsText}
                onChange={e => setPathsText(e.target.value)}
                placeholder="Enter one file path per line..."
            />
            <br />
            <button onClick={handleRetrieve}>Retrieve & Append to extract.txt</button>

            {output && (
                <div style={{ marginTop: '1rem' }}>
                    <h4>Output (preview)</h4>
                    <pre>{output}</pre>
                </div>
            )}
        </div>
    );
};

export default RetrieveBox;