import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Devoluciones y garantías | CompraHogar",
  description: "Política de devoluciones, cambios y cobertura de garantía de acuerdo a la Ley 17.250 de Uruguay.",
};

export default function DevolucionesYGarantias() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-16">
      <Container>
        <div className="pt-6 md:pt-8">
          <Breadcrumbs items={[{ label: "Devoluciones y garantías", isLast: true }]} />
        </div>

        <div className="pt-4 md:pt-6 pb-8 max-w-3xl">
          <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-slate-900 leading-tight">
            Devoluciones y garantías
          </h1>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Transparencia y respaldo en cada una de tus compras.
          </p>
        </div>

        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              1. Derecho de retracto
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              En CompraHogar cumplimos con lo establecido en el{" "}
              <strong className="text-slate-900">Artículo 16 de la Ley N° 17.250</strong>{" "}
              (Ley de Relaciones de Consumo de Uruguay). Si por alguna razón no estás
              satisfecho con tu compra, podés rescindir el contrato dentro de los{" "}
              <strong className="text-slate-900">5 días hábiles</strong> posteriores a
              recibir el producto.
            </p>
            <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">
                Condiciones para la devolución
              </h3>
              <ul className="list-disc pl-5 text-slate-600 text-[14px] space-y-1.5">
                <li>
                  El producto debe estar en su empaque original, cerrado, con etiquetas
                  y accesorios correspondientes.
                </li>
                <li>
                  No debe presentar señales de uso, maltrato, golpes o instalaciones
                  previas (ej: grifería, artículos de baño).
                </li>
                <li>Conservá el ticket o factura electrónica de la compra.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              2. Casos especiales y restricciones
            </h2>
            <p className="text-slate-600 leading-relaxed">
              No se aceptan devoluciones por arrepentimiento una vez pasados los 5 días
              hábiles, ni sobre artículos hechos a medida (cortes de cables, materiales
              fraccionados, pinturas preparadas a color), productos higiénicos
              desprecintados (asientos de sanitario) o artículos expuestos a liquidación
              y exhibidos como repuestos o saldos (informados previamente en la
              descripción).
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              3. Garantías por defectos de fábrica
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Todos nuestros artículos de ferretería, construcción y equipamiento están
              respaldados por una garantía contra defectos comprobables de fabricación.
              El plazo varía según el componente y el importador oficial en Uruguay
              (generalmente indicado en la caja o ficha técnica).
            </p>
            <p className="text-slate-600 leading-relaxed">
              La garantía <strong className="text-slate-900">no cubre</strong> daños por
              uso inadecuado, desgaste natural, instalaciones deficientes, accidentes ni
              alteraciones realizadas por terceros ajenos al fabricante o a CompraHogar.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              4. Cómo iniciar un reclamo
            </h2>
            <ol className="list-decimal pl-5 text-slate-600 leading-relaxed space-y-2.5">
              <li>
                <span className="font-semibold text-slate-900">Comunicate:</span>{" "}
                enviános un email o un mensaje por WhatsApp con tu número de pedido, el
                producto afectado y el motivo.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Evidencias:</span> sumá
                fotos nítidas o un video breve si el reclamo es por fallas de fábrica o
                roturas en el envío.
              </li>
              <li>
                <span className="font-semibold text-slate-900">Resolución:</span> nuestro
                equipo analiza el caso. Si se autoriza el cambio o hay que enviar al
                importador (RMA), coordinamos el retiro por agencia o el punto de
                entrega en Montevideo. Los costos de logística en garantías validadas
                los cubrimos nosotros.
              </li>
            </ol>
          </section>
        </div>
      </Container>
    </div>
  );
}
