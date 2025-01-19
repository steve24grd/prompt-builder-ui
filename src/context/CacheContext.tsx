import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CacheContextType {
    cachedFileTrees: string;
    setCachedFileTrees: (content: string) => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export function CacheProvider({ children }: { children: ReactNode }) {
    const [cachedFileTrees, setCachedFileTrees] = useState('');

    return (
        <CacheContext.Provider value={{ cachedFileTrees, setCachedFileTrees }}>
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
