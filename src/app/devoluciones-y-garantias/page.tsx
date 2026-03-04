import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devoluciones y Garantías | CompraHogar",
  description: "Política de devoluciones, cambios y cobertura de garantía para tus compras.",
};

export default function DevolucionesYGarantias() {
  return (
    <div className="min-h-screen bg-background py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl">
            Devoluciones y Garantías
          </h1>
          <p className="text-lg text-muted-foreground">
            Transparencia y respaldo en cada una de tus compras.
          </p>
        </div>

        <div className="bg-card shadow-sm border rounded-2xl p-8 sm:p-10 space-y-8 text-card-foreground">
          
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">1. Derecho de Retracto (Cambios y Devoluciones)</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              En CompraHogar cumplimos con lo establecido en el <strong>Artículo 16 de la Ley N° 17.250</strong> (Ley de Relaciones de Consumo de Uruguay). Si por alguna razón no estás satisfecho con tu compra realizada de forma no presencial, cuentas con el derecho a rescindir el contrato dentro de los <strong>5 (cinco) días hábiles</strong> posteriores a haber recibido el producto.
            </p>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <h3 className="font-semibold text-foreground mb-2">Condiciones para devoluciones:</h3>
              <ul className="list-disc pl-5 text-muted-foreground text-sm space-y-1">
                <li>El producto debe encontrarse en su empaque original, cerrado, con etiquetas y accesorios correspondientes.</li>
                <li>No debe presentar señales de uso, maltrato, golpes o instalaciones previas (ej. grifería, artículos de baño).</li>
                <li>Haber conservado el ticket o factura electrónica de la compra.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">2. Casos Especiales y Restricciones</h2>
            <p className="text-muted-foreground leading-relaxed">
              No se aceptarán devoluciones por "arrepentimiento de compra" una vez pasados los 5 días hábiles, ni sobre artículos hechos a medida (por ejemplo: cortes de cables, materiales fraccionados, pinturas preparadas a color), productos higiénicos que hayan sido desprecintados (asientos de sanitario) o artículos expuestos a liquidación y exhibidos como repuestos y/o saldos (informados previamente en su descripción).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">3. Garantías por Defectos de Fábrica</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Todos nuestros artículos de ferretería, construcción y equipamiento están respaldados por una garantía contra defectos comprobables de fabricación. El plazo de garantía varía dependiendo del componente y del importador oficial en Uruguay (generalmente indicado en la caja o ficha técnica del producto).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              La garantía <strong>no cubre</strong> daños por uso inadecuado, desgaste natural, instalaciones deficientes, accidentes, o alteraciones realizadas por terceros ajenos al fabricante o a CompraHogar.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">4. ¿Cómo Iniciar un Reclamo o Devolución?</h2>
            <ol className="list-decimal pl-5 text-muted-foreground leading-relaxed space-y-3">
              <li>
                <strong>Comunícate:</strong> Envíanos un correo o mensaje a través de WhatsApp detallando tu número de pedido, el producto afectado y el motivo de la devolución/garantía.
              </li>
              <li>
                <strong>Evidencias:</strong> Incluye fotografías nítidas o un video breve si es un reclamo por fallas de fábrica o roturas en el envío.
              </li>
              <li>
                <strong>Resolución:</strong> Nuestro equipo de servicio técnico o atención al cliente analizará el caso. Si se autoriza el cambio o si se debe enviar al importador (RMA), coordinaremos el retiro por agencia o el punto de entrega en Montevideo. Los costos de logística en casos de garantías validadas son cubiertos por la empresa.
              </li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
