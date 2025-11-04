import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell,
  Shield,
  Smartphone,
  Mail,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [maxPositions, setMaxPositions] = useState('5');
  const [stopLoss, setStopLoss] = useState('2');

  const handleSave = () => {
    toast.success('Configuración guardada exitosamente');
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card className="bg-gradient-to-r from-gray-900/20 to-slate-900/20 border-gray-500/30">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Configuración</CardTitle>
              <p className="text-muted-foreground">Personaliza tu experiencia de trading</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Cuenta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nombre de Usuario</Label>
              <Input
                defaultValue="CriptoTrader"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                defaultValue="trader@example.com"
                type="email"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Zona Horaria</Label>
              <Select defaultValue="america/mexico">
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="america/mexico">México (GMT-6)</SelectItem>
                  <SelectItem value="america/newyork">Nueva York (GMT-5)</SelectItem>
                  <SelectItem value="europe/london">Londres (GMT+0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Notificaciones Push</Label>
                <p className="text-sm text-muted-foreground">Recibe alertas en tiempo real</p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Resumen diario por email</p>
              </div>
              <Switch
                checked={emailAlerts}
                onCheckedChange={setEmailAlerts}
              />
            </div>
          </CardContent>
        </Card>

        {/* Risk Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Gestión de Riesgo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nivel de Riesgo</Label>
              <Select value={riskLevel} onValueChange={setRiskLevel}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bajo - Conservador</SelectItem>
                  <SelectItem value="medium">Medio - Balanceado</SelectItem>
                  <SelectItem value="high">Alto - Agresivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Stop Loss por Defecto (%)</Label>
              <Input
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                type="number"
                step="0.5"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Máximo de Posiciones</Label>
              <Input
                value={maxPositions}
                onChange={(e) => setMaxPositions(e.target.value)}
                type="number"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* Trading Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Trading
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Capital Inicial</Label>
              <Input
                defaultValue="10000"
                type="number"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Comisión (%)</Label>
              <Input
                defaultValue="0.1"
                type="number"
                step="0.01"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Slippage (%)</Label>
              <Input
                defaultValue="0.05"
                type="number"
                step="0.01"
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Configuración de API</CardTitle>
          <p className="text-muted-foreground">Conecta tu exchange para trading en vivo</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>API Key</Label>
              <Input
                placeholder="Tu API Key"
                type="password"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Secret Key</Label>
              <Input
                placeholder="Tu Secret Key"
                type="password"
                className="mt-1"
              />
            </div>
          </div>
          <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              ⚠️ <strong>Importante:</strong> Solo usa API keys con permisos de trading limitados. 
              Nunca compartas tus claves privadas.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Guardar Configuración
        </Button>
      </div>
    </div>
  );
}