function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Task Manager 🚀
        </h1>
        <p className="text-gray-600">
          Frontend configurado com sucesso!
        </p>
        <div className="mt-6 space-y-2">
          <div className="flex items-center text-sm text-green-600">
            <span className="mr-2">✓</span> React + TypeScript
          </div>
          <div className="flex items-center text-sm text-green-600">
            <span className="mr-2">✓</span> Tailwind CSS
          </div>
          <div className="flex items-center text-sm text-green-600">
            <span className="mr-2">✓</span> Vite
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;