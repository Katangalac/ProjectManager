export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 items-center justify-center relative">
        <div className="absolute left-10 top-10">
            <p className="text-cyan-600 text-left font-bold dark:font-white">ProjectFlow</p>
        </div>
        {children}
      </div>
      <div className="hidden lg:flex flex-1 bg-cyan-500 dark:bg-cyan-700 items-center justify-center p-8">
        <div className="max-w-md text-center">
          {/*<img src="/assets/project_illustration.svg" alt="Project management" className="w-full" />*/}
          <h2 className="text-2xl font-bold mt-6">Gérez vos projets plus intelligemment.</h2>
          <p className="text-gray-500 mt-2">
              Formez vos équipes, planifiez vos tâches et collaborez en temps réel, le tout sur une seule plateforme.
          </p>
        </div>
      </div>
    </div>
  );
};