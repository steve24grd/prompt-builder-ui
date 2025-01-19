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

    const handleSaveToFile = () => {
        if (!output) {
            alert('Please retrieve content first before saving.');
            return;
        }

        const file = new Blob([output], { type: 'text/plain' });
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = 'extract.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(element.href);
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
            <div style={{ marginTop: '1rem' }}>
                <button onClick={handleRetrieve} style={{ marginRight: '1rem' }}>Retrieve</button>
                <button onClick={handleSaveToFile}>Save to extract.txt</button>
            </div>

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