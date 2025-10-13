import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { healthService } from '../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [apiHealth, setApiHealth] = useState<{ status: string; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const health = await healthService.checkHealth();
      setApiHealth(health);
    } catch (error) {
      console.error('Error checking API health:', error);
      setApiHealth({ status: 'error', message: 'No se pudo conectar con la API' });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1>¡Bienvenido, {user?.display_name}! 👋</h1>
        <p>Has iniciado sesión exitosamente en tu dashboard.</p>
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h3>📊 Estado de la API</h3>
          {apiHealth && (
            <div className={`alert ${apiHealth.status === 'ok' ? 'alert-success' : 'alert-error'}`}>
              <strong>Estado:</strong> {apiHealth.status}<br />
              <strong>Mensaje:</strong> {apiHealth.message}
            </div>
          )}
        </div>

        <div className="card">
          <h3>👤 Información del Usuario</h3>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Usuario:</strong> {user?.username}</p>
          <p><strong>Verificado:</strong> {user?.is_verified ? '✅ Sí' : '❌ No'}</p>
          <p><strong>Email verificado:</strong> {user?.email_verified ? '✅ Sí' : '❌ No'}</p>
          <p><strong>Miembro desde:</strong> {user?.date_joined ? new Date(user.date_joined).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>

      <div className="grid grid-3">
        <div className="card">
          <h3>📈 Backtesting</h3>
          <p>Ejecuta estrategias de trading y analiza resultados.</p>
          <a href="/backtesting" className="btn btn-primary">
            Ir a Backtesting
          </a>
        </div>

        <div className="card">
          <h3>📝 Gestión de Tareas</h3>
          <p>Administra tus tareas y proyectos.</p>
          <a href="/tasks" className="btn btn-primary">
            Ver Tareas
          </a>
        </div>

        <div className="card">
          <h3>⚙️ Perfil</h3>
          <p>Actualiza tu información personal y configuración.</p>
          <a href="/profile" className="btn btn-primary">
            Editar Perfil
          </a>
        </div>
      </div>

      <div className="card">
        <h3>🚀 Funcionalidades Disponibles</h3>
        <div className="grid grid-2">
          <div>
            <h4>✅ Implementado:</h4>
            <ul>
              <li>Autenticación OAuth2</li>
              <li>Registro y login tradicional</li>
              <li>Autenticación social (Google, GitHub)</li>
              <li>Gestión de perfiles de usuario</li>
              <li>Sistema de backtesting</li>
              <li>CRUD de tareas</li>
              <li>Panel de administración</li>
            </ul>
          </div>
          <div>
            <h4>🔧 Configuración:</h4>
            <ul>
              <li>Base de datos SQLite</li>
              <li>Django REST Framework</li>
              <li>React con TypeScript</li>
              <li>Proxy integrado (sin CORS)</li>
              <li>Tokens JWT con scopes</li>
              <li>Middleware de autenticación</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;