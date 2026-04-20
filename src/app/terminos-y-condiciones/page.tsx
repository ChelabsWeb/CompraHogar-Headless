import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Términos y condiciones | CompraHogar",
  description: "Términos y condiciones de uso del sitio web de CompraHogar según la normativa uruguaya.",
};

export default function TerminosYCondiciones() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-16">
      <Container>
        <div className="pt-6 md:pt-8">
          <Breadcrumbs items={[{ label: "Términos y condiciones", isLast: true }]} />
        </div>

        <div className="pt-4 md:pt-6 pb-8 max-w-3xl">
          <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-slate-900 leading-tight">
            Términos y condiciones
          </h1>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Última actualización: abril 2026
          </p>
        </div>

        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              1. Aspectos generales
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Bienvenido/a a CompraHogar. Estos Términos y Condiciones regulan el uso
              del sitio web y la adquisición de productos ofrecidos. Al acceder y
              operar en este sitio, aceptás haber leído, entendido y estar de acuerdo
              con estos términos.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Se rigen por la normativa vigente de la República Oriental del Uruguay,
              en particular la{" "}
              <strong className="text-slate-900">Ley N° 17.250</strong> (Relaciones de
              Consumo) y la{" "}
              <strong className="text-slate-900">Ley N° 18.331</strong> (Protección de
              Datos Personales y Acción de Habeas Data).
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              2. Capacidad de los usuarios
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Los servicios están disponibles para personas con capacidad legal para
              contratar según la legislación uruguaya. No pueden operar los menores de
              edad ni personas suspendidas temporalmente o inhabilitadas
              definitivamente.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              3. Proceso de compra y precios
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Todos los precios están expresados en pesos uruguayos (UYU) o dólares
              estadounidenses (USD) según corresponda, e incluyen IVA.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Nos reservamos el derecho de modificar precios en cualquier momento. Los
              productos se facturan a la tarifa vigente en el momento en que se
              registre y confirme el pedido, sujeto a disponibilidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              4. Derecho de retracto
            </h2>
            <p className="text-slate-600 leading-relaxed">
              En cumplimiento del{" "}
              <strong className="text-slate-900">Artículo 16 de la Ley N° 17.250</strong>,
              el consumidor tiene derecho a rescindir/resolver el contrato en un plazo
              de 5 días hábiles desde la formalización o la entrega del producto, lo
              que ocurra en último lugar. Aplican excepciones para productos a medida,
              usados o de higiene personal.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              5. Propiedad intelectual
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Todo el contenido del sitio (textos, gráficos, logos, íconos, imágenes y
              software) es propiedad de CompraHogar y está protegido por las leyes de
              propiedad intelectual de Uruguay. Queda prohibida la reproducción parcial
              o total sin autorización expresa por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              6. Modificaciones
            </h2>
            <p className="text-slate-600 leading-relaxed">
              CompraHogar se reserva el derecho de modificar estos Términos y
              Condiciones en cualquier momento, publicándolos en el sitio. Los cambios
              entran en vigor a los 10 días de su publicación.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
