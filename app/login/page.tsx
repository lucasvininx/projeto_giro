"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Smooch_Sans } from "next/font/google";
import { cn } from "@/lib/utils";


const smoochSans = Smooch_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});


export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const [recoveryData, setRecoveryData] = useState({
    email: "",
    username: "",
  });


  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const errorMessage = searchParams.get("error");
    if (errorMessage) {
      setError(
        errorMessage === "CredentialsSignin"
          ? "Credenciais inválidas"
          : "Erro ao fazer login"
      );
    }
  }, [searchParams]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);


    if (formData.email && formData.password) {
      try {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });


        if (result?.error) {
          setError(
            result.error === "CredentialsSignin"
              ? "Credenciais inválidas"
              : result.error
          );
          return;
        }


        if (result?.ok) {
          router.push("/dashboard");
          router.refresh();
        }
      } catch (error) {
        setError("Erro ao fazer login. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Por favor, preencha todos os campos");
      setIsLoading(false);
    }
  };


  const handleRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (recoveryData.email && recoveryData.username) {
      try {
        // Implemente a lógica de recuperação de senha aqui
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsRecoveryMode(false);
      } catch (error) {
        setError("Erro ao recuperar senha. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Por favor, preencha todos os campos");
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-[1200px] bg-white rounded-[32px] shadow-lg flex flex-col lg:flex-row p-8 gap-8">
        {/* Left side - Forms */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            {/* Login Form */}
            <div
              className={cn(
                "transition-all duration-300 transform",
                isRecoveryMode
                  ? "translate-x-[-100%] absolute opacity-0"
                  : "translate-x-0 relative opacity-100"
              )}
            >
              <h1
                className={`text-[#000044] text-4xl mb-2 ${smoochSans.className} font-bold`}
              >
                Bem-Vindo!
              </h1>
              <p className="text-[#000044] mb-8 font-bold">
                Realize seu login e veja suas operações
              </p>


              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-[#f5f5f5] border-0 h-12 pl-10 text-black"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    type="password"
                    placeholder="Senha"
                    className="bg-[#f5f5f5] border-0 h-12 pl-10 text-black"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#FFA500] hover:bg-[#FF8C00] text-white rounded-md font-bold"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </div>
                  ) : (
                    "Entrar"
                  )}
                </Button>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setIsRecoveryMode(true)}
                    className="text-[#000080] hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              </form>
            </div>


            {/* Recovery Form */}
            <div
              className={cn(
                "transition-all duration-300 transform",
                isRecoveryMode
                  ? "translate-x-0 relative opacity-100"
                  : "translate-x-[100%] absolute opacity-0"
              )}
            >
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setIsRecoveryMode(false)}
                  className="text-[#000044] hover:text-[#000044]/80"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <h1 className="text-[#000044] text-2xl font-bold">
                  Recuperar Senha
                </h1>
              </div>
              <p className="text-[#000044] mb-6">
                Digite seu email e usuário para recuperar sua senha
              </p>


              <form onSubmit={handleRecovery} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-[#f5f5f5] border-0 h-12 pl-10 text-black"
                    value={recoveryData.email}
                    onChange={(e) =>
                      setRecoveryData({
                        ...recoveryData,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Usuário"
                    className="bg-[#f5f5f5] border-0 h-12 pl-10 text-black"
                    value={recoveryData.username}
                    onChange={(e) =>
                      setRecoveryData({
                        ...recoveryData,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#FFA500] hover:bg-[#FF8C00] text-white font-bold rounded-md"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </div>
                  ) : (
                    "Recuperar Senha"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>


        {/* Right side - Logo */}
        <div className="flex-1 flex items-center justify-center">
          <Image
            src="/img/giro_logo.png"
            alt="Giro Capital Logo"
            width={500}
            height={150}
            className="max-w-full h-auto"
            priority
          />
        </div>
      </div>


      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-[#FFA500] animate-spin mb-3" />
            <p className="text-[#000044] font-bold">Carregando...</p>
          </div>
        </div>
      )}
    </div>
  );
}
