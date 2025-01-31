"use client";

import { useState } from "react";
import { Bell, Search, PlusCircle, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

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
];

export default function MinhasOperacoesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<
    (typeof operations)[0] | null
  >(null);
  const [currentStep, setCurrentStep] = useState(1);
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
    cpf: "",
    rg: "",
    maritalStatus: "",
    spouseName: "",
    spouseCPF: "",
    spouseRG: "",
    cnpj: "",
    partners: [{ name: "", cpf: "", cnpj: "", participation: "" }],
    companyRevenue: "",
    employeesCount: "",
    hasDebt: false,
    debtValue: "",
    debtInstitution: "",
    personalDebts: "",
    legalProcesses: "",
    isRental: false,
    rentalValue: "",
    propertyImage: null,
  });
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);

  const handleInputChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsCurrentStepValid(isStepValid(currentStep));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === "propertyImage") {
        setFormData((prev) => ({ ...prev, propertyImage: e.target.files![0] }));
      } else if (e.target.name === "documents") {
        setFormData((prev) => ({ ...prev, documents: e.target.files }));
      }
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      alert(
        "Por favor, preencha todos os campos obrigatórios antes de continuar."
      );
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          formData.personType &&
          formData.clientName &&
          formData.clientEmail &&
          formData.clientPhone &&
          formData.clientAddress &&
          formData.maritalStatus &&
          (formData.personType === "fisica"
            ? formData.cpf && formData.rg
            : true) &&
          (formData.personType === "juridica"
            ? formData.cnpj &&
              formData.partners.length > 0 &&
              formData.partners.every(
                (partner) =>
                  partner.name && partner.cpf && partner.participation
              )
            : true)
        );
      case 2:
        return (
          formData.clientSalary &&
          formData.profession &&
          formData.professionalActivity &&
          (formData.personType === "juridica"
            ? formData.companyRevenue && formData.employeesCount
            : true) &&
          formData.hasDebt !== undefined &&
          (!formData.hasDebt ||
            (formData.debtValue && formData.debtInstitution))
        );
      case 3:
        return (
          formData.propertyType &&
          formData.propertyValue &&
          formData.propertyLocation &&
          formData.desiredValue &&
          formData.isRental !== undefined &&
          (!formData.isRental || formData.rentalValue)
        );
      case 4:
        return (
          formData.incomeProof && formData.creditDefense && formData.documents
        );
      default:
        return false;
    }
  };

  const validateStep = (step: number) => {
    const requiredFields = {
      1: [
        "personType",
        "clientName",
        "clientEmail",
        "clientPhone",
        "clientAddress",
        "maritalStatus",
      ],
      2: ["clientSalary", "profession", "professionalActivity"],
      3: ["propertyType", "propertyValue", "propertyLocation", "desiredValue"],
      4: ["incomeProof", "creditDefense"],
    };

    if (formData.personType === "fisica" && step === 1) {
      requiredFields[1].push("cpf", "rg");
    } else if (formData.personType === "juridica" && step === 1) {
      requiredFields[1].push("cnpj");
    }

    if (formData.personType === "juridica" && step === 2) {
      requiredFields[2].push("companyRevenue", "employeesCount");
    }

    return requiredFields[step as keyof typeof requiredFields].every(
      (field) =>
        formData[field as keyof typeof formData] !== "" &&
        formData[field as keyof typeof formData] !== null
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCurrentStepValid) {
      console.log(formData);
      // Here you would typically send the data to your backend
      setIsDialogOpen(false);
      setCurrentStep(1);
      setIsCurrentStepValid(false);
    }
  };

  const handleViewDetails = (operation: (typeof operations)[0]) => {
    setSelectedOperation(operation);
    setIsDetailsDialogOpen(true);
  };

  const filteredOperations = operations.filter(
    (op) =>
      (op.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        op.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || op.status === statusFilter)
  );

  const formatLabel = (key: string) => {
    const labels: { [key: string]: string } = {
      personType: "Tipo de Pessoa",
      clientName:
        formData.personType === "fisica"
          ? "Nome do Cliente"
          : "Nome da Empresa",
      clientEmail:
        formData.personType === "fisica"
          ? "Email do Cliente"
          : "Email da Empresa",
      clientPhone:
        formData.personType === "fisica"
          ? "Telefone do Cliente"
          : "Telefone da Empresa",
      clientAddress:
        formData.personType === "fisica"
          ? "Endereço do Cliente"
          : "Endereço da Empresa",
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
      cpf: "CPF",
      rg: "RG",
      maritalStatus: "Estado Civil",
      spouseName: "Nome do Cônjuge",
      spouseCPF: "CPF do Cônjuge",
      spouseRG: "RG do Cônjuge",
      cnpj: "CNPJ",
      partners: "Sócios",
      companyRevenue: "Faturamento",
      companyFoundedDate: "Empresa desde",
      employeesCount: "Quantidade de funcionários",
      hasDebt: "Possui dívida?",
      debtValue: "Valor da dívida",
      debtInstitution: "Instituição financeira",
      personalDebts: "Dívidas pessoais",
      legalProcesses: "Processos judiciais",
      isRental: "Imóvel Alugado?",
      rentalValue: "Valor do Aluguel",
      companyActiveYears: "Anos de atividade",
    };
    return labels[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  const formatValue = (key: string, value: any) => {
    if (key === "personType") return value === "fisica" ? "Física" : "Jurídica";
    if (
      key === "clientSalary" ||
      key === "propertyValue" ||
      key === "desiredValue" ||
      key === "value" ||
      key === "companyRevenue" ||
      key === "rentalValue" ||
      key === "debtValue"
    ) {
      return `R$ ${Number(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
      })}`;
    }
    if (key === "documents" && Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      );
    }
    if (key === "partners" && Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((partner, index) => (
            <li key={index}>
              {partner.name} - {partner.cpf} - {partner.cnpj} -{" "}
              {partner.participation}%
            </li>
          ))}
        </ul>
      );
    }
    if (key === "hasDebt" || key === "isRental") return value ? "Sim" : "Não";
    if (key === "companyFoundedDate")
      return value ? new Date(value).toLocaleDateString("pt-BR") : "";
    return value;
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label htmlFor="personType" className="text-xs">
                  Tipo de Pessoa*
                </Label>
                <Select
                  name="personType"
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, personType: value }))
                  }
                  required
                >
                  <SelectTrigger>
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
                  {formData.personType === "fisica"
                    ? "Nome do Cliente*"
                    : "Nome da Empresa*"}
                </Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            {formData.personType === "fisica" ? (
              <>
                <div className="space-y-1">
                  <Label htmlFor="cpf" className="text-xs">
                    CPF*
                  </Label>
                  <Input
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="rg" className="text-xs">
                    RG*
                  </Label>
                  <Input
                    id="rg"
                    name="rg"
                    value={formData.rg}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="maritalStatus" className="text-xs">
                    Estado Civil*
                  </Label>
                  <Select
                    name="maritalStatus"
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, maritalStatus: value }))
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solteiro">Solteiro</SelectItem>
                      <SelectItem value="casado">Casado</SelectItem>
                      <SelectItem value="divorciado">Divorciado</SelectItem>
                      <SelectItem value="viuvo">Viúvo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.maritalStatus === "casado" && (
                  <>
                    <div className="space-y-1">
                      <Label htmlFor="spouseName" className="text-xs">
                        Nome do Cônjuge*
                      </Label>
                      <Input
                        id="spouseName"
                        name="spouseName"
                        value={formData.spouseName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="spouseCPF" className="text-xs">
                        CPF do Cônjuge*
                      </Label>
                      <Input
                        id="spouseCPF"
                        name="spouseCPF"
                        value={formData.spouseCPF}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="spouseRG" className="text-xs">
                        RG do Cônjuge*
                      </Label>
                      <Input
                        id="spouseRG"
                        name="spouseRG"
                        value={formData.spouseRG}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="space-y-1">
                  <Label htmlFor="cnpj" className="text-xs">
                    CNPJ*
                  </Label>
                  <Input
                    id="cnpj"
                    name="cnpj"
                    value={formData.cnpj}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Sócios*</Label>
                  {formData.partners.map((partner, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <Input
                        placeholder="Nome"
                        value={partner.name}
                        onChange={(e) =>
                          handlePartnerChange(index, "name", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder="CPF"
                        value={partner.cpf}
                        onChange={(e) =>
                          handlePartnerChange(index, "cpf", e.target.value)
                        }
                        required
                      />
                      <Input
                        placeholder="CNPJ"
                        value={partner.cnpj}
                        onChange={(e) =>
                          handlePartnerChange(index, "cnpj", e.target.value)
                        }
                      />
                      <Input
                        placeholder="% Participação"
                        value={partner.participation}
                        onChange={(e) =>
                          handlePartnerChange(
                            index,
                            "participation",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                  ))}
                  <Button type="button" onClick={addPartner} size="sm">
                    Adicionar Sócio
                  </Button>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="companyRevenue" className="text-xs">
                    Faturamento*
                  </Label>
                  <Input
                    id="companyRevenue"
                    name="companyRevenue"
                    value={formData.companyRevenue}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="employeesCount" className="text-xs">
                    Quantidade de funcionários*
                  </Label>
                  <Input
                    id="employeesCount"
                    name="employeesCount"
                    type="number"
                    value={formData.employeesCount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-1">
              <Label htmlFor="clientEmail" className="text-xs">
                {formData.personType === "fisica"
                  ? "Email do Cliente*"
                  : "Email da Empresa*"}
              </Label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="clientPhone" className="text-xs">
                {formData.personType === "fisica"
                  ? "Telefone do Cliente*"
                  : "Telefone da Empresa*"}
              </Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="clientAddress" className="text-xs">
                {formData.personType === "fisica"
                  ? "Endereço do Cliente*"
                  : "Endereço da Empresa*"}
              </Label>
              <Textarea
                id="clientAddress"
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="clientSalary" className="text-xs">
                {formData.personType === "fisica"
                  ? "Renda do Cliente*"
                  : "Faturamento da Empresa*"}
              </Label>
              <Input
                id="clientSalary"
                name="clientSalary"
                type="number"
                value={formData.clientSalary}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="profession" className="text-xs">
                {formData.personType === "fisica"
                  ? "Profissão*"
                  : "Ramo de Atividade*"}
              </Label>
              <Input
                id="profession"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="professionalActivity" className="text-xs">
                {formData.personType === "fisica"
                  ? "Como exerce a função*"
                  : "Descrição da atividade*"}
              </Label>
              <Textarea
                id="professionalActivity"
                name="professionalActivity"
                value={formData.professionalActivity}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="hasDebt" className="text-xs">
                Possui dívidas?*
              </Label>
              <Select
                name="hasDebt"
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    hasDebt: value === "true",
                  }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.hasDebt && (
              <>
                <div className="space-y-1">
                  <Label htmlFor="debtValue" className="text-xs">
                    Valor da dívida*
                  </Label>
                  <Input
                    id="debtValue"
                    name="debtValue"
                    type="number"
                    value={formData.debtValue}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="debtInstitution" className="text-xs">
                    Instituição financeira*
                  </Label>
                  <Input
                    id="debtInstitution"
                    name="debtInstitution"
                    value={formData.debtInstitution}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </>
            )}
            <div className="space-y-1">
              <Label htmlFor="personalDebts" className="text-xs">
                Dívidas pessoais
              </Label>
              <Textarea
                id="personalDebts"
                name="personalDebts"
                value={formData.personalDebts}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="legalProcesses" className="text-xs">
                Processos judiciais
              </Label>
              <Textarea
                id="legalProcesses"
                name="legalProcesses"
                value={formData.legalProcesses}
                onChange={handleInputChange}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="propertyType" className="text-xs">
                Tipo de Imóvel*
              </Label>
              <Select
                name="propertyType"
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, propertyType: value }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa_rua">Casa de rua</SelectItem>
                  <SelectItem value="casa_condominio">
                    Casa de condomínio
                  </SelectItem>
                  <SelectItem value="terreno_condominio">
                    Terreno de condomínio
                  </SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="chacara">Chácara</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="imovel_rural_produtivo">
                    Imóvel rural produtivo
                  </SelectItem>
                  <SelectItem value="imovel_nao_averbado">
                    Imóvel não averbado
                  </SelectItem>
                  <SelectItem value="imovel_misto">Imóvel misto</SelectItem>
                  <SelectItem value="multi_familiar">Multi familiar</SelectItem>
                </SelectContent>
              </Select>
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
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="isRental" className="text-xs">
                Imóvel alugado?*
              </Label>
              <Select
                name="isRental"
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    isRental: value === "true",
                  }))
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.isRental && (
              <div className="space-y-1">
                <Label htmlFor="rentalValue" className="text-xs">
                  Valor do aluguel*
                </Label>
                <Input
                  id="rentalValue"
                  name="rentalValue"
                  type="number"
                  value={formData.rentalValue}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="propertyImage" className="text-xs">
                Imagem do imóvel (capa)
              </Label>
              <Input
                id="propertyImage"
                name="propertyImage"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
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
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handlePartnerChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const newPartners = [...prev.partners];
      newPartners[index] = { ...newPartners[index], [field]: value };
      return { ...prev, partners: newPartners };
    });
  };

  const addPartner = () => {
    setFormData((prev) => ({
      ...prev,
      partners: [
        ...prev.partners,
        { name: "", cpf: "", cnpj: "", participation: "" },
      ],
    }));
  };

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
                className="pl-10 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              className="rounded-md"
            >
              <SelectTrigger className="w-48 rounded-md border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-50">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="Pré-Análise">Pré-Análise</SelectItem>
                <SelectItem value="Análise">Análise</SelectItem>
                <SelectItem value="Análise de Crédito">
                  Análise de Crédito
                </SelectItem>
                <SelectItem value="Análise Jurídica e Laudo de Engenharia">
                  Análise Jurídica e Laudo de Engenharia
                </SelectItem>
                <SelectItem value="Comitê">Comitê</SelectItem>
                <SelectItem value="Crédito Aprovado">
                  Crédito Aprovado
                </SelectItem>
                <SelectItem value="Contrato Assinado">
                  Contrato Assinado
                </SelectItem>
                <SelectItem value="Contrato Registrado">
                  Contrato Registrado
                </SelectItem>
                <SelectItem value="Recusada">Recusada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
                <PlusCircle className="mr-2 h-4 w-4" /> Nova Operação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-hidden flex flex-col">
              <DialogHeader className="space-y-1 pb-2">
                <DialogTitle className="text-lg">
                  Nova Operação - Passo {currentStep}/4
                </DialogTitle>
                <DialogDescription className="text-sm">
                  Preencha os detalhes abaixo. Campos com * são obrigatórios.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-grow overflow-y-auto pr-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderFormStep()}
                </form>
              </div>
              <div className="flex justify-between pt-4 mt-4 border-t">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    onClick={handlePreviousStep}
                    size="sm"
                    className="rounded-md"
                  >
                    Voltar
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className={`ml-auto rounded-md ${
                      !validateStep(currentStep)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    size="sm"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className={`ml-auto rounded-md ${
                      !validateStep(currentStep)
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    size="sm"
                    onClick={(e) => {
                      if (!validateStep(currentStep)) {
                        e.preventDefault();
                        alert(
                          "Por favor, preencha todos os campos obrigatórios antes de cadastrar."
                        );
                      }
                    }}
                  >
                    Cadastrar
                  </Button>
                )}{" "}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Operations Table */}
        <Table className="rounded-lg overflow-hidden">
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
                      op.status === "Pré-Análise" ||
                      op.status === "Análise" ||
                      op.status === "Análise de Crédito"
                        ? "bg-blue-200 text-blue-800"
                        : op.status ===
                            "Análise Jurídica e Laudo de Engenharia" ||
                          op.status === "Comitê"
                        ? "bg-yellow-200 text-yellow-800"
                        : op.status === "Crédito Aprovado" ||
                          op.status === "Contrato Assinado" ||
                          op.status === "Contrato Registrado"
                        ? "bg-green-200 text-green-800"
                        : op.status === "Recusada"
                        ? "bg-red-200 text-red-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {op.status}
                  </span>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-md"
                    onClick={() => handleViewDetails(op)}
                  >
                    Ver detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Details Dialog */}
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={setIsDetailsDialogOpen}
        >
          <DialogContent className="sm:max-w-[450px] max-h-[80vh] overflow-y-auto rounded-lg">
            <DialogHeader>
              <DialogTitle>
                Detalhes da Operação {selectedOperation?.number}
              </DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre a operação selecionada.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {Object.entries(selectedOperation || {}).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <Label className="font-bold text-sm">
                    {formatLabel(key)}
                  </Label>
                  <p className="text-sm">{formatValue(key, value)}</p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
