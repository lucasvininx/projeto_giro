"use client";

import { useState, useEffect } from "react";
import {
  Bell,
  Home,
  Users,
  Inbox,
  BarChart3,
  Calendar,
  Search,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [progressValues, setProgressValues] = useState([60, 30, 100]); // valores de progresso das operações

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Calendar, label: "Minhas Operações" },
    { icon: BarChart3, label: "Desempenho" },
    { icon: Inbox, label: "Inbox" },
    { icon: Users, label: "Parceiros" },
    { icon: BarChart3, label: "Metas" },
  ];

  const handleLogout = () => {
    router.push("login");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card p-4">
        <div className="space-y-6">
          {navItems.map((item, index) => (
            <button
              key={index}
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                item.active ? "bg-primary text-primary-foreground" : "hover:bg-accent"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Olá, Tiago Cazarotto</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Bell />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center">
                <DropdownMenuLabel>Notificações</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Editar Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="/img/tiago.cazarotto.jpg" />
                  <AvatarFallback>TC</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4 cursor-pointer" />
                  <span className="cursor-pointer">Editar Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4 cursor-pointer" />
                  <span className="cursor-pointer">Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4 cursor-pointer" />
                  <span className="cursor-pointer">Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">Suas operações atuais são:</h2>
            <p className="text-4xl font-bold text-primary">10</p>
          </div>
          <div className="bg-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">Sua meta é:</h2>
            <p className="text-4xl font-bold text-primary">20</p>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {progressValues.map((progress, index) => (
            <div key={index} className="p-6 rounded-xl border border-gray-300">
              <h3 className="text-xl font-semibold mb-4">Operação {index + 1}</h3>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <p className="text-muted-foreground"> {progress === 100 ? "Concluído" : "Em Progresso"}</p>
                  <Progress value={progress} />
                </div>
                <div className="text-right">
                  <p className="text-primary font-bold">{progress}%</p>
                  <p className="text-sm text-muted-foreground">Completo</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
