import { useAuth } from './contexts/AuthContext';

function App() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Task Manager 🚀
        </h1>

        {isAuthenticated ? (
          <div>
            <p className="text-green-600 font-semibold">✓ Autenticado!</p>
            <p className="text-gray-600 mt-2">Olá, <strong>{user?.name}</strong></p>
            <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
          </div>
        ) : (
          <div>
            <p className="text-red-600 font-semibold">✗ Não autenticado</p>
            <p className="text-gray-600 mt-2">Precisamos criar a tela de login ainda.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;