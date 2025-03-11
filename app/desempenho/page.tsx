"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  PlusCircle,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTheme } from "next-themes";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Operation = {
  id: string;
  client: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "processing";
  clientEmail: string;
  employeeName: string;
};

type Employee = {
  name: string;
  image: string;
  operacoes: number;
  receita: number;
  parceiros: number;
  metas: Array<{
    name: string;
    value: number;
    target: number;
  }>;
};

const notifications = []; // Placeholder for notifications

const employeePerformanceData: Employee[] = [
  {
    name: "Você (Tiago Cazarotto)",
    image: "/img/tiago.cazarotto.png",
    operacoes: 20,
    receita: 400000,
    parceiros: 60,
    metas: [
      { name: "Operações", value: 20, target: 25 },
      { name: "Receita", value: 400000, target: 500000 },
      { name: "Parceiros", value: 60, target: 70 },
    ],
  },
  {
    name: "Rosane",
    image: "/avatars/rosane.png",
    operacoes: 15,
    receita: 300000,
    parceiros: 50,
    metas: [
      { name: "Operações", value: 15, target: 20 },
      { name: "Receita", value: 300000, target: 350000 },
      { name: "Parceiros", value: 50, target: 60 },
    ],
  },
  {
    name: "Felipe",
    image: "/avatars/felipe.png",
    operacoes: 12,
    receita: 250000,
    parceiros: 40,
    metas: [
      { name: "Operações", value: 12, target: 15 },
      { name: "Receita", value: 250000, target: 300000 },
      { name: "Parceiros", value: 40, target: 50 },
    ],
  },
  {
    name: "Júlio",
    image: "/avatars/julio.png",
    operacoes: 10,
    receita: 200000,
    parceiros: 30,
    metas: [
      { name: "Operações", value: 10, target: 12 },
      { name: "Receita", value: 200000, target: 250000 },
      { name: "Parceiros", value: 30, target: 40 },
    ],
  },
  {
    name: "Larissa",
    image: "/avatars/larissa.png",
    operacoes: 8,
    receita: 180000,
    parceiros: 25,
    metas: [
      { name: "Operações", value: 8, target: 10 },
      { name: "Receita", value: 180000, target: 200000 },
      { name: "Parceiros", value: 25, target: 30 },
    ],
  },
];

const allOperations: Operation[] = [
  {
    id: "1",
    client: "João Silva",
    amount: 50000,
    date: "2025-02-18",
    status: "completed",
    clientEmail: "joao.silva@email.com",
    employeeName: "Você (Tiago Cazarotto)",
  },
  {
    id: "2",
    client: "Maria Santos",
    amount: 75000,
    date: "2025-02-17",
    status: "processing",
    clientEmail: "maria.santos@email.com",
    employeeName: "Rosane",
  },
  {
    id: "3",
    client: "Pedro Oliveira",
    amount: 100000,
    date: "2025-02-16",
    status: "completed",
    clientEmail: "pedro.oliveira@email.com",
    employeeName: "Felipe",
  },
  {
    id: "4",
    client: "Ana Costa",
    amount: 25000,
    date: "2025-02-15",
    status: "pending",
    clientEmail: "ana.costa@email.com",
    employeeName: "Júlio",
  },
  {
    id: "5",
    client: "Carlos Ferreira",
    amount: 150000,
    date: "2025-02-14",
    status: "completed",
    clientEmail: "carlos.ferreira@email.com",
    employeeName: "Larissa",
  },
];

const getBestPerformer = (data, key) => {
  return data.reduce((best, current) =>
    current[key] > best[key] ? current : best
  );
};

const getBestPerformers = (data) => {
  return {
    bestRevenue: getBestPerformer(data, "receita"),
    bestOperations: getBestPerformer(data, "operacoes"),
    bestPartners: getBestPerformer(data, "parceiros"),
  };
};

const COLORS = {
  primary: "#FFA500",
  secondary: "#FF8C00",
  accent: "#FFD700",
  bars: "#FFFFFF",
};

export default function DesempenhoPage() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const [newGoal, setNewGoal] = useState({ name: "", target: "" });
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [currentEmployeeData, setCurrentEmployeeData] = useState(
    employeePerformanceData[0]
  );
  const [recentOperations, setRecentOperations] =
    useState<Operation[]>(allOperations);

  // Protege a rota: se o usuário não estiver autenticado, redireciona para /login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return null;
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedEmployee === "all") {
      const bestPerformers = getBestPerformers(employeePerformanceData);
      setCurrentEmployeeData({
        name: "Todos os Funcionários",
        image: "/avatars/all.png",
        receita: employeePerformanceData.reduce(
          (sum, emp) => sum + emp.receita,
          0
        ),
        operacoes: employeePerformanceData.reduce(
          (sum, emp) => sum + emp.operacoes,
          0
        ),
        parceiros: employeePerformanceData.reduce(
          (sum, emp) => sum + emp.parceiros,
          0
        ),
        metas: [
          {
            name: "Melhor Faturamento",
            value: bestPerformers.bestRevenue.receita,
            target: bestPerformers.bestRevenue.receita,
            performer: bestPerformers.bestRevenue.name,
          },
          {
            name: "Mais Operações",
            value: bestPerformers.bestOperations.operacoes,
            target: bestPerformers.bestOperations.operacoes,
            performer: bestPerformers.bestOperations.name,
          },
          {
            name: "Mais Parceiros",
            value: bestPerformers.bestPartners.parceiros,
            target: bestPerformers.bestPartners.parceiros,
            performer: bestPerformers.bestPartners.name,
          },
        ],
      });
      setRecentOperations(allOperations);
    } else {
      const employee = employeePerformanceData.find(
        (emp) => emp.name === selectedEmployee
      );
      if (employee) {
        setCurrentEmployeeData(employee);
        setRecentOperations(
          allOperations.filter((op) => op.employeeName === employee.name)
        );
      }
    }
  }, [selectedEmployee]);

  const handleLogout = async () => {
    // Encerra a sessão e redireciona para a página de login
    await signOut({ callbackUrl: "/login" });
  };

  const handleAddGoal = () => {
    console.log("New goal:", newGoal);
    setNewGoal({ name: "", target: "" });
  };

  if (!mounted) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/95 backdrop-blur-sm border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm">
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <div className="p-4 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-3xl font-bold">Desempenho</h1>
          </div>
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
                  <AvatarImage
                    src={session?.user?.image || "/img/default-avatar.png"}
                  />
                  <AvatarFallback>
                    {session?.user?.name ? session.user.name.charAt(0) : "U"}
                  </AvatarFallback>
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

        {/* Performance Content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Charts and Metrics */}
          <div className="xl:col-span-2 space-y-6">
            {/* Employee Selection */}
            <Card className="bg-card/10 backdrop-blur-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  Selecione um Funcionário
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
                  <button
                    key="all"
                    onClick={() => setSelectedEmployee("all")}
                    className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                      selectedEmployee === "all"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    <Avatar className="h-12 w-12 mb-2">
                      <AvatarImage src="/avatars/all.png" alt="Todos" />
                      <AvatarFallback>ALL</AvatarFallback>
                    </Avatar>
                    <p className="font-medium text-sm text-center">Todos</p>
                    <p className="text-xs text-muted-foreground">
                      {employeePerformanceData.reduce(
                        (sum, emp) => sum + emp.operacoes,
                        0
                      )}{" "}
                      op.
                    </p>
                  </button>
                  {employeePerformanceData.map((employee) => (
                    <button
                      key={employee.name}
                      onClick={() => setSelectedEmployee(employee.name)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                        selectedEmployee === employee.name
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }`}
                    >
                      <Avatar className="h-12 w-12 mb-2">
                        <AvatarImage src={employee.image} alt={employee.name} />
                        <AvatarFallback>{employee.name[0]}</AvatarFallback>
                      </Avatar>
                      <p className="font-medium text-sm text-center">
                        {employee.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {employee.operacoes} op.
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="bg-card/10 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Faturamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    R$ {currentEmployeeData.receita.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedEmployee === "all"
                      ? `${currentEmployeeData.metas[0].performer} tem o melhor faturamento`
                      : `${
                          currentEmployeeData.name
                        } atingiu um faturamento de ${
                          currentEmployeeData.receita / 1000
                        } mil`}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/10 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Operações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {currentEmployeeData.operacoes}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedEmployee === "all"
                      ? `${currentEmployeeData.metas[1].performer} cadastrou mais operações`
                      : `${currentEmployeeData.name} fechou ${currentEmployeeData.operacoes} operações`}
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-card/10 backdrop-blur-sm border-0">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">
                    Parceiros
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {currentEmployeeData.parceiros}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {selectedEmployee === "all"
                      ? `${currentEmployeeData.metas[2].performer} tem mais parceiros ativos`
                      : `${currentEmployeeData.name} tem ${currentEmployeeData.parceiros} parceiros`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Card className="bg-card/10 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle>Desempenho dos Funcionários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={
                        selectedEmployee === "all"
                          ? employeePerformanceData
                          : [currentEmployeeData]
                      }
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="opacity-10"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "currentColor" }}
                      />
                      <YAxis
                        yAxisId="left"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "currentColor" }}
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "currentColor" }}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        iconType="circle"
                        wrapperStyle={{ paddingTop: "20px" }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="operacoes"
                        fill={COLORS.bars}
                        name="Operações"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="receita"
                        fill={COLORS.bars}
                        name="Receita (R$)"
                        radius={[4, 4, 0, 0]}
                        opacity={0.8}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="parceiros"
                        fill={COLORS.bars}
                        name="Parceiros"
                        radius={[4, 4, 0, 0]}
                        opacity={0.6}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Employee Goals or Best Performances */}
            <Card className="bg-card/10 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>
                    {selectedEmployee === "all"
                      ? "Melhores Desempenhos"
                      : `Metas de ${currentEmployeeData.name}`}
                  </span>
                  {selectedEmployee !== "all" && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Nova Meta
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Nova Meta</DialogTitle>
                          <DialogDescription>
                            Defina uma nova meta para {currentEmployeeData.name}
                            .
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="name" className="text-right">
                              Nome
                            </label>
                            <Input
                              id="name"
                              value={newGoal.name}
                              onChange={(e) =>
                                setNewGoal({ ...newGoal, name: e.target.value })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="target" className="text-right">
                              Meta
                            </label>
                            <Input
                              id="target"
                              value={newGoal.target}
                              onChange={(e) =>
                                setNewGoal({
                                  ...newGoal,
                                  target: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddGoal}>Adicionar Meta</Button>
                      </DialogContent>
                    </Dialog>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {selectedEmployee === "all" ? (
                      <BarChart
                        data={employeePerformanceData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-10"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "currentColor" }}
                        />
                        <YAxis
                          yAxisId="left"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "currentColor" }}
                        />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "currentColor" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{ paddingTop: "20px" }}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="operacoes"
                          fill={COLORS.bars}
                          name="Operações"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          yAxisId="right"
                          dataKey="receita"
                          fill={COLORS.bars}
                          name="Receita (R$)"
                          radius={[4, 4, 0, 0]}
                          opacity={0.8}
                        />
                        <Bar
                          yAxisId="left"
                          dataKey="parceiros"
                          fill={COLORS.bars}
                          name="Parceiros"
                          radius={[4, 4, 0, 0]}
                          opacity={0.6}
                        />
                      </BarChart>
                    ) : (
                      <BarChart
                        data={currentEmployeeData.metas}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 20,
                        }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          className="opacity-10"
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "currentColor" }}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: "currentColor" }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                          iconType="circle"
                          wrapperStyle={{ paddingTop: "20px" }}
                        />
                        <Bar
                          dataKey="value"
                          fill={COLORS.bars}
                          name="Atual"
                          radius={[4, 4, 0, 0]}
                        />
                        <Bar
                          dataKey="target"
                          fill={COLORS.bars}
                          name="Meta"
                          radius={[4, 4, 0, 0]}
                          opacity={0.6}
                        />
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Recent Operations */}
          <div className="space-y-6">
            <Card className="bg-card/10 backdrop-blur-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Operações Recentes</CardTitle>
                <CardDescription>
                  {selectedEmployee === "all"
                    ? `Total de ${recentOperations.length} operações este mês.`
                    : `${currentEmployeeData.name} realizou ${recentOperations.length} operações este mês.`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOperations.map((operation) => (
                    <div
                      key={operation.id}
                      className="flex items-center justify-between space-x-4 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={`https://avatar.vercel.sh/${operation.client}.png`}
                          />
                          <AvatarFallback>{operation.client[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {operation.client}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {operation.clientEmail}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          R$ {operation.amount.toLocaleString()}
                        </p>
                        <p
                          className={`text-xs ${
                            operation.status === "completed"
                              ? "text-green-500"
                              : operation.status === "processing"
                              ? "text-orange-500"
                              : "text-red-500"
                          }`}
                        >
                          {operation.status === "completed"
                            ? "Concluída"
                            : operation.status === "processing"
                            ? "Em Processo"
                            : "Pendente"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Summary Card */}
            <Card className="bg-card/10 backdrop-blur-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Resumo do Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Total de Operações
                    </p>
                    <p className="text-2xl font-bold">
                      {recentOperations.length}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Valor Total</p>
                    <p className="text-2xl font-bold">
                      R${" "}
                      {recentOperations
                        .reduce((sum, op) => sum + op.amount, 0)
                        .toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Média por Operação
                    </p>
                    <p className="text-2xl font-bold">
                      R${" "}
                      {Math.round(
                        recentOperations.reduce(
                          (sum, op) => sum + op.amount,
                          0
                        ) / recentOperations.length
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      Taxa de Conclusão
                    </p>
                    <p className="text-2xl font-bold">
                      {Math.round(
                        (recentOperations.filter(
                          (op) => op.status === "completed"
                        ).length /
                          recentOperations.length) *
                          100
                      )}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
