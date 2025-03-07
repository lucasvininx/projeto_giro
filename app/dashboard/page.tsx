"use client";


import { useState, useEffect } from "react";
import {
  Bell,
  Home,
  Users,
  BarChart3,
  Calendar,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  X,
  ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";


type Notification = {
  id: number;
  message: string;
  read: boolean;
};

const notifications: Notification[] = [];
 // Nenhuma notificação no momento


// Interface para as operações
interface Operation {
  _id: string;
  name: string;
  progress: number;
  status: "completed" | "in_progress";
  value: number;
  image: string;
  address: string;
  client: string;
}


export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userData, setUserData] = useState({ name: "", image: "", email: "" });
  const [operations, setOperations] = useState<Operation[]>([]);
  const [totalValue, setTotalValue] = useState(0);
  const [targetValue, setTargetValue] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null
  );
  const { data: session, status } = useSession();


  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);


  // Modificar a função fetchDashboardData para buscar os dados do usuário
  const fetchDashboardData = async () => {
    try {
      const [userResponse, operationsResponse] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/operations"),
      ]);


      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUserData(userData);
      } else {
        console.error("Failed to fetch user data");
      }


      if (operationsResponse.ok) {
        const operationsData = await operationsResponse.json();
        setOperations(operationsData.operations || []);
        setTotalValue(operationsData.totalValue || 0);
        setTargetValue(operationsData.targetValue || 0);
      } else {
        console.error("Failed to fetch operations data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };


  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Calendar, label: "Minhas Operações" },
    { icon: BarChart3, label: "Desempenho" },
    { icon: Users, label: "Parceiros" },
  ];


  const handleNavigation = (label: string) => {
    if (label === "Desempenho") {
      router.push("/desempenho");
    } else if (label === "Minhas Operações") {
      router.push("/minhas-operacoes");
    }
  };


  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };


  const openOperationDetails = (operation: Operation) => {
    setSelectedOperation(operation);
  };


  const closeOperationDetails = () => {
    setSelectedOperation(null);
  };


  const closeImage = () => {
    setSelectedImage(null);
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
              onClick={() => handleNavigation(item.label)}
              className={`flex items-center space-x-3 w-full p-2 rounded-lg transition-colors ${
                item.active
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-orange-500 hover:text-white"
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
          <h1 className="text-3xl font-bold">
            Olá, {userData?.name || session?.user?.name || "Usuário"}
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
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
                  <div className="p-4 text-sm text-muted-foreground">
                    Não há novas atualizações
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>


            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={userData?.image || "/placeholder.svg"} />
                  <AvatarFallback>
                    {userData?.name ? userData.name.charAt(0) : "U"}
                  </AvatarFallback>
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
            <h2 className="text-xl font-semibold mb-2">
              Suas operações atuais são:
            </h2>
            <p className="text-4xl font-bold text-primary">
              {operations.length}
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">
              e seu faturamento é de:
            </h2>
            <p className="text-4xl font-bold text-primary">
              R$ {totalValue.toLocaleString()}
            </p>
          </div>
          <div className="bg-card p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-2">Sua meta é:</h2>
            <p className="text-4xl font-bold text-primary">
              {operations.length + 5}
            </p>
            <h2 className="text-xl font-semibold mt-4 mb-2">
              Faturamento meta:
            </h2>
            <p className="text-4xl font-bold text-primary">
              R$ {targetValue.toLocaleString()}
            </p>
          </div>
        </div>


        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operations.map((operation) => (
            <div
              key={operation._id}
              className="p-6 rounded-xl border border-gray-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{operation.name}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openOperationDetails(operation)}
                  className="hover:bg-accent"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="mb-4">
                <p className="text-sm text-muted-foreground">
                  {operation.address}
                </p>
                <p className="text-sm font-medium">
                  Cliente: {operation.client}
                </p>
                <p className="text-sm font-medium">
                  Valor: R$ {operation.value.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-2 flex-1">
                  <p className="text-muted-foreground">
                    {operation.status === "completed"
                      ? "Concluído"
                      : "Em Progresso"}
                  </p>
                  <Progress value={operation.progress} />
                </div>
                <div className="text-right ml-4">
                  <p className="text-primary font-bold">
                    {operation.progress}%
                  </p>
                  <p className="text-sm text-muted-foreground">Completo</p>
                </div>
              </div>
            </div>
          ))}
        </div>


        {/* Operation Details Modal */}
        {selectedOperation && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={closeOperationDetails}
              >
                <X className="h-6 w-6" />
              </Button>
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">
                  {selectedOperation.name}
                </h2>
                <div className="aspect-video relative mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={selectedOperation.image || "/placeholder.svg"}
                    alt={selectedOperation.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Endereço</p>
                    <p className="font-medium">{selectedOperation.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-medium">{selectedOperation.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Valor</p>
                    <p className="font-medium">
                      R$ {selectedOperation.value.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <p className="font-medium">
                      {selectedOperation.status === "completed"
                        ? "Concluído"
                        : "Em Progresso"}
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Progresso
                  </p>
                  <Progress
                    value={selectedOperation.progress}
                    className="h-2"
                  />
                  <p className="text-right mt-1 text-sm font-medium">
                    {selectedOperation.progress}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* Edit Profile Modal */}
        {showEditProfile && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-card p-6 rounded-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue={userData.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userData.email}
                  />
                </div>
                <Button type="submit">Salvar Alterações</Button>
              </form>
              <Button
                onClick={() => setShowEditProfile(false)}
                variant="outline"
                className="mt-4"
              >
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
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Versão do Sistema Giro Capital: 1.0.0
              </p>
              <Button
                onClick={() => setShowSettings(false)}
                variant="outline"
                className="mt-4"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}


        {/* Full Screen Image Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
            <div className="relative max-w-4xl max-h-full">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white"
                onClick={closeImage}
              >
                <X className="h-6 w-6" />
              </Button>
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Imagem da operação"
                className="max-w-full max-h-[90vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
