"use client"

import { useState, useEffect } from "react"
import { Bell, Home, Users, Inbox, BarChart3, Calendar, Sun, Moon, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

const notifications = [] // Nenhuma notificação no momento

export default function DashboardPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const [progressValues, setProgressValues] = useState([60, 30, 100]) // valores de progresso das operações
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Calendar, label: "Minhas Operações", href: "/minhas-operacoes" },
    { icon: BarChart3, label: "Desempenho" },
    { icon: Inbox, label: "Inbox" },
    { icon: Users, label: "Parceiros" },
    { icon: BarChart3, label: "Metas" },
  ]

  const handleNavigation = (href: string | undefined) => {
    if (href) {
      router.push(href) // Redireciona para a rota definida
    }
  }

  const handleLogout = () => {
    router.push("login")
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-card p-4">
        <div className="space-y-6">
          {navItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.href)} // Redireciona para o href
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                item.active ? "bg-primary text-primary-foreground" : "hover:bg-orange-500 hover:text-white"
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
                {notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <DropdownMenuItem key={index}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{notification.message}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">Não há novas atualizações</div>
                )}
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
                <DropdownMenuItem onSelect={() => setShowEditProfile(true)}>
                  <User className="mr-2 h-4 w-4 cursor-pointer" />
                  <span className="cursor-pointer">Editar Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setShowSettings(true)}>
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
                  <p className="text-muted-foreground">{progress === 100 ? "Concluído" : "Em Progresso"}</p>
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

        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue="Tiago Cazarotto" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="tiago@example.com" />
                </div>
                <Button type="submit">Salvar Alterações</Button>
              </form>
              <Button onClick={() => setShowEditProfile(false)} variant="outline" className="mt-4">
                Fechar
              </Button>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Configurações</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Notificações</Label>
                  <Switch id="notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">Modo Escuro</Label>
                  <Switch
                    id="darkMode"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">Versão do Sistema Giro Capital: 1.0.0</p>
              <Button onClick={() => setShowSettings(false)} variant="outline" className="mt-4">
                Fechar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

