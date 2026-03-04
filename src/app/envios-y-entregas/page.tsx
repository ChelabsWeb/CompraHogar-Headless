import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Envíos y Entregas | CompraHogar",
  description: "Información sobre nuestros métodos de envío a Montevideo y al Interior.",
};

export default function EnviosYEntregas() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Envíos y Entregas
          </h1>
          <p className="text-lg text-muted-foreground">
            Llegamos a todo el país para que disfrutes de tus compras donde estés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Montevideo */}
          <div className="bg-card shadow-sm border rounded-2xl p-8 space-y-6 hover-lift">
            <div className="w-12 h-12 rounded-full bg-brand-teal/10 flex items-center justify-center text-primary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-primary">Envíos en Montevideo</h2>
            <p className="text-muted-foreground leading-relaxed">
              Realizamos entregas dentro de Montevideo mediante cadetería propia o privada. Las zonas de cobertura y los costos aproximados de envío se calcularán y detallarán al momento de completar el checkout (checkout en desarrollo).
            </p>
            <ul className="list-disc pl-5 text-muted-foreground leading-relaxed space-y-1">
              <li><strong>Plazo estimado:</strong> 24 a 48 horas hábiles tras la confirmación del pago.</li>
              <li><strong>Horarios de entrega:</strong> Lunes a Viernes de 9:00 a 18:00 hs. (Se coordinarán tramos horarios aproximados).</li>
            </ul>
          </div>

          {/* Interior del País */}
          <div className="bg-card shadow-sm border rounded-2xl p-8 space-y-6 hover-lift">
            <div className="w-12 h-12 rounded-full bg-brand-orange/10 flex items-center justify-center text-secondary mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-primary">Envíos al Interior</h2>
            <p className="text-muted-foreground leading-relaxed">
              Despachamos tu compra <strong>sin costo adicional</strong> hasta la terminal de Tres Cruces en la agencia de tu preferencia (DAC, Mirtrans, DePunta, entre otras). 
            </p>
            <ul className="list-disc pl-5 text-muted-foreground leading-relaxed space-y-1">
              <li>El costo del flete interdepartamental corre <strong>por cuenta del cliente</strong> y se abona al recibir o retirar el paquete en la agencia destino.</li>
              <li><strong>Plazo de despacho:</strong> 24 a 48 horas hábiles tras la confirmación del pago. El tiempo de llegada final depende del cronograma de cadetería de la agencia seleccionada.</li>
              <li>Al ser despachado, recibirás el número de rastreo correspondiente.</li>
            </ul>
          </div>
        </div>

        {/* Retiro en Local */}
        <div className="bg-card shadow-sm border rounded-2xl p-8 text-center space-y-4 hover-lift">
            <h2 className="text-2xl font-bold text-primary">Pick up / Retiro en Local</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              También contamos con la opción de retiro presencial en nuestro depósito o local ubicado en Montevideo. Una vez que tu pedido se encuentre procesado y listo para ser retirado, te contactaremos por WhatsApp o correo electrónico para que puedas acercarte a retirar con tu documento de identidad y número de compra.
            </p>
        </div>
      </div>
    </div>
  );
}
