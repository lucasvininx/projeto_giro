"use client";

import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type React from "react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect, useCallback } from "react";
import { PlusCircle, Loader2, Trash2 } from "lucide-react";
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
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

// Definição dos tipos
type Partner = {
  name: string;
  cpf: string;
  cnpj: string;
  participation: string;
};

type Operation = {
  _id: string;
  number: string;
  client: string;
  value: number;
  status: string;
  personType: "fisica" | "juridica";
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  clientDocument?: string;
  clientSalary: number;
  profession: string;
  professionalActivity: string;
  propertyType: string;
  propertyValue: number;
  propertyLocation: string;
  desiredValue: number;
  incomeProof: string;
  creditDefense: string;
  documents: string[];
  cpf?: string;
  rg?: string;
  maritalStatus?: string;
  spouseName?: string;
  spouseCPF?: string;
  spouseRG?: string;
  cnpj?: string;
  partners?: Partner[];
  companyRevenue?: number;
  employeesCount?: number;
  hasDebt?: boolean;
  debtValue?: number;
  debtInstitution?: string;
  personalDebts?: string;
  legalProcesses?: string;
  isRental?: boolean;
  rentalValue?: number;
  propertyImage?: string;
  createdAt: string;
  updatedAt: string;
};

const statusColors: Record<string, string> = {
  "Pré-Análise": "bg-blue-100 text-blue-800",
  Análise: "bg-purple-100 text-purple-800",
  "Análise de Crédito": "bg-indigo-100 text-indigo-800",
  "Análise Jurídica e Laudo de Engenharia": "bg-cyan-100 text-cyan-800",
  Comitê: "bg-orange-100 text-orange-800",
  "Crédito Aprovado": "bg-green-100 text-green-800",
  "Contrato Assinado": "bg-emerald-100 text-emerald-800",
  "Contrato Registrado": "bg-teal-100 text-teal-800",
  Recusada: "bg-red-100 text-red-800",
  "Em andamento": "bg-yellow-100 text-yellow-800",
  Concluída: "bg-green-100 text-green-800",
};

export default function MinhasOperacoesPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [operations, setOperations] = useState<Operation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedOperation, setSelectedOperation] = useState<Operation | null>(
    null
  );
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
    documents: null as FileList | null,
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
    propertyImage: null as File | null,
  });
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Função para buscar as operações
  const fetchOperations = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (searchTerm) {
        queryParams.append("search", searchTerm);
      }

      if (statusFilter !== "all") {
        queryParams.append("status", statusFilter);
      }

      console.log("Fetching operations with params:", queryParams.toString());
      const response = await fetch(
        `/api/operations/index?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error("Falha ao buscar operações");
      }

      const data = await response.json();
      console.log("Fetched operations:", data);
      setOperations(data);
    } catch (error) {
      console.error("Error fetching operations:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as operações",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, toast]);

  useEffect(() => {
    if (session) {
      fetchOperations();
    }
  }, [session, fetchOperations]);

  useEffect(() => {
    console.log("Current operations:", operations);
  }, [operations]);

  const handleInputChange = (
    e:
      | React.ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
      | { target: { name: string; value: string } }
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateCurrentStep();
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }));
    validateCurrentStep();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      if (e.target.name === "propertyImage") {
        setFormData((prev) => ({ ...prev, propertyImage: e.target.files![0] }));
      } else if (e.target.name === "documents") {
        setFormData((prev) => ({ ...prev, documents: e.target.files }));
      }
      validateCurrentStep();
    }
  };

  const validateCurrentStep = () => {
    setIsCurrentStepValid(isStepValid(currentStep));
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Campos obrigatórios",
        description:
          "Por favor, preencha todos os campos obrigatórios antes de continuar.",
        variant: "destructive",
      });
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return (
          !!formData.clientName &&
          !!formData.clientEmail &&
          !!formData.clientPhone
        );
      case 2:
        if (formData.personType === "fisica") {
          return !!formData.cpf && !!formData.profession;
        } else {
          return (
            !!formData.cnpj &&
            formData.partners.every((p) => !!p.name && !!p.participation)
          );
        }
      case 3:
        return (
          !!formData.propertyType &&
          !!formData.propertyValue &&
          !!formData.desiredValue
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  const validateStep = (step: number) => {
    return isStepValid(step);
  };

  const uploadFile = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: formDataUpload,
    });
    if (!response.ok) {
      throw new Error("Failed to upload file");
    }
    const data = await response.json();
    return data.url;
  };

  const uploadMultipleFiles = async (files: FileList) => {
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const url = await uploadFile(files[i]);
      urls.push(url);
    }
    return urls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(currentStep)) {
      return;
    }

    try {
      setSubmitting(true);

      const operationData: any = {
        personType: formData.personType,
        clientName: formData.clientName,
        client: formData.clientName,
        clientEmail: formData.clientEmail,
        clientPhone: formData.clientPhone,
        clientAddress: formData.clientAddress,
        clientSalary: Number(formData.clientSalary),
        profession: formData.profession,
        professionalActivity: formData.professionalActivity,
        propertyType: formData.propertyType,
        propertyValue: Number(formData.propertyValue),
        propertyLocation: formData.propertyLocation,
        desiredValue: Number(formData.desiredValue),
        incomeProof: formData.incomeProof,
        creditDefense: formData.creditDefense,
        value: Number(formData.desiredValue),
      };

      if (formData.personType === "fisica") {
        operationData.cpf = formData.cpf;
        operationData.rg = formData.rg;
        operationData.maritalStatus = formData.maritalStatus;

        if (formData.maritalStatus === "casado") {
          operationData.spouseName = formData.spouseName;
          operationData.spouseCPF = formData.spouseCPF;
          operationData.spouseRG = formData.spouseRG;
        }
      } else {
        operationData.cnpj = formData.cnpj;
        operationData.partners = formData.partners;
        operationData.companyRevenue = Number(formData.companyRevenue);
        operationData.employeesCount = Number(formData.employeesCount);
      }

      operationData.hasDebt = formData.hasDebt;
      if (formData.hasDebt) {
        operationData.debtValue = Number(formData.debtValue);
        operationData.debtInstitution = formData.debtInstitution;
      }

      operationData.personalDebts = formData.personalDebts;
      operationData.legalProcesses = formData.legalProcesses;

      operationData.isRental = formData.isRental;
      if (formData.isRental) {
        operationData.rentalValue = Number(formData.rentalValue);
      }

      if (formData.propertyImage) {
        const imageUrl = await uploadFile(formData.propertyImage);
        operationData.propertyImage = imageUrl;
      }

      if (formData.documents) {
        const documentUrls = await uploadMultipleFiles(formData.documents);
        operationData.documents = documentUrls;
      } else {
        operationData.documents = [];
      }

      console.log("Submitting operation data:", operationData);
      const response = await fetch("/api/operations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(operationData),
      });

      if (!response.ok) {
        throw new Error("Falha ao criar operação");
      }

      const createdOperation = await response.json();
      console.log("Operation created successfully:", createdOperation);

      setFormData({
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

      setIsDialogOpen(false);
      setCurrentStep(1);
      setIsCurrentStepValid(false);

      setTimeout(() => {
        fetchOperations();
      }, 500);

      toast({
        title: "Sucesso",
        description: "Operação criada com sucesso",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a operação",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewDetails = (operation: Operation) => {
    setSelectedOperation(operation);
    setIsDetailsDialogOpen(true);
  };

  const handleDeleteOperation = async (id: string) => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/operations/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete operation");
      }
      await fetchOperations();
      toast({
        title: "Sucesso",
        description: "Operação deletada com sucesso!",
      });
    } catch (error) {
      console.error("Error deleting operation:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a operação.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handlePartnerChange = (index: number, field: string, value: string) => {
    const updatedPartners = [...formData.partners];
    updatedPartners[index] = { ...updatedPartners[index], [field]: value };
    setFormData((prev) => ({ ...prev, partners: updatedPartners }));
    validateCurrentStep();
  };

  const addPartner = () => {
    setFormData((prev) => ({
      ...prev,
      partners: [
        ...prev.partners,
        { name: "", cpf: "", cnpj: "", participation: "" },
      ],
    }));
    validateCurrentStep();
  };

  const removePartner = (index: number) => {
    if (formData.partners.length > 1) {
      const updatedPartners = [...formData.partners];
      updatedPartners.splice(index, 1);
      setFormData((prev) => ({ ...prev, partners: updatedPartners }));
      validateCurrentStep();
    }
  };

  const formatLabel = (key: string) => {
    const labels: Record<string, string> = {
      clientName: "Nome do Cliente",
      clientEmail: "Email do Cliente",
      clientPhone: "Telefone do Cliente",
      clientAddress: "Endereço do Cliente",
      clientDocument: "Documento do Cliente",
      clientSalary: "Salário do Cliente",
      profession: "Profissão",
      professionalActivity: "Atividade Profissional",
      propertyType: "Tipo de Imóvel",
      propertyValue: "Valor do Imóvel",
      propertyLocation: "Localização do Imóvel",
      desiredValue: "Valor Desejado",
      incomeProof: "Comprovante de Renda",
      creditDefense: "Defesa de Crédito",
      documents: "Documentos",
      cpf: "CPF",
      rg: "RG",
      maritalStatus: "Estado Civil",
      spouseName: "Nome do Cônjuge",
      spouseCPF: "CPF do Cônjuge",
      spouseRG: "RG do Cônjuge",
      cnpj: "CNPJ",
      partners: "Sócios",
      companyRevenue: "Faturamento da Empresa",
      employeesCount: "Número de Funcionários",
      hasDebt: "Possui Dívidas?",
      debtValue: "Valor da Dívida",
      debtInstitution: "Instituição da Dívida",
      personalDebts: "Dívidas Pessoais",
      legalProcesses: "Processos Legais",
      isRental: "Imóvel para Aluguel?",
      rentalValue: "Valor do Aluguel",
      propertyImage: "Imagem do Imóvel",
    };
    return labels[key] || key;
  };

  const formatValue = (key: string, value: any) => {
    if (key === "hasDebt") {
      return value ? "Sim" : "Não";
    }
    if (key === "isRental") {
      return value ? "Sim" : "Não";
    }
    if (key === "partners") {
      return value.map((partner: Partner, index: number) => (
        <div key={index}>
          <p>Nome: {partner.name}</p>
          <p>CPF: {partner.cpf}</p>
          <p>CNPJ: {partner.cnpj}</p>
          <p>Participação: {partner.participation}</p>
        </div>
      ));
    }
    return value;
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 py-2">
            <div className="mb-4">
              <Label htmlFor="personType">Tipo de Pessoa</Label>
              <RadioGroup
                id="personType"
                value={formData.personType}
                onValueChange={(value) =>
                  handleInputChange({ target: { name: "personType", value } })
                }
                className="flex space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fisica" id="fisica" />
                  <Label htmlFor="fisica">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="juridica" id="juridica" />
                  <Label htmlFor="juridica">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="clientName">Nome do Cliente *</Label>
                <Input
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clientEmail">Email do Cliente *</Label>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clientPhone">Telefone do Cliente *</Label>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="clientAddress">Endereço do Cliente</Label>
                <Input
                  id="clientAddress"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4 py-2">
            {formData.personType === "fisica" ? (
              <>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formData.cpf}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input
                      id="rg"
                      name="rg"
                      value={formData.rg}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="profession">Profissão *</Label>
                    <Input
                      id="profession"
                      name="profession"
                      value={formData.profession}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="professionalActivity">
                      Atividade Profissional
                    </Label>
                    <Input
                      id="professionalActivity"
                      name="professionalActivity"
                      value={formData.professionalActivity}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="clientSalary">Salário</Label>
                    <Input
                      id="clientSalary"
                      name="clientSalary"
                      type="number"
                      value={formData.clientSalary}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="maritalStatus">Estado Civil</Label>
                    <Select
                      value={formData.maritalStatus}
                      onValueChange={(value) =>
                        handleInputChange({
                          target: { name: "maritalStatus", value },
                        })
                      }
                    >
                      <SelectTrigger id="maritalStatus">
                        <SelectValue placeholder="Selecione o estado civil" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">
                          Divorciado(a)
                        </SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.maritalStatus === "casado" && (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="spouseName">Nome do Cônjuge</Label>
                        <Input
                          id="spouseName"
                          name="spouseName"
                          value={formData.spouseName}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="spouseCPF">CPF do Cônjuge</Label>
                        <Input
                          id="spouseCPF"
                          name="spouseCPF"
                          value={formData.spouseCPF}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="spouseRG">RG do Cônjuge</Label>
                        <Input
                          id="spouseRG"
                          name="spouseRG"
                          value={formData.spouseRG}
                          onChange={handleInputChange}
                        />
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cnpj">CNPJ *</Label>
                    <Input
                      id="cnpj"
                      name="cnpj"
                      value={formData.cnpj}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="companyRevenue">
                      Faturamento da Empresa
                    </Label>
                    <Input
                      id="companyRevenue"
                      name="companyRevenue"
                      type="number"
                      value={formData.companyRevenue}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="employeesCount">
                      Número de Funcionários
                    </Label>
                    <Input
                      id="employeesCount"
                      name="employeesCount"
                      type="number"
                      value={formData.employeesCount}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mt-4">
                    <Label>Sócios</Label>
                    {formData.partners.map((partner, index) => (
                      <div
                        key={index}
                        className="border p-3 rounded-md mt-2 space-y-3"
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">Sócio {index + 1}</h4>
                          {formData.partners.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removePartner(index)}
                            >
                              Remover
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`partner-name-${index}`}>
                            Nome *
                          </Label>
                          <Input
                            id={`partner-name-${index}`}
                            value={partner.name}
                            onChange={(e) =>
                              handlePartnerChange(index, "name", e.target.value)
                            }
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`partner-cpf-${index}`}>CPF</Label>
                          <Input
                            id={`partner-cpf-${index}`}
                            value={partner.cpf}
                            onChange={(e) =>
                              handlePartnerChange(index, "cpf", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`partner-cnpj-${index}`}>CNPJ</Label>
                          <Input
                            id={`partner-cnpj-${index}`}
                            value={partner.cnpj}
                            onChange={(e) =>
                              handlePartnerChange(index, "cnpj", e.target.value)
                            }
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor={`partner-participation-${index}`}>
                            Participação (%) *
                          </Label>
                          <Input
                            id={`partner-participation-${index}`}
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
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={addPartner}
                    >
                      Adicionar Sócio
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 py-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="propertyType">Tipo de Imóvel *</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "propertyType", value },
                    })
                  }
                >
                  <SelectTrigger id="propertyType">
                    <SelectValue placeholder="Selecione o tipo de imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="apartamento">Apartamento</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="rural">Rural</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="propertyValue">Valor do Imóvel (R$) *</Label>
                <Input
                  id="propertyValue"
                  name="propertyValue"
                  type="number"
                  value={formData.propertyValue}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="propertyLocation">Localização do Imóvel</Label>
                <Input
                  id="propertyLocation"
                  name="propertyLocation"
                  value={formData.propertyLocation}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="desiredValue">Valor Desejado (R$) *</Label>
                <Input
                  id="desiredValue"
                  name="desiredValue"
                  type="number"
                  value={formData.desiredValue}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="propertyImage">Imagem do Imóvel</Label>
                <Input
                  id="propertyImage"
                  name="propertyImage"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="isRental"
                  checked={formData.isRental}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("isRental", checked === true)
                  }
                />
                <Label htmlFor="isRental">Imóvel para Aluguel?</Label>
              </div>

              {formData.isRental && (
                <div className="grid gap-2">
                  <Label htmlFor="rentalValue">Valor do Aluguel (R$)</Label>
                  <Input
                    id="rentalValue"
                    name="rentalValue"
                    type="number"
                    value={formData.rentalValue}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4 py-2">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="incomeProof">Comprovante de Renda</Label>
                <Select
                  value={formData.incomeProof}
                  onValueChange={(value) =>
                    handleInputChange({
                      target: { name: "incomeProof", value },
                    })
                  }
                >
                  <SelectTrigger id="incomeProof">
                    <SelectValue placeholder="Selecione o tipo de comprovante" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="holerite">Holerite</SelectItem>
                    <SelectItem value="declaracao_ir">
                      Declaração de IR
                    </SelectItem>
                    <SelectItem value="extrato_bancario">
                      Extrato Bancário
                    </SelectItem>
                    <SelectItem value="contrato_trabalho">
                      Contrato de Trabalho
                    </SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="creditDefense">Defesa de Crédito</Label>
                <Textarea
                  id="creditDefense"
                  name="creditDefense"
                  value={formData.creditDefense}
                  onChange={handleInputChange}
                  placeholder="Informações adicionais sobre o crédito do cliente"
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="documents">Documentos</Label>
                <Input
                  id="documents"
                  name="documents"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Checkbox
                  id="hasDebt"
                  checked={formData.hasDebt}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("hasDebt", checked === true)
                  }
                />
                <Label htmlFor="hasDebt">Possui Dívidas?</Label>
              </div>

              {formData.hasDebt && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="debtValue">Valor da Dívida (R$)</Label>
                    <Input
                      id="debtValue"
                      name="debtValue"
                      type="number"
                      value={formData.debtValue}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="debtInstitution">
                      Instituição da Dívida
                    </Label>
                    <Input
                      id="debtInstitution"
                      name="debtInstitution"
                      value={formData.debtInstitution}
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label htmlFor="legalProcesses">Processos Legais</Label>
                <Textarea
                  id="legalProcesses"
                  name="legalProcesses"
                  value={formData.legalProcesses}
                  onChange={handleInputChange}
                  placeholder="Descreva processos legais em andamento, se houver"
                  rows={2}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="personalDebts">Dívidas Pessoais</Label>
                <Textarea
                  id="personalDebts"
                  name="personalDebts"
                  value={formData.personalDebts}
                  onChange={handleInputChange}
                  placeholder="Descreva outras dívidas pessoais, se houver"
                  rows={2}
                />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="mr-2"
              >
                Voltar para Dashboard
              </Button>
              <h1 className="text-xl font-semibold">Minhas Operações</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Input
                placeholder="Buscar operações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[300px]"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="Pré-Análise">Pré-Análise</SelectItem>
                  <SelectItem value="Análise">Análise</SelectItem>
                  <SelectItem value="Análise de Crédito">
                    Análise de Crédito
                  </SelectItem>
                  <SelectItem value="Análise Jurídica e Laudo de Engenharia">
                    Análise Jurídica e Laudo
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
                  <SelectItem value="Em andamento">Em andamento</SelectItem>
                  <SelectItem value="Concluída">Concluída</SelectItem>
                </SelectContent>
              </Select>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Operação
              </Button>
              {session && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={session.user.image!}
                          alt={session.user.name!}
                        />
                        <AvatarFallback>
                          {session.user.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut()}
                      className="cursor-pointer"
                    >
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Seção de busca e filtros */}
        </div>

        {loading ? (
          <div className="flex h-[400px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="rounded-lg border shadow-sm bg-card">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableCell className="w-[150px] font-medium">
                    Número da Operação
                  </TableCell>
                  <TableCell className="font-medium">Cliente</TableCell>
                  <TableCell className="w-[150px] font-medium">Valor</TableCell>
                  <TableCell className="w-[200px] font-medium">
                    Status
                  </TableCell>
                  <TableCell className="w-[150px] font-medium">Ações</TableCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {operations.map((operation) => (
                  <TableRow key={operation._id}>
                    <TableCell className="font-medium">
                      {operation.number}
                    </TableCell>
                    <TableCell>{operation.clientName}</TableCell>
                    <TableCell>
                      R${" "}
                      {operation.value.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                          statusColors[operation.status] ||
                            "bg-gray-100 text-gray-800"
                        )}
                      >
                        {operation.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(operation)}
                        >
                          Ver detalhes
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteOperation(operation._id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {operations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Nenhuma operação encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nova Operação - Passo {currentStep}/4</DialogTitle>
              <DialogDescription>
                Preencha os detalhes abaixo. Campos com * são obrigatórios.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              {renderFormStep()}
              <div className="flex items-center space-x-4 mt-4">
                {currentStep > 1 && (
                  <Button type="button" onClick={handlePreviousStep} size="sm">
                    Anterior
                  </Button>
                )}
                {currentStep < 4 ? (
                  <Button
                    type="button"
                    onClick={handleNextStep}
                    className="ml-auto rounded-md"
                    size="sm"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="ml-auto rounded-md"
                    size="sm"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Cadastrando...
                      </>
                    ) : (
                      "Cadastrar"
                    )}
                  </Button>
                )}
              </div>
            </form>
          </DialogContent>
        </Dialog>
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
            {selectedOperation && (
              <div>
                {Object.entries(selectedOperation).map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <Label>{formatLabel(key)}</Label>
                    <p>{formatValue(key, value)}</p>
                  </div>
                ))}
              </div>
            )}
            <Button
              onClick={() => setIsDetailsDialogOpen(false)}
              className="mt-4"
            >
              Fechar
            </Button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}
