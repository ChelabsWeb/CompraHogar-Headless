import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | CompraHogar",
  description: "Tratamiento y protección de datos personales en CompraHogar.",
};

export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Política de Privacidad
          </h1>
          <p className="text-lg text-muted-foreground">
            Protegemos tus datos de acuerdo a la normativa vigente.
          </p>
        </div>

        <div className="bg-card shadow-sm border rounded-2xl p-8 sm:p-10 space-y-8 text-card-foreground">
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">1. Marco Legal</h2>
            <p className="text-muted-foreground leading-relaxed">
              En CompraHogar estamos comprometidos con proteger su privacidad y garantizar la seguridad de sus datos personales. El tratamiento de la información personal se realiza en estricto cumplimiento de la <strong>Ley N° 18.331 de Protección de Datos Personales y Acción de Habeas Data</strong> de la República Oriental del Uruguay y sus decretos reglamentarios.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">2. Recopilación de la Información</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Recopilamos la información personal necesaria para la correcta prestación de nuestros servicios y para procesar sus pedidos. Esto puede incluir, sin limitarse a: nombre completo, cédula de identidad, RUT (en caso de empresas), dirección de envío, teléfono de contacto y correo electrónico.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Los datos financieros de tarjetas de crédito o débito son procesados de forma segura a través de nuestras pasarelas de pago y no se almacenan en los servidores de CompraHogar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">3. Uso de la Información</h2>
            <ul className="list-disc pl-5 text-muted-foreground leading-relaxed space-y-2">
              <li>Procesar, preparar, despachar y entregar sus compras de manera eficiente.</li>
              <li>Comunicarnos respecto al estado de su pedido (confirmación, seguimiento, incidencias).</li>
              <li>Proveer asistencia técnica o atención al cliente post-venta.</li>
              <li>Enviar información sobre promociones u ofertas especiales, siempre que el usuario haya dado su consentimiento expreso y pueda darse de baja en cualquier momento.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">4. Protección y Seguridad (SSL)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Toda la información personal suministrada se encuentra protegida mediante certificados de seguridad SSL (Secure Sockets Layer), garantizando que los datos introducidos se transmiten encriptados. Implementamos las medidas físicas, electrónicas y administrativas necesarias para evitar el acceso, pérdida, alteración o uso no autorizado de su información.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">5. Derechos ARCO</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Usted tiene derecho a ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición (Derechos ARCO) respecto a sus datos personales. 
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Para ello, puede comunicarse con nosotros enviando un correo a <strong>ventas@comprahogar.com.uy</strong> acompañando una copia de un documento que acredite su identidad y detallando el derecho que desea ejercer. Responderemos a su solicitud en los plazos establecidos por la Ley N° 18.331.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
