import { useContext } from 'react';
import { RegistrationsContext } from './RegistrationsContext';

export const useRegistrations = () => {
  const context = useContext(RegistrationsContext);

  if (!context) {
    throw new Error(
      'useRegistrations must be used within an RegistrationsProvider'
    );
  }

  return context;
};
