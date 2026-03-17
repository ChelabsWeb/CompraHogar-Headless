import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 bg-white">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Gran Título 404 con Gradiente */}
        <h1 className="text-9xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 drop-shadow-sm">
          404
        </h1>

        {/* Texto Amigable */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight sm:text-3xl">¡Ups!</h2>
          <p className="text-base sm:text-lg text-gray-600">
            Oops, la página que buscas no existe o fue movida.
          </p>
        </div>

        {/* Botones de Acción */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-semibold rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 focus:ring-offset-white transition-all shadow-sm active:scale-[0.98]"
          >
            Ir al Inicio
          </Link>
          <Link
            href="/collections"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 focus:ring-offset-white transition-all shadow-sm active:scale-[0.98]"
          >
            Ver Catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
