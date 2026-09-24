/// <reference types="web" />
import React, { useCallback, useEffect, useState } from 'react';
import { alertBus } from '@application/alerts';
import { AlertUseCaseParams } from '@domain/use-cases';
import { WebAlertModal } from '../webAlertModal';

export type WebAlertProviderProps = {
    children: React.ReactNode;
};

export function WebAlertProvider (params: WebAlertProviderProps) {
  const { children } = params;
  const [queue, setQueue] = useState<AlertUseCaseParams[]>([]);
  const currentAlert = queue[0];

  const removeCurrentAlert = useCallback(() => {
    setQueue((previous) => previous.slice(1));
  }, []);

  useEffect(() => {
    if (currentAlert === undefined) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        removeCurrentAlert();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [currentAlert, removeCurrentAlert]);

  useEffect(() => {
    return alertBus.subscribe((alertParams) => {
      setQueue((previous) => [...previous, alertParams]);
    });
  }, []);

  return (
    <>
      {children}
      {currentAlert !== undefined && (
        <WebAlertModal
          title={currentAlert.title}
          message={currentAlert.message}
          onConfirm={removeCurrentAlert}
        />
      )}
    </>
  );
}
