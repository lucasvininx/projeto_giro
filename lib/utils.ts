import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

export function generateOperationNumber(count: number): string {
  return `OP${(count + 1).toString().padStart(3, "0")}`;
}

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const digits = cpf.split("").map((x) => Number.parseInt(x));
  for (let j = 0; j < 2; j++) {
    let sum = 0;
    for (let i = 0; i < 9 + j; i++) {
      sum += digits[i] * (10 + j - i);
    }
    const check = ((sum * 10) % 11) % 10;
    if (digits[9 + j] !== check) return false;
  }
  return true;
}

export function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;
  const digits = cnpj.split("").map((x) => Number.parseInt(x));
  const calc = (x: number) => {
    const slice = digits.slice(0, x);
    let factor = x - 7;
    let sum = 0;
    for (let i = x; i >= 1; i--) {
      sum += slice[x - i] * factor--;
      if (factor < 2) factor = 9;
    }
    const result = 11 - (sum % 11);
    return result > 9 ? 0 : result;
  };
  const digits14 = calc(12);
  const digits13 = calc(13);
  return digits[12] === digits13 && digits[13] === digits14;
}
