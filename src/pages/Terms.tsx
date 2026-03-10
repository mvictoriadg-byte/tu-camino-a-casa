import { Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoHouse from "@/assets/logo-house.png";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl flex items-center justify-between h-14 px-4 sm:px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center">
              <Home className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight">Tu camino a casa</span>
          </button>
          <Button size="sm" variant="ghost" className="rounded-full font-semibold" onClick={() => navigate(-1 as any)}>
            <ArrowLeft className="h-4 w-4 mr-1.5" /> Volver
          </Button>
        </div>
      </nav>

      <main className="container max-w-3xl py-10 px-4 sm:px-6">
        <h1 className="text-3xl font-extrabold mb-8 tracking-tight">Términos y Condiciones Generales</h1>
        <p className="text-sm text-muted-foreground mb-6">Última actualización: 8 de marzo de 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          <h2>1. Información general</h2>
          <p>
            La plataforma <strong>Tu camino a casa</strong> (en adelante, "la Plataforma") es un servicio digital que ofrece herramientas de simulación y planificación financiera orientadas a la compra de vivienda en España. El uso de la Plataforma implica la aceptación íntegra de los presentes Términos y Condiciones.
          </p>

          <h2>2. Objeto del servicio</h2>
          <p>
            La Plataforma proporciona cálculos estimativos y orientativos sobre ahorro, hipotecas y acceso a la vivienda. Los resultados generados <strong>no constituyen asesoramiento financiero, legal ni inmobiliario</strong>. Se recomienda siempre consultar con profesionales cualificados antes de tomar decisiones económicas.
          </p>

          <h2>3. Registro y cuenta de usuario</h2>
          <p>
            Para acceder a funcionalidades personalizadas (guardar planes, wishlist de propiedades), el usuario deberá crear una cuenta proporcionando información veraz. El usuario es responsable de la confidencialidad de sus credenciales de acceso.
          </p>

          <h2>4. Uso aceptable</h2>
          <p>El usuario se compromete a:</p>
          <ul>
            <li>Utilizar la Plataforma de forma lícita y conforme a estos Términos.</li>
            <li>No introducir datos falsos o fraudulentos.</li>
            <li>No intentar acceder a sistemas o datos de otros usuarios.</li>
            <li>No reproducir, distribuir o explotar comercialmente el contenido sin autorización.</li>
          </ul>

          <h2>5. Propiedad intelectual</h2>
          <p>
            Todos los contenidos de la Plataforma (textos, imágenes, diseños, código, marcas) están protegidos por derechos de propiedad intelectual e industrial. Queda prohibida su reproducción sin consentimiento expreso.
          </p>

          <h2>6. Limitación de responsabilidad</h2>
          <p>
            La Plataforma se ofrece "tal cual" sin garantías de ningún tipo. No nos responsabilizamos de decisiones financieras tomadas en base a los cálculos proporcionados, ni de la disponibilidad ininterrumpida del servicio.
          </p>

          <h2>7. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos en cualquier momento. Los cambios serán efectivos desde su publicación en la Plataforma. El uso continuado tras la modificación implica la aceptación de los nuevos términos.
          </p>

          <hr className="border-border my-8" />

          <h1 className="text-2xl font-extrabold mt-10 mb-6">Política de Protección de Datos Personales</h1>

          <h2>8. Responsable del tratamiento</h2>
          <p>
            El responsable del tratamiento de los datos personales recogidos a través de la Plataforma es <strong>Tu camino a casa</strong>, con domicilio en España.
          </p>

          <h2>9. Normativa aplicable</h2>
          <p>El tratamiento de datos personales se rige por:</p>
          <ul>
            <li><strong>Reglamento General de Protección de Datos (RGPD)</strong> — Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, de 27 de abril de 2016.</li>
            <li><strong>Ley Orgánica 3/2018, de 5 de diciembre</strong>, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD) de España.</li>
            <li><strong>Ley 34/2002, de 11 de julio</strong>, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).</li>
          </ul>

          <h2>10. Datos que recopilamos</h2>
          <p>Podemos recopilar los siguientes datos personales:</p>
          <ul>
            <li><strong>Datos de registro:</strong> dirección de correo electrónico, nombre de usuario.</li>
            <li><strong>Datos financieros simulados:</strong> ingresos, ahorros, deudas y preferencias de vivienda introducidos voluntariamente para la simulación.</li>
            <li><strong>Datos de navegación:</strong> dirección IP, tipo de navegador, páginas visitadas, mediante cookies y tecnologías similares.</li>
          </ul>

          <h2>11. Finalidad del tratamiento</h2>
          <p>Los datos se tratan para las siguientes finalidades:</p>
          <ul>
            <li>Prestación del servicio de simulación y planificación financiera.</li>
            <li>Gestión de la cuenta de usuario.</li>
            <li>Mejora y personalización de la experiencia del usuario.</li>
            <li>Cumplimiento de obligaciones legales.</li>
          </ul>

          <h2>12. Base legal del tratamiento</h2>
          <ul>
            <li><strong>Consentimiento del interesado</strong> (Art. 6.1.a RGPD): al crear una cuenta y utilizar la Plataforma.</li>
            <li><strong>Ejecución de un contrato</strong> (Art. 6.1.b RGPD): para la prestación del servicio solicitado.</li>
            <li><strong>Interés legítimo</strong> (Art. 6.1.f RGPD): para la mejora del servicio y seguridad de la Plataforma.</li>
          </ul>

          <h2>13. Conservación de datos</h2>
          <p>
            Los datos se conservarán durante el tiempo necesario para cumplir con la finalidad para la que fueron recogidos, y mientras existan obligaciones legales que exijan su conservación. El usuario puede solicitar la eliminación de su cuenta y datos en cualquier momento.
          </p>

          <h2>14. Cesión de datos a terceros</h2>
          <p>
            No se cederán datos personales a terceros salvo obligación legal. Los datos pueden ser tratados por encargados del tratamiento (proveedores de infraestructura tecnológica) con las debidas garantías contractuales conforme al Art. 28 del RGPD.
          </p>

          <h2>15. Transferencias internacionales</h2>
          <p>
            En caso de transferencia de datos fuera del Espacio Económico Europeo, se aplicarán las garantías adecuadas conforme al Capítulo V del RGPD, incluyendo cláusulas contractuales tipo aprobadas por la Comisión Europea.
          </p>

          <h2>16. Derechos del interesado</h2>
          <p>De conformidad con el RGPD y la LOPDGDD, el usuario tiene derecho a:</p>
          <ul>
            <li><strong>Acceso</strong> a sus datos personales.</li>
            <li><strong>Rectificación</strong> de datos inexactos o incompletos.</li>
            <li><strong>Supresión</strong> ("derecho al olvido").</li>
            <li><strong>Limitación</strong> del tratamiento.</li>
            <li><strong>Portabilidad</strong> de sus datos.</li>
            <li><strong>Oposición</strong> al tratamiento.</li>
            <li><strong>No ser objeto de decisiones automatizadas</strong>, incluida la elaboración de perfiles.</li>
          </ul>
          <p>
            Para ejercer estos derechos, el usuario podrá contactarnos a través de los canales habilitados en la Plataforma. Asimismo, tiene derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong> — <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" className="text-primary underline">www.aepd.es</a>.
          </p>

          <h2>17. Seguridad</h2>
          <p>
            Implementamos medidas técnicas y organizativas adecuadas para proteger los datos personales contra el acceso no autorizado, la alteración, la divulgación o la destrucción, conforme al Art. 32 del RGPD.
          </p>

          <h2>18. Cookies</h2>
          <p>
            La Plataforma puede utilizar cookies propias y de terceros para mejorar la experiencia del usuario. El usuario puede configurar su navegador para rechazar cookies, aunque esto puede afectar a la funcionalidad del servicio.
          </p>

          <h2>19. Legislación y jurisdicción aplicable</h2>
          <p>
            Estos Términos y la Política de Protección de Datos se rigen por la legislación española y europea. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales competentes conforme a la normativa vigente.
          </p>

          <hr className="border-border my-8" />
          <p className="text-xs text-muted-foreground">
            Si tienes cualquier pregunta sobre estos términos o el tratamiento de tus datos personales, no dudes en contactarnos a través de la Plataforma.
          </p>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="container max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center">
              <Home className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="font-bold text-sm">Tu camino a casa</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>© 2026 Tu camino a casa · España</span>
            <span>·</span>
            <a href="/terminos" className="underline hover:text-primary transition-colors">Términos y Condiciones</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms;
