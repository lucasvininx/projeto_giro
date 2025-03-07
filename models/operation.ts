import mongoose, { Schema, type Document } from "mongoose";

// Partner interface
export interface IPartner {
  name: string;
  cpf: string;
  cnpj?: string;
  participation: string;
}

// Operation interface
export interface IOperation extends Document {
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
  partners?: IPartner[];
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
  userId: mongoose.Schema.Types.ObjectId; // Reference to the user who owns this operation
  createdAt: Date;
  updatedAt: Date;
}

// Partner schema
const PartnerSchema = new Schema<IPartner>({
  name: { type: String, required: true },
  cpf: { type: String, required: true },
  cnpj: { type: String },
  participation: { type: String, required: true },
});

// Operation schema
const OperationSchema = new Schema<IOperation>(
  {
    number: { type: String, required: true, unique: true },
    client: { type: String, required: true },
    value: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        "Pré-Análise",
        "Análise",
        "Análise de Crédito",
        "Análise Jurídica e Laudo de Engenharia",
        "Comitê",
        "Crédito Aprovado",
        "Contrato Assinado",
        "Contrato Registrado",
        "Recusada",
        "Em andamento",
        "Concluída",
      ],
      default: "Pré-Análise",
    },
    personType: { type: String, required: true, enum: ["fisica", "juridica"] },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, required: true },
    clientAddress: { type: String, required: true },
    clientDocument: { type: String },
    clientSalary: { type: Number, required: true },
    profession: { type: String, required: true },
    professionalActivity: { type: String, required: true },
    propertyType: { type: String, required: true },
    propertyValue: { type: Number, required: true },
    propertyLocation: { type: String, required: true },
    desiredValue: { type: Number, required: true },
    incomeProof: { type: String, required: true },
    creditDefense: { type: String, required: true },
    documents: { type: [String], required: true },
    cpf: { type: String },
    rg: { type: String },
    maritalStatus: { type: String },
    spouseName: { type: String },
    spouseCPF: { type: String },
    spouseRG: { type: String },
    cnpj: { type: String },
    partners: { type: [PartnerSchema] },
    companyRevenue: { type: Number },
    employeesCount: { type: Number },
    hasDebt: { type: Boolean },
    debtValue: { type: Number },
    debtInstitution: { type: String },
    personalDebts: { type: String },
    legalProcesses: { type: String },
    isRental: { type: Boolean },
    rentalValue: { type: Number },
    propertyImage: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

// Generate a unique operation number before saving
OperationSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.models.Operation.countDocuments();
    this.number = `OP${(count + 1).toString().padStart(3, "0")}`;
  }
  next();
});

export default mongoose.models.Operation ||
  mongoose.model<IOperation>("Operation", OperationSchema);
