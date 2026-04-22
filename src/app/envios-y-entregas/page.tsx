import type { Metadata } from "next";
import { MapPin, Truck, Package } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Envíos y entregas | CompraHogar",
  description: "Tarifas, zonas y plazos de envío en Montevideo, zona metropolitana e interior del Uruguay.",
};

export default function EnviosYEntregas() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-16">
      <Container>
        <div className="pt-6 md:pt-8">
          <Breadcrumbs items={[{ label: "Envíos y entregas", isLast: true }]} />
        </div>

        <div className="pt-4 md:pt-6 pb-8 max-w-3xl">
          <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-slate-900 leading-tight">
            Envíos y entregas
          </h1>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Llegamos a todo el país para que disfrutes de tus compras donde estés.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Montevideo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
              <MapPin className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
              Envíos en Montevideo
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Realizamos entregas dentro de Montevideo y zona metropolitana mediante
              cadetería propia o privada.
            </p>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Tarifas</h3>
              <ul className="text-[13px] text-slate-600 space-y-1.5">
                <li>
                  <span className="font-medium text-slate-900">Montevideo:</span> $250
                </li>
                <li>
                  <span className="font-medium text-slate-900">Zona metropolitana</span>{" "}
                  (Ciudad de la Costa, Las Piedras, La Paz, Barros Blancos, Pando): $350
                </li>
              </ul>
              <p className="text-[13px] text-primary font-semibold pt-2 mt-2 border-t border-slate-200">
                Envío gratis en compras superiores a $4.000
              </p>
            </div>
            <ul className="text-[14px] text-slate-600 space-y-2 leading-relaxed">
              <li>
                <span className="font-semibold text-slate-900">Plazo estimado:</span> 24 a 48
                horas hábiles tras la confirmación del pago.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Horarios:</span> lunes a viernes
                de 9:00 a 18:00 hs. Coordinamos tramo horario aproximado.
              </li>
            </ul>
          </div>

          {/* Interior */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
            <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-4">
              <Truck className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
              Envíos al interior
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Llegamos a los 19 departamentos. Despachamos tu compra hasta la terminal
              de Tres Cruces en la agencia de tu preferencia (DAC, Mirtrans, DePunta,
              entre otras).
            </p>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 mb-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Tarifas</h3>
              <ul className="text-[13px] text-slate-600 space-y-1.5">
                <li>
                  <span className="font-medium text-slate-900">
                    Canelones, San José, Colonia, Maldonado, Florida:
                  </span>{" "}
                  $400
                </li>
                <li>
                  <span className="font-medium text-slate-900">Resto del interior:</span>{" "}
                  $550 (Salto, Paysandú, Rivera, Tacuarembó, Cerro Largo, Rocha, Lavalleja,
                  Durazno, Flores, Soriano, Río Negro, Treinta y Tres, Artigas)
                </li>
              </ul>
              <p className="text-[13px] text-primary font-semibold pt-2 mt-2 border-t border-slate-200">
                Envío gratis en compras superiores a $4.000
              </p>
            </div>
            <ul className="text-[14px] text-slate-600 space-y-2 leading-relaxed">
              <li>
                El despacho hasta Tres Cruces no tiene costo adicional. El flete
                interdepartamental se abona al retirar en destino.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Plazo de despacho:</span> 24 a
                48 horas hábiles tras la confirmación del pago. El tiempo final depende
                del cronograma de la agencia.
              </li>
              <li>Al despachar recibís el número de rastreo por email.</li>
            </ul>
          </div>
        </div>

        {/* Pick up */}
        <div className="mt-4 md:mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Package className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0">
              <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-2">
                Retiro en local
              </h2>
              <p className="text-slate-600 leading-relaxed">
                También podés retirar tu pedido en nuestro depósito de Montevideo. Cuando
                esté listo te contactamos por WhatsApp o email para que pases con tu
                documento y número de compra.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
