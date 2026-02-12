import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="bg-gradient-to-br from-violet-600 via-blue-500 to-indigo-600 min-h-screen relative">
      {/* Orbes flottants */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 float-animation" />
      <div
        className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 float-animation"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute -bottom-8 left-1/3 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 float-animation"
        style={{ animationDelay: "4s" }}
      />

      {/* Header */}
      <nav className="glass relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <span className="text-2xl font-bold text-white">WalkmanPass</span>
            </div>
            <Link
              to="/login"
              className="bg-white text-violet-600 px-6 py-2.5 rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Commencer
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center">
          <div className="inline-block mb-4">
            <span className="glass text-white px-4 py-2 rounded-full text-sm font-medium">
              Chiffrement AES-256-GCM
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
            Vos mots de passe,
            <br />
            <span className="bg-gradient-to-r from-violet-200 to-blue-200 bg-clip-text text-transparent">
              100% sécurisés
            </span>
          </h1>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto leading-relaxed">
            Architecture zero-knowledge. Vos données sont chiffrées localement.
            <br />
            Même nous, on ne peut pas les voir.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/login"
              className="bg-white text-violet-600 px-8 py-4 rounded-xl text-lg font-bold hover:shadow-2xl hover:scale-105 transition-all duration-200 inline-flex items-center space-x-2"
            >
              <span>Créer un compte</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
            <a
              href="#features"
              className="glass text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-white/20 transition-all duration-200"
            >
              En savoir plus
            </a>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-2xl shadow-2xl hover:shadow-violet-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Chiffrement renforcé
            </h3>
            <p className="text-gray-600 leading-relaxed">
              AES-256-GCM avec IV unique. L'un des plus haut niveau de sécurité
              !
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl shadow-2xl hover:shadow-blue-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Zero-knowledge
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Vos mots de passe ne transitent jamais en clair. Architecture
              pensée pour votre confidentialité absolue.
            </p>
          </div>

          <div className="glass-card p-8 rounded-2xl shadow-2xl hover:shadow-indigo-500/20 hover:scale-105 transition-all duration-300 cursor-pointer group">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Open source
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Code transparent et auditable. La sécurité par la transparence,
              pas par l'obscurité.
            </p>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-32">
          <h2 className="text-4xl font-bold text-center text-white mb-16">
            Comment ça marche
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-purple-500 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Créez votre compte
              </h3>
              <p className="text-white/80 leading-relaxed">
                Choisissez un mot de passe fort. Vous seul le connaîtrez, jamais
                nous.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Ajoutez vos identifiants
              </h3>
              <p className="text-white/80 leading-relaxed">
                Stockez tous vos mots de passe. Chaque entrée est chiffrée
                individuellement.
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-violet-500 text-white rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Accédez partout
              </h3>
              <p className="text-white/80 leading-relaxed">
                Vos données synchronisées et accessibles depuis n'importe quel
                appareil.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="glass relative z-10 mt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-white/80 font-medium">
            2026 WalkmanPass - Hackathon Project • Built with security in mind •
            By Jacqueline, Murtaza and Julien •
          </p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
