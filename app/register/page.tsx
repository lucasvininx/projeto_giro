import { RegisterForm } from "@/app/form/register-form"

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold text-center mb-6">Cadastro de Usuário</h1>
      <RegisterForm />
    </div>
  )
}

