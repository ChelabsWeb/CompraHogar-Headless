import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones | CompraHogar",
  description: "Términos y condiciones de uso del sitio web de CompraHogar de acuerdo a la normativa uruguaya.",
};

export default function TerminosYCondiciones() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="text-lg text-muted-foreground">
            Última actualización: Marzo 2026
          </p>
        </div>

        <div className="bg-card shadow-sm border rounded-2xl p-8 sm:p-10 space-y-8 text-card-foreground">
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">1. Aspectos Generales</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bienvenido/a a CompraHogar. Los presentes Términos y Condiciones regulan el uso de nuestro sitio web y la adquisición de productos ofrecidos en el mismo. Al acceder y operar en este sitio, usted acepta haber leído, entendido y estar de acuerdo con estos términos.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Estos términos se rigen por la normativa vigente de la República Oriental del Uruguay, en particular la <strong>Ley de Relaciones de Consumo N° 17.250</strong> y la Ley de Protección de Datos Personales y Acción de Habeas Data N° 18.331.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">2. Capacidad de los Usuarios</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los servicios de CompraHogar están disponibles solo para aquellas personas que tengan capacidad legal para contratar según la legislación uruguaya. No podrán utilizar los servicios los menores de edad o personas que hayan sido suspendidas temporalmente o inhabilitadas definitivamente.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">3. Proceso de Compra y Precios</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Todos los precios de los productos publicados están expresados en Pesos Uruguayos (UYU) o Dólares Estadounidenses (USD) según corresponda, y ya incluyen el Impuesto al Valor Agregado (IVA).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Nos reservamos el derecho de modificar los precios en cualquier momento. Sin embargo, los productos se facturarán en base a las tarifas vigentes en el momento exacto en que se registre y confirme el pedido, sujeto a la disponibilidad de dicho producto.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">4. Derecho de Retracto</h2>
            <p className="text-muted-foreground leading-relaxed">
              En cumplimiento con el <strong>Artículo 16 de la Ley N° 17.250</strong>, el consumidor tiene derecho a rescindir/resolver el contrato en un plazo de 5 días hábiles contados desde la formalización del contrato o la entrega del producto, lo que ocurra en último lugar. Ciertas excepciones aplican para productos a medida, usados o de higiene personal.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">5. Propiedad Intelectual</h2>
            <p className="text-muted-foreground leading-relaxed">
              Todo el contenido incluido en este sitio como textos, gráficos, logos, íconos de botones, imágenes y el software, es propiedad de CompraHogar y está protegido por las leyes de propiedad intelectual de Uruguay. Está estrictamente prohibida la reproducción parcial o total del sitio sin nuestra autorización expresa y por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">6. Modificaciones de los Términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              CompraHogar se reserva el derecho de modificar estos Términos y Condiciones en cualquier momento, haciéndolo público en el sitio web. Los términos modificados entrarán en vigor a los 10 días desde su publicación.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
