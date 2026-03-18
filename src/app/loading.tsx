export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-slate-200 border-t-primary rounded-full animate-spin" />
        <span className="text-sm text-slate-400 font-medium">Cargando...</span>
      </div>
    </div>
  );
}
