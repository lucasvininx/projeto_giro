"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (!username.startsWith("@")) {
      setError("Usuário deve conter @");
      return;
    }

    console.log("Registration data:", { username, email, password });
    // TODO: Implement actual registration logic here
    // router.push("/login")
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Registro de novo usuário</CardTitle>
          <CardDescription>Insira as informações abaixo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="@usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <Button type="submit" className="w-full mt-6">
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
