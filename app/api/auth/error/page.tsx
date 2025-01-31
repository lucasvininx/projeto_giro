export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Erro de autenticação</h1>
      <p className="mt-2 text-gray-600">
        Ocorreu um erro ao tentar autenticar.
      </p>
      <a href="/login" className="mt-4 text-blue-500">
        Tentar novamente
      </a>
    </div>
  );
}
