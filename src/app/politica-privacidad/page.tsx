import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

export const metadata: Metadata = {
  title: "Política de privacidad | CompraHogar",
  description: "Tratamiento y protección de datos personales según la Ley 18.331 de Uruguay.",
};

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-16">
      <Container>
        <div className="pt-6 md:pt-8">
          <Breadcrumbs items={[{ label: "Política de privacidad", isLast: true }]} />
        </div>

        <div className="pt-4 md:pt-6 pb-8 max-w-3xl">
          <h1 className="text-3xl md:text-[40px] font-bold tracking-tight text-slate-900 leading-tight">
            Política de privacidad
          </h1>
          <p className="mt-3 text-slate-600 text-base md:text-lg">
            Protegemos tus datos de acuerdo a la normativa vigente.
          </p>
        </div>

        <div className="max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10 space-y-8">
          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              1. Marco legal
            </h2>
            <p className="text-slate-600 leading-relaxed">
              En CompraHogar estamos comprometidos con proteger tu privacidad y
              garantizar la seguridad de tus datos personales. El tratamiento de la
              información se realiza en estricto cumplimiento de la{" "}
              <strong className="text-slate-900">
                Ley N° 18.331 de Protección de Datos Personales y Acción de Habeas Data
              </strong>{" "}
              de Uruguay y sus decretos reglamentarios.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              2. Recopilación de información
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Recopilamos la información personal necesaria para prestar nuestros
              servicios y procesar tus pedidos: nombre completo, cédula de identidad,
              RUT (en caso de empresas), dirección de envío, teléfono de contacto y
              correo electrónico.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Los datos financieros de tarjetas se procesan de forma segura a través de
              nuestras pasarelas de pago y no se almacenan en los servidores de
              CompraHogar.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              3. Uso de la información
            </h2>
            <ul className="list-disc pl-5 text-slate-600 leading-relaxed space-y-2">
              <li>Procesar, preparar, despachar y entregar tus compras.</li>
              <li>
                Comunicarnos sobre el estado del pedido (confirmación, seguimiento,
                incidencias).
              </li>
              <li>Dar asistencia técnica y atención al cliente post-venta.</li>
              <li>
                Enviar promociones u ofertas si diste tu consentimiento expreso. Podés
                darte de baja en cualquier momento.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              4. Plataforma de comercio
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Nuestra tienda opera sobre la plataforma{" "}
              <strong className="text-slate-900">Shopify</strong>. Al realizar una
              compra, ciertos datos (nombre, dirección, email, datos del pedido) se
              almacenan y procesan en los servidores de Shopify, de acuerdo con su
              propia{" "}
              <a
                href="https://www.shopify.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                política de privacidad
              </a>
              . Shopify cumple con los estándares PCI-DSS para el manejo de datos de
              pago.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Los datos de tarjetas de crédito o débito se procesan directamente por
              las pasarelas de pago integradas en Shopify y{" "}
              <strong className="text-slate-900">
                no se almacenan en servidores propios de CompraHogar
              </strong>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              5. Protección y seguridad (SSL)
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Toda la información personal está protegida mediante certificados SSL
              (Secure Sockets Layer), garantizando que los datos se transmiten
              encriptados. Implementamos las medidas físicas, electrónicas y
              administrativas necesarias para evitar el acceso, pérdida, alteración o
              uso no autorizado de tu información.
            </p>
          </section>

          <section>
            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-3">
              6. Derechos ARCO
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Tenés derecho a ejercer los derechos de{" "}
              <strong className="text-slate-900">
                Acceso, Rectificación, Cancelación u Oposición
              </strong>{" "}
              (Derechos ARCO) respecto a tus datos personales.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Para ello, escribinos a{" "}
              <a
                href="mailto:ventas@comprahogar.com.uy"
                className="text-primary underline hover:no-underline font-medium"
              >
                ventas@comprahogar.com.uy
              </a>{" "}
              adjuntando copia de un documento que acredite tu identidad y detallando
              el derecho que querés ejercer. Respondemos en los plazos establecidos por
              la Ley N° 18.331.
            </p>
          </section>
        </div>
      </Container>
    </div>
  );
}
