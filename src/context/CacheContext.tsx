import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CacheContextType {
    cachedSourceFileTrees: string;
    cachedTargetFileTrees: string;
    retrievedFiles: string;
    customInstructions: string;
    specs: string;
    setCachedSourceFileTrees: (content: string) => void;
    setCachedTargetFileTrees: (content: string) => void;
    setRetrievedFiles: (content: string) => void;
    setCustomInstructions: (content: string) => void;
    setSpecs: (content: string) => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export function CacheProvider({ children }: { children: ReactNode }) {
    const [cachedSourceFileTrees, setCachedSourceFileTrees] = useState('');
    const [cachedTargetFileTrees, setCachedTargetFileTrees] = useState('');
    const [retrievedFiles, setRetrievedFiles] = useState('');
    const [customInstructions, setCustomInstructions] = useState('');
    const [specs, setSpecs] = useState('');

    return (
        <CacheContext.Provider value={{ 
            cachedSourceFileTrees, 
            setCachedSourceFileTrees,
            cachedTargetFileTrees, 
            setCachedTargetFileTrees,
            retrievedFiles,
            setRetrievedFiles,
            customInstructions,
            setCustomInstructions,
            specs,
            setSpecs
        }}>
            {children}
        </CacheContext.Provider>
    );
}

export function useCacheContext() {
    const context = useContext(CacheContext);
    if (context === undefined) {
        throw new Error('useCacheContext must be used within a CacheProvider');
    }
    return context;
}
