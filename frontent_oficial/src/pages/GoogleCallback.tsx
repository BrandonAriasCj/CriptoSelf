import React, { useEffect } from 'react';

export const GoogleCallback: React.FC = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      // Enviar mensaje de error al padre
      window.opener?.postMessage({
        type: 'google-auth-error',
        error,
      }, window.location.origin);
    } else if (code) {
      // Enviar código al padre
      window.opener?.postMessage({
        type: 'google-auth-success',
        code,
      }, window.location.origin);
    }

    // Cerrar la ventana
    window.close();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-secondary-adaptive">Procesando autenticación con Google...</p>
      </div>
    </div>
  );
};