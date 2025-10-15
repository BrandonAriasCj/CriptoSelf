import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Edit,
  Camera
} from 'lucide-react';

const userStats = {
  totalTrades: 234,
  winRate: 68.5,
  totalProfit: 12547.80,
  activeStrategies: 3,
  experienceLevel: 'Intermedio',
  memberSince: 'Enero 2024'
};

export function MyProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    name: 'Juan Carlos Pérez',
    email: 'juan.perez@email.com',
    phone: '+1 (555) 123-4567',
    riskTolerance: 'Medio',
    tradingExperience: '2 años'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Aquí se guardarían los cambios
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Profile Header */}
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-emerald-500/20">
                <AvatarImage src="" alt="Profile" />
                <AvatarFallback className="bg-emerald-600 text-white text-xl">
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="outline"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-gray-800 border-gray-600"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">{userInfo.name}</h2>
                  <p className="text-gray-400">{userInfo.email}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400">
                      {userStats.experienceLevel}
                    </Badge>
                    <span className="text-sm text-gray-400">
                      Miembro desde {userStats.memberSince}
                    </span>
                  </div>
                </div>
                
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "default" : "outline"}
                  className="self-start"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancelar' : 'Editar Perfil'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="w-5 h-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Nombre Completo</Label>
                    <Input
                      value={userInfo.name}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Email</Label>
                    <Input
                      value={userInfo.email}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Teléfono</Label>
                    <Input
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-white">Tolerancia al Riesgo</Label>
                    <select 
                      className="w-full p-2 bg-gray-800 border border-gray-600 rounded-md text-white"
                      value={userInfo.riskTolerance}
                      onChange={(e) => setUserInfo(prev => ({ ...prev, riskTolerance: e.target.value }))}
                    >
                      <option value="Bajo">Bajo</option>
                      <option value="Medio">Medio</option>
                      <option value="Alto">Alto</option>
                    </select>
                  </div>
                  <Button onClick={handleSave} className="w-full">
                    Guardar Cambios
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="text-white">{userInfo.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Teléfono</p>
                      <p className="text-white">{userInfo.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Target className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Tolerancia al Riesgo</p>
                      <p className="text-white">{userInfo.riskTolerance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-400">Experiencia en Trading</p>
                      <p className="text-white">{userInfo.tradingExperience}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Trading Statistics */}
        <div>
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <TrendingUp className="w-5 h-5" />
                Estadísticas de Trading
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Beneficio Total</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-xl font-bold text-emerald-400">
                  +${userStats.totalProfit.toLocaleString()}
                </p>
              </div>

              <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Tasa de Acierto</span>
                  <Target className="w-4 h-4 text-blue-400" />
                </div>
                <p className="text-xl font-bold text-blue-400">{userStats.winRate}%</p>
                <Progress value={userStats.winRate} className="mt-2 h-2" />
              </div>

              <div className="p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Total de Trades</span>
                  <Zap className="w-4 h-4 text-purple-400" />
                </div>
                <p className="text-xl font-bold text-purple-400">{userStats.totalTrades}</p>
              </div>

              <div className="p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Estrategias Activas</span>
                  <TrendingUp className="w-4 h-4 text-orange-400" />
                </div>
                <p className="text-xl font-bold text-orange-400">{userStats.activeStrategies}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Account Security */}
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Seguridad de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Cambiar Contraseña
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Autenticación 2FA
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Sesiones Activas
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Historial de Acceso
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}