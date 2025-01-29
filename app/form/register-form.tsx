"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(""); // Limpar erro anterior

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.includes("email already exists")) {
          throw new Error("E-mail já cadastrado.");
        }
        throw new Error(result.error || "Erro ao cadastrar usuário");
      }

      setSuccess(true);
      if (formRef.current) {
        formRef.current.reset();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao cadastrar usuário"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="space-y-6 w-full max-w-md mx-auto"
    >
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="password">Senha</Label>
        <Input id="password" name="password" type="password" required />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-100 border-green-400 text-green-700">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <AlertDescription>Usuário cadastrado com sucesso!</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </form>
  );
}
