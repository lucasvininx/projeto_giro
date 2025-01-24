"use client"

import { useState } from "react"
import { Bell, Search, ChevronDown, PlusCircle, ArrowLeft, Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

// Mock data for operations with all required fields
const operations = [
  {
    id: 1,
    number: "OP001",
    client: "Cliente A",
    value: 10000,
    status: "Em andamento",
    personType: "fisica",
    clientName: "João Silva",
    clientEmail: "joao@example.com",
    clientPhone: "(11) 98765-4321",
    clientAddress: "Rua A, 123 - São Paulo, SP",
    clientDocument: "123.456.789-00",
    clientSalary: 5000,
    profession: "Engenheiro",
    professionalActivity: "Engenharia Civil",
    propertyType: "Apartamento",
    propertyValue: 300000,
    propertyLocation: "Rua B, 456 - São Paulo, SP",
    desiredValue: 200000,
    incomeProof: "Holerite dos últimos 3 meses",
    creditDefense: "Score de crédito alto, sem restrições",
    documents: ["RG", "CPF", "Comprovante de residência"],
  },
  {
    id: 2,
    number: "OP002",
    client: "Cliente B",
    value: 15000,
    status: "Concluída",
    personType: "juridica",
    clientName: "Empresa XYZ Ltda",
    clientEmail: "contato@empresaxyz.com",
    clientPhone: "(11) 3333-4444",
    clientAddress: "Av. C, 789 - São Paulo, SP",
    clientDocument: "12.345.678/0001-90",
    clientSalary: 20000,
    profession: "N/A",
    professionalActivity: "Comércio varejista",
    propertyType: "Loja comercial",
    propertyValue: 500000,
    propertyLocation: "Av. D, 1010 - São Paulo, SP",
    desiredValue: 300000,
    incomeProof: "Balanço financeiro dos últimos 2 anos",
    creditDefense: "Empresa com histórico de crédito positivo",
    documents: ["Contrato Social", "CNPJ", "Comprovante de endereço"],
  },
  // ... outros registros de operações ...
]

export default function MinhasOperacoesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [selectedOperation, setSelectedOperation] = useState<(typeof operations)[0] | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    personType: "fisica",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    clientDocument: "",
    clientSalary: "",
    profession: "",
    professionalActivity: "",
    propertyType: "",
    propertyValue: "",
    propertyLocation: "",
    desiredValue: "",
    incomeProof: "",
    creditDefense: "",
    documents: null,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } },
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prev) => ({ ...prev, documents: e.target.files }))
    }
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    } else {
      alert("Por favor, preencha todos os campos obrigatórios antes de prosseguir.")
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.personType &&
          formData.clientName &&
          formData.clientEmail &&
          formData.clientPhone &&
          formData.clientAddress &&
          formData.clientDocument
        )
      case 2:
        return formData.clientSalary && formData.profession && formData.professionalActivity
      case 3:
        return formData.propertyType && formData.propertyValue && formData.propertyLocation && formData.desiredValue
      case 4:
        return formData.incomeProof && formData.creditDefense && formData.documents
      default:
        return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(4)) {
      console.log(formData)
      // Here you would typically send the data to your backend
      setIsDialogOpen(false)
      setCurrentStep(1)
    } else {
      alert("Por favor, preencha todos os campos obrigatórios antes de enviar.")
    }
  }

  const handleViewDetails = (operation: (typeof operations)[0]) => {
    setSelectedOperation(operation)
    setIsDetailsDialogOpen(true)
  }

  const filteredOperations = operations.filter(
    (op) =>
      (op.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || op.status === statusFilter),
  )

  const formatLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      personType: "Tipo de Pessoa",
      clientName: formData.personType === "fisica" ? "Nome do Cliente" : "Nome da Empresa",
      clientEmail: formData.personType === "fisica" ? "Email do Cliente" : "Email da Empresa",
      clientPhone: formData.personType === "fisica" ? "Telefone do Cliente" : "Telefone da Empresa",
      clientAddress: formData.personType === "fisica" ? "Endereço do Cliente" : "Endereço da Empresa",
      clientDocument: formData.personType === "fisica" ? "CPF" : "CNPJ",
      clientSalary: "Renda/Faturamento",
      profession: "Profissão",
      professionalActivity: "Atividade Profissional",
      propertyType: "Tipo de Imóvel",
      propertyValue: "Valor do Imóvel",
      propertyLocation: "Localização do Imóvel",
      desiredValue: "Valor Pretendido",
      incomeProof: "Comprovação de Renda",
      creditDefense: "Defesa de Crédito",
      documents: "Documentos",
      number: "Número da Operação",
      status: "Status",
      value: "Valor da Operação",
    }
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  const formatValue = (key: string, value: any) => {
    if (key === "personType") return value === "fisica" ? "Física" : "Jurídica"
    if (key === "clientSalary" || key === "propertyValue" || key === "desiredValue" || key === "value") {
      return `R$ ${Number(value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
    }
    if (key === "documents" && Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      )
    }
    return value
  }

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="personType" className="text-xs">
                  Tipo de Pessoa*
                </Label>
                <Select
                  name="personType"
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, personType: value }))}
                  required
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fisica">Física</SelectItem>
                    <SelectItem value="juridica">Jurídica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="clientName" className="text-xs">
                  {formData.personType === "fisica" ? "Nome do Cliente*" : "Nome da Empresa*"}
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                  className="h-8"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="clientDocument" className="text-xs">
                {formData.personType === "fisica" ? "CPF*" : "CNPJ*"}
              </Label>
              <Input
                id="clientDocument"
                name="clientDocument"
                value={formData.clientDocument}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="clientEmail" className="text-xs">
                {formData.personType === "fisica" ? "Email do Cliente*" : "Email da Empresa*"}
              </Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="clientPhone" className="text-xs">
                {formData.personType === "fisica" ? "Telefone do Cliente*" : "Telefone da Empresa*"}
              </Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="clientAddress" className="text-xs">
                {formData.personType === "fisica" ? "Endereço do Cliente*" : "Endereço da Empresa*"}
              </Label>
              <Textarea
                id="clientAddress"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleInputChange}
                required
                className="h-20 resize-none"
              />
            </div>
          </div>
        )
      case 2:
        return (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="clientSalary" className="text-xs">
                Renda do Cliente*
              </Label>
              <Input
                id="clientSalary"
                name="clientSalary"
                type="number"
                value={formData.clientSalary}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="profession" className="text-xs">
                Profissão*
              </Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="professionalActivity" className="text-xs">
                Atividade Profissional*
              </Label>
              <Textarea
                id="professionalActivity"
                name="professionalActivity"
                value={formData.professionalActivity}
                onChange={handleInputChange}
                required
                className="h-20 resize-none"
              />
            </div>
          </div>
        )
      case 3:
        return (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="propertyType" className="text-xs">
                Tipo de Imóvel*
              </Label>
              <Input
                id="propertyType"
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="propertyValue" className="text-xs">
                Valor do Imóvel*
              </Label>
              <Input
                id="propertyValue"
                name="propertyValue"
                type="number"
                value={formData.propertyValue}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="propertyLocation" className="text-xs">
                Localização do Imóvel*
              </Label>
              <Input
                id="propertyLocation"
                name="propertyLocation"
                value={formData.propertyLocation}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="desiredValue" className="text-xs">
                Valor Pretendido*
              </Label>
              <Input
                id="desiredValue"
                name="desiredValue"
                type="number"
                value={formData.desiredValue}
                onChange={handleInputChange}
                required
                className="h-8"
              />
            </div>
          </div>
        )
      case 4:
        return (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="incomeProof" className="text-xs">
                Comprovação de Renda*
              </Label>
              <Textarea
                id="incomeProof"
                name="incomeProof"
                value={formData.incomeProof}
                onChange={handleInputChange}
                required
                className="h-20 resize-none"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="creditDefense" className="text-xs">
                Defesa de Crédito*
              </Label>
              <Textarea
                id="creditDefense"
                name="creditDefense"
                value={formData.creditDefense}
                onChange={handleInputChange}
                required
                className="h-20 resize-none"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="documents" className="text-xs">
                Documentos (PDF, PNG, JPEG)*
              </Label>
              <Input
                id="documents"
                name="documents"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                multiple
                onChange={handleFileChange}
                required
                className="h-8"
              />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Minhas Operações</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
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
                <DropdownMenuItem>Perfil</DropdownMenuItem>
                <DropdownMenuItem>Configurações</DropdownMenuItem>
                <DropdownMenuItem>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4 items-center">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar operações"
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Em andamento">Em andamento</SelectItem>
                <SelectItem value="Concluída">Concluída</SelectItem>
                <SelectItem value="Em análise">Em análise</SelectItem>
                <SelectItem value="Declinada">Declinada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Operação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader className="space-y-1 pb-2">
                <DialogTitle className="text-lg">Nova Operação - Passo {currentStep}/4</DialogTitle>
                <DialogDescription className="text-sm">
                  Preencha os detalhes abaixo. Campos com * são obrigatórios.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-2">
                {renderFormStep()}
                <div className="flex justify-between pt-2">
                  {currentStep > 1 && (
                    <Button type="button" onClick={handlePreviousStep} size="sm">
                      Voltar
                    </Button>
                  )}
                  {currentStep < 4 ? (
                    <Button type="button" onClick={handleNextStep} className="ml-auto" size="sm">
                      Próximo
                    </Button>
                  ) : (
                    <Button type="submit" className="ml-auto" size="sm">
                      Cadastrar
                    </Button>
                  )}
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Operations Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número da Operação</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOperations.map((op) => (
              <TableRow key={op.id}>
                <TableCell>{op.number}</TableCell>
                <TableCell>{op.client}</TableCell>
                <TableCell>R$ {op.value.toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      op.status === "Em andamento"
                        ? "bg-yellow-200 text-yellow-800"
                        : op.status === "Concluída"
                          ? "bg-green-200 text-green-800"
                          : "bg-blue-200 text-blue-800"
                       
    
                    }`}
                  >
                    {op.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleViewDetails(op)}>
                    Ver detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Details Dialog */}
        <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
          <DialogContent className="sm:max-w-[450px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes da Operação {selectedOperation?.number}</DialogTitle>
              <DialogDescription>Informações detalhadas sobre a operação selecionada.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {Object.entries(selectedOperation || {}).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="font-bold text-sm">{formatLabel(key)}</Label>
                  <p className="text-sm">{formatValue(key, value)}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}

