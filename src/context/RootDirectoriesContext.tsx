import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RootDirectoriesContextType {
  rootDir: string;
  targetDir: string;
  setRootDir: (newDir: string) => void;
  setTargetDir: (newDir: string) => void;
}

const RootDirectoriesContext = createContext<RootDirectoriesContextType | undefined>(undefined);

export function RootDirectoriesProvider({ children }: { children: ReactNode }) {
  const [rootDir, setRootDir] = useState('');
  const [targetDir, setTargetDir] = useState('');

  return (
    <RootDirectoriesContext.Provider value={{ rootDir, targetDir, setRootDir, setTargetDir }}>
      {children}
    </RootDirectoriesContext.Provider>
  );
}

export function useRootDirectories() {
  const context = useContext(RootDirectoriesContext);
  if (!context) {
    throw new Error('useRootDirectories must be used within a RootDirectoriesProvider');
  }
  return context;
}