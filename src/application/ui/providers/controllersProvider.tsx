import React, { createContext, useContext } from 'react';
import type { AppControllers } from './appControllers';

const ControllersContext = createContext<AppControllers | null>(null);

export type ControllersProviderProps = {
  controllers: AppControllers;
  children: React.ReactNode;
};

export function ControllersProvider (params: ControllersProviderProps) {
  const { controllers, children } = params;

  return (
    <ControllersContext.Provider value={controllers}>
      {children}
    </ControllersContext.Provider>
  );
}

export function useControllers (): AppControllers {
  const controllers = useContext(ControllersContext);

  if (controllers === null) {
    throw new Error('useControllers must be used within a ControllersProvider');
  }

  return controllers;
}
