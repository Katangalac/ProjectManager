import { AuthFormProps } from "../../types/Auth";

export default function AuthForm(props: AuthFormProps) {
  const isLogin = props.type === "LOGIN";
  
    return (
      <div id="AuthFormDiv" className="w-full  max-w-md mx-auto bg-white dark:bg-gray-900 p-8">
      <h2 className="text-3xl text-black font-bold text-center mb-4 dark:text-white">
        {isLogin ? "Bienvenue!" : "Créer un compte"}
      </h2>
      <p className="text-gray-500 text-sm text-center mb-6 font-medium">Connectez-vous pour retrouver votre espace de travail.</p>
      <form className="space-y-5">
        {!isLogin && (
            <>
              <div>
                <label className="text-left text-black block mb-1 text-sm font-medium dark:text-white">Nom d'utilisateur</label>
                <input
                  type="text"
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-sm bg-white dark:bg-gray-800 dark:text-white"
                  placeholder="Ex : JohnDoe"
                />
              </div>

              <div>
                <label className="text-left text-black block mb-1 text-sm font-medium dark:text-white">Email</label>
                <input
                  type="email"
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-sm bg-white dark:bg-gray-800 dark:text-white"
                  placeholder="Ex : exemple@email.com"
                />
              </div>
            </>
          )}
          
        {isLogin && (
           <div>
                <label htmlFor="loginIdentifier" className="text-left text-black block mb-1 text-sm font-medium dark:text-white">Identifiant</label>
                <input
                  id="loginIdentifier"
                  type="text"
                  className="w-full text-black px-4 py-2 border border-gray-300 rounded-sm bg-white dark:bg-gray-800 dark:text-white"
                />
            </div> 
        )}

        <div>
          <label htmlFor="loginPwd" className="text-left text-black block mb-1 text-sm font-medium dark:text-white">Mot de passe</label>
          <input
            id="loginPwd"
            type="password"
            className="w-full text-black px-4 py-2 border border-gray-300 rounded-sm bg-white dark:bg-gray-800 dark:text-white"
          />
          {isLogin && (
              <p className="mt-2 text-right text-sm">
                <a className="text-blue-500 font-medium hover:underline" href="/">
                  Mot de passe oublié?
                </a>
              </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 font-semibold rounded-sm bg-cyan-500 hover:bg-cyan-600 text-white"
        >
          {isLogin ? "Connexion" : "Créer un compte"}
        </button>
      </form>

      
      <p className="mt-6 text-center text-sm">
        {isLogin ? (
          <>
            <span className="text-gray-500 dark:text-white font-medium">Pas encore de compte ?{" "}</span>
            <a className="text-blue-500 font-medium hover:underline" href="/register">
              S'inscrire
            </a>
          </>
        ) : (
          <>
            <span className="text-gray-500 dark:text-white font-medium">Vous avez déjà un compte ?{" "}</span>
            <a className="text-blue-500 font-medium hover:underline" href="/">
              Se connecter
            </a>
          </>
        )}
      </p>
    </div>
  );
};