import type { Metadata } from "next";
import MinhasOperacoesPage from "./minhas-operacoes-page";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Minhas Operações",
  description: "Gerencie suas operações financeiras",
};

export default async function Page() {
  const session = await getAuthSession();

  if (!session?.user) {
    redirect("/login");
  }

  return <MinhasOperacoesPage />;
}
