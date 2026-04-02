/**
 * Microlearning content mapped by step title.
 * Each entry has a modal title and sections with heading + body.
 */

export interface MicrolearningEntry {
  title: string;
  sections: { heading: string; body: string }[];
}

export const STEP_MICROLEARNING: Record<string, MicrolearningEntry> = {
  /* ══════════════════════════════════════════
     BLOQUE 1 — Entiende cuánto puedes comprar
     ══════════════════════════════════════════ */
  "Definir tu presupuesto máximo de compra": {
    title: "Cómo definir tu presupuesto máximo de compra",
    sections: [
      {
        heading: "¿Qué incluye el coste real?",
        body: "Definir tu presupuesto no es solo mirar el precio de la vivienda. Comprar una casa implica varios costes que no siempre son evidentes al inicio.\n\nEn España, el banco normalmente financia hasta el 80% del valor de la vivienda. Esto significa que tú debes aportar el 20% restante como entrada. A esto se suman aproximadamente un 10% adicional en gastos (impuestos, notaría, registro, gestoría).",
      },
      {
        heading: "Ejemplo práctico",
        body: "Para una vivienda de 200.000€, necesitarías unos 60.000€ ahorrados:\n\n• Entrada (20%): 40.000€\n• Gastos (~10%): 20.000€\n\n👉 Precio de vivienda ≠ coste real total",
      },
      {
        heading: "Tu presupuesto real incluye",
        body: "• Precio de la vivienda\n• Entrada (20%)\n• Gastos (~10%: impuestos, notaría, registro, gestoría)\n\nTener claro este número desde el principio te evita sorpresas y te permite buscar con criterio.",
      },
    ],
  },

  "Calcular cuota mensual cómoda": {
    title: "Cómo se calcula la cuota hipotecaria",
    sections: [
      {
        heading: "¿Qué determina tu cuota?",
        body: "La cuota hipotecaria es el pago mensual que harás durante muchos años, por lo que es clave que sea sostenible.\n\nSe calcula en base a:\n• Importe del préstamo\n• Tipo de interés\n• Plazo (20–30 años)",
      },
      {
        heading: "La regla del 30-35%",
        body: "👉 Tu cuota máxima no debería superar el 30-35% de tu sueldo neto.\n\nEsto permite mantener estabilidad financiera y que el banco apruebe tu solicitud sin problemas.",
      },
      {
        heading: "El efecto del plazo",
        body: "Cuanto más largo el plazo, menor será la cuota mensual, pero pagarás más intereses en total.\n\nPor ejemplo, un préstamo de 160.000€ al 3%:\n• A 25 años → ~759€/mes\n• A 30 años → ~674€/mes\n\nLa diferencia mensual parece pequeña, pero a lo largo de la vida del préstamo supone miles de euros.",
      },
    ],
  },

  "Calcular cuánto puedes permitirte": {
    title: "Cómo calcular tu capacidad de compra",
    sections: [
      {
        heading: "La regla del 30-35%",
        body: "Los bancos suelen aprobar hipotecas cuya cuota no supere el 30-35% de tus ingresos netos mensuales. Si ganas 2.000€/mes, tu cuota máxima sería de unos 600-700€.",
      },
      {
        heading: "Ahorros necesarios",
        body: "Normalmente necesitas tener ahorrado al menos el 20% del precio de la vivienda (entrada) más un 10-12% adicional para impuestos y gastos.",
      },
      {
        heading: "Las ayudas cambian la ecuación",
        body: "Dependiendo de tu edad, ingresos y comunidad autónoma, puedes acceder a avales públicos, subvenciones o deducciones fiscales que reducen significativamente la cantidad que necesitas ahorrar.",
      },
    ],
  },

  "Validar estabilidad de ingresos": {
    title: "Cómo valida el banco tu estabilidad",
    sections: [
      {
        heading: "¿Qué analiza el banco?",
        body: "El banco analiza tu perfil para asegurarse de que podrás pagar la hipoteca a largo plazo.\n\nEvalúa:\n• Tipo de contrato (fijo vs temporal)\n• Antigüedad en el empleo\n• Estabilidad de ingresos\n• Historial financiero",
      },
      {
        heading: "No solo miran cuánto ganas",
        body: "👉 El banco NO mira solo ingresos → mira riesgo.\n\nLo importante no es solo cuánto ganas, sino la seguridad de esos ingresos. Un contrato fijo con 2 años de antigüedad vale más que un sueldo alto pero inestable.",
      },
    ],
  },

  "Estimar precio de vivienda": {
    title: "Cómo estimar el precio de tu vivienda",
    sections: [
      {
        heading: "Precio por metro cuadrado",
        body: "Los precios varían enormemente según la zona. Conocer el precio medio por m² de tu zona objetivo te da un punto de partida realista.",
      },
      {
        heading: "Factores que afectan al precio",
        body: "• Ubicación y barrio\n• Estado de la vivienda (nueva vs segunda mano)\n• Planta y orientación\n• Zonas comunes y servicios\n• Transporte y conexiones",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 2 — Calcula cuánto necesitas
     ══════════════════════════════════════════ */
  "Calcular objetivo total de ahorro": {
    title: "Cuánto necesitas ahorrar en total",
    sections: [
      {
        heading: "La fórmula básica",
        body: "En España necesitarás aproximadamente el 30% del valor de la vivienda:\n\n• 20% → entrada\n• ~10% → gastos (impuestos, notaría, registro, gestoría)",
      },
      {
        heading: "¿30% o más?",
        body: "Normalmente 30% es suficiente. Más solo si:\n• No accedes a ayudas públicas\n• Quieres reducir la hipoteca para pagar menos intereses\n• El banco te pide más entrada por tu perfil",
      },
    ],
  },

  "Separar entrada vs gastos": {
    title: "Entrada y gastos: ¿cuál es la diferencia?",
    sections: [
      {
        heading: "Entrada",
        body: "La entrada es la parte del precio que pagas de tu bolsillo. Reduce directamente el importe de tu hipoteca. Cuanta más entrada aportes, menos pedirás prestado y menos intereses pagarás.",
      },
      {
        heading: "Gastos",
        body: "Los gastos son costes obligatorios que no reducen el préstamo:\n• Impuesto de Transmisiones Patrimoniales (ITP) o IVA\n• Notaría\n• Registro de la Propiedad\n• Gestoría\n\n👉 Ambos deben estar disponibles antes de firmar.",
      },
    ],
  },

  "Construir la entrada": {
    title: "Cómo construir tu entrada paso a paso",
    sections: [
      {
        heading: "Automatiza tu ahorro",
        body: "Configura una transferencia automática mensual a una cuenta separada. Incluso 200-300€/mes se acumulan: en 3 años tendrás 7.200-10.800€.",
      },
      {
        heading: "Lo importante es la constancia",
        body: "No necesitas el 100% del dinero de golpe. Con constancia, la entrada se construye sola. El banco valora positivamente ver un historial de ahorro regular.",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 3 — Descubre ayudas
     ══════════════════════════════════════════ */
  "Identificar ayudas públicas": {
    title: "Ayudas públicas para comprar vivienda",
    sections: [
      {
        heading: "¿De qué tratan?",
        body: "Las ayudas públicas buscan facilitar el acceso a la vivienda. Pueden:\n• Reducir el ahorro necesario\n• Permitir mayor financiación\n• Mejorar condiciones de la hipoteca",
      },
      {
        heading: "Edad límite",
        body: "Muchas ayudas están enfocadas en menores de 35 años.\n\n👉 Es clave revisarlas cuanto antes para no perderlas.",
      },
      {
        heading: "Cómo aplicar",
        body: "Depende del tipo:\n• Aval → se solicita en el banco\n• Subvención → comunidad autónoma\n• Deducción → declaración de la renta",
      },
      {
        heading: "Plazos importantes",
        body: "Muchas ayudas tienen convocatorias con presupuesto limitado.\n\n👉 Si no aplicas a tiempo, puedes perderlas.",
      },
    ],
  },

  "Identificar requisitos clave": {
    title: "Requisitos clave para acceder a ayudas",
    sections: [
      {
        heading: "Requisitos comunes",
        body: "• Ingresos máximos (varían por comunidad)\n• Primera vivienda\n• Ubicación de la vivienda\n• Edad del comprador",
      },
      {
        heading: "🏡 Aval ICO",
        body: "Permite financiar hasta el 100%. El Estado avala parte del préstamo, reduciendo el riesgo del banco.\n\nRequisitos:\n• Menor de 35 años\n• Primera vivienda\n• Ingresos dentro de límites\n\n👉 Se solicita en el banco.",
      },
      {
        heading: "💸 Ayudas autonómicas",
        body: "Subvenciones directas que cubren parte del coste o la entrada. Dependen de la comunidad, ingresos y ubicación.\n\n👉 Se solicitan por convocatoria pública.",
      },
      {
        heading: "🧾 Deducciones fiscales",
        body: "Beneficios fiscales tras la compra que reducen tus impuestos en el tiempo.",
      },
    ],
  },

  "Ver ayudas aplicables a su perfil": {
    title: "Ayudas aplicables a tu perfil",
    sections: [
      {
        heading: "¿De qué tratan?",
        body: "Las ayudas públicas buscan facilitar el acceso a la vivienda. Pueden:\n• Reducir el ahorro necesario\n• Permitir mayor financiación\n• Mejorar condiciones",
      },
      {
        heading: "Tipos principales",
        body: "🏡 Aval ICO: Financiación hasta el 100%. El Estado avala parte del préstamo.\n\n💸 Ayudas autonómicas: Subvenciones directas por convocatoria pública.\n\n🧾 Deducciones fiscales: Reducen impuestos tras la compra.",
      },
      {
        heading: "Plazos",
        body: "Muchas ayudas tienen convocatorias con presupuesto limitado. Si no aplicas a tiempo, puedes perderlas.",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 4 — Entiende tu hipoteca
     ══════════════════════════════════════════ */
  "Elegir tipo de hipoteca": {
    title: "Tipos de hipoteca: ¿cuál elegir?",
    sections: [
      {
        heading: "Tipo fijo",
        body: "La cuota no cambia nunca. Te da estabilidad y previsibilidad. Ideal si valoras la tranquilidad de saber siempre cuánto pagas.",
      },
      {
        heading: "Tipo variable",
        body: "La cuota se recalcula cada 6 o 12 meses según el Euríbor. Puede subir o bajar. Históricamente más barata, pero con más riesgo.",
      },
      {
        heading: "Tipo mixto",
        body: "Fija los primeros años (3-10), variable después. Un punto medio entre estabilidad y ahorro potencial.",
      },
      {
        heading: "TIN vs TAE",
        body: "TIN = interés puro del préstamo.\nTAE = coste total anual (incluye comisiones y gastos).\n\n👉 Compara siempre la TAE entre ofertas.",
      },
      {
        heading: "¿Qué esperar de la llamada con un banco?",
        body: "Te pedirán ingresos, ahorros y deudas para hacer una simulación inicial. No te compromete a nada.",
      },
    ],
  },

  "Porcentajes a financiar": {
    title: "¿Cuánto puede financiar el banco?",
    sections: [
      {
        heading: "Lo habitual: 80%",
        body: "La mayoría de bancos financian hasta el 80% del valor de tasación de la vivienda.",
      },
      {
        heading: "¿Puedo conseguir más?",
        body: "Sí, según tu perfil, ayudas disponibles y si usas un broker hipotecario. En algunos casos se puede llegar al 90% o incluso 100%.",
      },
    ],
  },

  "Negociación con bancos": {
    title: "Cómo negociar con los bancos",
    sections: [
      {
        heading: "¿Qué se puede negociar?",
        body: "• Tipo de interés\n• Comisiones (apertura, amortización anticipada)\n• Productos vinculados (seguros, domiciliación de nómina)\n• Plazo del préstamo",
      },
      {
        heading: "Consejos clave",
        body: "Compara al menos 3 ofertas. El banco espera que negocies — es parte del proceso. Un broker puede negociar por ti.",
      },
    ],
  },

  "Entender financiación 80/90/100": {
    title: "Financiación al 80%, 90% o 100%",
    sections: [
      {
        heading: "80% estándar",
        body: "El banco financia el 80% y tú aportas el 20% restante como entrada.",
      },
      {
        heading: "90%: perfil sólido",
        body: "Algunos bancos ofrecen 90% si tienes contrato fijo, antigüedad, sin deudas y buen historial de ahorro.",
      },
      {
        heading: "100%: casos especiales",
        body: "Posible con viviendas de bancos, programas de aval ICO para jóvenes, o aval familiar con propiedad libre de cargas.",
      },
    ],
  },

  "Qué es el pre-scoring": {
    title: "¿Qué es el pre-scoring bancario?",
    sections: [
      {
        heading: "Evaluación inicial",
        body: "El pre-scoring es una evaluación rápida que hace el banco para determinar si tu perfil es viable para una hipoteca. No es vinculante pero te da una idea clara de tus posibilidades.",
      },
      {
        heading: "¿Qué evalúan?",
        body: "• Ingresos y estabilidad laboral\n• Deudas existentes\n• Historial crediticio\n• Ahorros disponibles",
      },
    ],
  },

  "Tasación": {
    title: "La tasación de la vivienda",
    sections: [
      {
        heading: "¿Qué es?",
        body: "La tasación es una valoración oficial de la vivienda realizada por un tasador certificado. Define cuánto dinero te puede prestar el banco.",
      },
      {
        heading: "¿Por qué importa?",
        body: "El banco calcula el porcentaje de financiación sobre el valor de tasación, no sobre el precio de compra. Si la tasación es inferior al precio, necesitarás más entrada.",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 5 — Bancos o broker
     ══════════════════════════════════════════ */
  "Contactar 2–3 bancos": {
    title: "Cómo contactar bancos",
    sections: [
      {
        heading: "Por dónde empezar",
        body: "Empieza por tu banco habitual + otros 2 bancos diferentes. Tener varias ofertas te da poder de negociación.",
      },
      {
        heading: "Qué preguntar",
        body: "• Tipo de interés (fijo, variable, mixto)\n• Comisiones\n• Productos vinculados\n• Plazo máximo\n• Condiciones de amortización anticipada",
      },
    ],
  },

  "Pedir preaprobación": {
    title: "La preaprobación hipotecaria",
    sections: [
      {
        heading: "¿Qué es?",
        body: "Es un documento del banco que confirma cuánto te prestarían y en qué condiciones aproximadas. No es vinculante.",
      },
      {
        heading: "¿Para qué sirve?",
        body: "Te da mucha fuerza negociadora con los vendedores. Demuestra que eres un comprador serio y solvente.",
      },
    ],
  },

  "Pedir simulaciones": {
    title: "Simulaciones hipotecarias",
    sections: [
      {
        heading: "¿Qué pedir?",
        body: "Pregunta siempre por:\n• Cuota mensual\n• Tipo de interés (TIN y TAE)\n• Comisiones\n• Productos vinculados obligatorios",
      },
      {
        heading: "Compara con criterio",
        body: "No te quedes con la primera simulación. La diferencia entre ofertas puede suponer 10.000-30.000€ en el total del préstamo.",
      },
    ],
  },

  "Evaluar broker": {
    title: "¿Merece la pena un broker hipotecario?",
    sections: [
      {
        heading: "¿Qué hace un broker?",
        body: "Es un intermediario que negocia con varios bancos por ti. Conoce las ofertas del mercado y puede conseguir mejores condiciones.",
      },
      {
        heading: "Coste vs beneficio",
        body: "Cobra una comisión (normalmente un % del préstamo), pero puede ahorrarte más de lo que cobra en mejores condiciones. Algunos no cobran si no consiguen hipoteca.",
      },
    ],
  },

  "Comparar hipotecas": {
    title: "Cómo comparar hipotecas",
    sections: [
      {
        heading: "No solo mires el interés",
        body: "Compara también: comisión de apertura, productos vinculados, comisión por amortización anticipada y la TAE total.",
      },
      {
        heading: "La diferencia importa",
        body: "La diferencia entre hipotecas puede suponer 10.000-30.000€ en el total. Vale la pena dedicar tiempo a comparar.",
      },
    ],
  },

  "Negociar condiciones": {
    title: "Negociar las condiciones de tu hipoteca",
    sections: [
      {
        heading: "Es normal negociar",
        body: "Los bancos esperan negociación. Puedes negociar intereses, comisiones y productos vinculados.",
      },
      {
        heading: "Tu mejor arma",
        body: "Tener ofertas de otros bancos es tu mejor herramienta de negociación. Si un banco ve que tienes alternativas, mejorará su oferta.",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 6 — Que el banco diga sí
     ══════════════════════════════════════════ */
  "Reunir documentación": {
    title: "Documentación necesaria para la hipoteca",
    sections: [
      {
        heading: "Documentos básicos",
        body: "• Últimas 3 nóminas\n• Contrato de trabajo\n• Extractos bancarios (6 meses)\n• Declaración de la renta\n• DNI/NIE",
      },
      {
        heading: "Documentos adicionales",
        body: "Si eres autónomo: declaraciones trimestrales de IVA e IRPF, últimos balances.\nSi tienes otros ingresos: justificantes correspondientes.",
      },
    ],
  },

  "Revisar perfil financiero": {
    title: "Tu perfil financiero ante el banco",
    sections: [
      {
        heading: "¿Qué miran?",
        body: "• Estabilidad laboral\n• Ratio de endeudamiento (deudas / ingresos)\n• Historial de ahorro constante\n• Otros préstamos activos",
      },
      {
        heading: "Cómo mejorarlo",
        body: "Reduce deudas, mantén un ahorro constante y evita contratar nuevos préstamos antes de pedir la hipoteca.",
      },
    ],
  },

  "Revisar deudas": {
    title: "Cómo afectan tus deudas a la hipoteca",
    sections: [
      {
        heading: "¿Qué cuenta como deuda?",
        body: "Préstamos personales, tarjetas de crédito con saldo pendiente, financiaciones de compras y cualquier otro compromiso de pago mensual.",
      },
      {
        heading: "El ratio de endeudamiento",
        body: "El banco suma todas tus cuotas mensuales (incluida la futura hipoteca) y las compara con tus ingresos. Si superas el 35-40%, es probable que no aprueben.",
      },
    ],
  },

  "Reducir deudas": {
    title: "Estrategias para reducir deudas",
    sections: [
      {
        heading: "Método bola de nieve",
        body: "Prioriza eliminar préstamos pequeños primero. Cada deuda eliminada te da más capacidad para la siguiente.",
      },
      {
        heading: "Método avalancha",
        body: "Prioriza las deudas con mayor interés. Ahorras más a largo plazo aunque tarde más en verse el progreso.",
      },
    ],
  },

  "Optimizar perfil financiero": {
    title: "Cómo optimizar tu perfil para el banco",
    sections: [
      {
        heading: "El banco mira",
        body: "• Estabilidad laboral y antigüedad\n• Ratio de endeudamiento\n• Historial de ahorro constante\n• Ausencia de impagos",
      },
      {
        heading: "Acciones concretas",
        body: "• Cancela tarjetas de crédito sin uso\n• Elimina deudas pequeñas\n• Mantén un ahorro mensual constante\n• Evita cambios de empleo justo antes de pedir hipoteca",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 7 — Define qué vivienda necesitas
     ══════════════════════════════════════════ */
  "Crear checklist": {
    title: "Crea tu checklist de vivienda ideal",
    sections: [
      {
        heading: "MUST vs NICE",
        body: "Separa lo imprescindible de lo deseable:\n\n• MUST = lo que no puedes negociar (ubicación, tamaño mínimo, presupuesto)\n• NICE = lo que te gustaría pero puedes ceder (terraza, garaje, vistas)",
      },
      {
        heading: "Por qué importa",
        body: "Tener claras tus prioridades te evita decisiones emocionales y te ayuda a filtrar opciones rápidamente.",
      },
    ],
  },

  "Definir red flags": {
    title: "Red flags al visitar viviendas",
    sections: [
      {
        heading: "Señales de alerta",
        body: "• Humedades en techos o paredes\n• Ruido excesivo (tráfico, vecinos)\n• Mala orientación (poca luz natural)\n• Instalaciones antiguas (fontanería, electricidad)\n• Derramas pendientes en la comunidad",
      },
      {
        heading: "Consejo clave",
        body: "Visita la vivienda a diferentes horas del día para detectar problemas de ruido o luz que no se ven en una sola visita.",
      },
    ],
  },

  "Definir presupuesto real": {
    title: "Define tu presupuesto real de compra",
    sections: [
      {
        heading: "Presupuesto = precio + entrada + gastos",
        body: "Tu presupuesto máximo debe incluir no solo el precio de la vivienda, sino también la entrada que aportarás y los gastos asociados.",
      },
      {
        heading: "No te estires de más",
        body: "Es tentador subir el presupuesto para acceder a mejores viviendas, pero una hipoteca demasiado alta limita tu calidad de vida durante muchos años.",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 8 — Analiza zonas
     ══════════════════════════════════════════ */
  "Definir zonas": {
    title: "Cómo elegir zona para comprar",
    sections: [
      {
        heading: "Analiza precios por m²",
        body: "Los precios varían enormemente entre barrios. Conocer el precio medio por m² te permite comparar con criterio.",
      },
      {
        heading: "Factores clave",
        body: "• Transporte público\n• Colegios y servicios\n• Comercios\n• Zonas verdes\n• Perspectiva de revalorización",
      },
    ],
  },

  "Evaluar riesgos": {
    title: "Evalúa los riesgos de la zona",
    sections: [
      {
        heading: "¿Qué evaluar?",
        body: "• Infraestructura actual y planes futuros\n• Crecimiento demográfico\n• Servicios disponibles\n• Seguridad del barrio",
      },
      {
        heading: "Señales positivas",
        body: "Nuevas líneas de transporte, apertura de comercios, obras de mejora urbana — todo esto indica que la zona está en crecimiento.",
      },
    ],
  },

  "Analizar barrio": {
    title: "Cómo analizar un barrio",
    sections: [
      {
        heading: "Visítalo en persona",
        body: "Pasea por el barrio a diferentes horas. Fíjate en la seguridad, el ruido, la limpieza y el ambiente general.",
      },
      {
        heading: "Servicios esenciales",
        body: "Comprueba la cercanía de:\n• Transporte público\n• Supermercados\n• Centros de salud\n• Colegios (si aplica)\n• Zonas de ocio",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 9 — Busca, filtra y visita
     ══════════════════════════════════════════ */
  "Guardar favoritos": {
    title: "Cómo seleccionar tus favoritos",
    sections: [
      {
        heading: "Menos es más",
        body: "Quédate con 3-5 opciones que cumplan tus MUST. Demasiadas opciones paralizan la decisión.",
      },
      {
        heading: "Compara con criterio",
        body: "Usa tu checklist para puntuar cada opción. Esto te ayuda a tomar decisiones racionales, no emocionales.",
      },
    ],
  },

  "Buscar viviendas": {
    title: "Cómo buscar viviendas con criterio",
    sections: [
      {
        heading: "Define filtros claros",
        body: "Antes de buscar, establece: presupuesto máximo, zona(s), tamaño mínimo, número de habitaciones.",
      },
      {
        heading: "Sé eficiente",
        body: "Buscar con criterio claro filtra el 80% de anuncios irrelevantes y te ahorra mucho tiempo.",
      },
    ],
  },

  "Realizar visitas": {
    title: "Qué revisar en las visitas",
    sections: [
      {
        heading: "Checklist de visita",
        body: "Revisa:\n• Estado general y acabados\n• Luz natural y orientación\n• Ruido (abre ventanas)\n• Humedades\n• Estado de zonas comunes\n• Comunidad de vecinos",
      },
      {
        heading: "Preguntas importantes",
        body: "• ¿Cuánto pagan de comunidad?\n• ¿Hay derramas pendientes?\n• ¿Cuánto tiempo lleva en el mercado?\n• ¿Por qué venden?",
      },
    ],
  },

  "Visitar propiedades": {
    title: "Consejos para visitar propiedades",
    sections: [
      {
        heading: "Qué mirar",
        body: "Estado de la vivienda, luz natural, ruido del barrio, estado de instalaciones y zonas comunes.",
      },
      {
        heading: "Visita más de una vez",
        body: "Las visitas presenciales revelan cosas que las fotos nunca muestran. Visita a diferentes horas si puedes.",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE 10 — Cierra la compra
     ══════════════════════════════════════════ */
  "Hacer oferta": {
    title: "Cómo hacer una oferta de compra",
    sections: [
      {
        heading: "Investiga antes",
        body: "Conoce los precios reales de venta (no de anuncio) en la zona. Un margen de negociación del 5-10% es habitual.",
      },
      {
        heading: "Haz una oferta fundamentada",
        body: "Justifica tu oferta con datos: precios de la zona, estado de la vivienda, tiempo en el mercado. Una oferta razonada se toma más en serio.",
      },
    ],
  },

  "Reservar vivienda": {
    title: "La reserva de la vivienda",
    sections: [
      {
        heading: "¿Qué es la señal?",
        body: "Normalmente entre 1.000€ y 5.000€ que se descuentan del precio final. Demuestra tu interés serio.",
      },
      {
        heading: "Reserva vs arras",
        body: "La reserva es un paso previo menos formal. Las arras son un compromiso legal más firme con consecuencias si alguna parte incumple.",
      },
    ],
  },

  "Firmar contrato de arras": {
    title: "El contrato de arras",
    sections: [
      {
        heading: "¿Qué son las arras?",
        body: "Es un contrato privado donde se fija el precio, las condiciones y el plazo para la firma. Normalmente pagas el 10% del precio como señal.",
      },
      {
        heading: "Consecuencias del incumplimiento",
        body: "Si incumples, pierdes la señal. Si incumple el vendedor, te devuelve el doble. Es un compromiso serio — asegúrate de tener la financiación antes de firmar.",
      },
      {
        heading: "Qué mirar en el contrato",
        body: "Condiciones, penalizaciones, plazos y cualquier cláusula especial. Si tienes dudas, consulta con un abogado.",
      },
    ],
  },

  "Firma de hipoteca": {
    title: "La firma ante notario",
    sections: [
      {
        heading: "El último paso",
        body: "Se firma la escritura de compraventa y la hipoteca el mismo día ante notario.",
      },
      {
        heading: "Documentos necesarios",
        body: "DNI, preaprobación del banco, justificantes de pago y toda la documentación de la vivienda.",
      },
      {
        heading: "Después de la firma",
        body: "Solo queda inscribir en el Registro de la Propiedad. ¡Y ya tienes tu casa! 🏡",
      },
      {
        heading: "Conceptos importantes",
        body: "• Comisión de apertura: coste inicial del préstamo\n• Euríbor: índice que afecta hipotecas variables\n• Productos vinculados: seguros u otros obligatorios\n• LTV: % del valor financiado\n• FEIN/FiAE: documentos con condiciones finales\n• Nota simple: información legal de la vivienda",
      },
    ],
  },

  /* ══════════════════════════════════════════
     BLOQUE — Explorar avales
     ══════════════════════════════════════════ */
  "Explorar aval público": {
    title: "Avales públicos para la compra de vivienda",
    sections: [
      {
        heading: "¿Qué es un aval público?",
        body: "El Estado avala parte del préstamo, reduciendo el riesgo para el banco. Esto permite financiar hasta el 100% de la vivienda.",
      },
      {
        heading: "Aval ICO para jóvenes",
        body: "Requisitos:\n• Menor de 35 años\n• Primera vivienda\n• Ingresos dentro de límites\n\nSe solicita directamente en el banco.",
      },
    ],
  },

  "Explorar aval familiar": {
    title: "Avales familiares",
    sections: [
      {
        heading: "¿Cómo funciona?",
        body: "Un familiar aporta una propiedad libre de cargas como garantía adicional. Esto puede cubrir el 20% que el banco no financia.",
      },
      {
        heading: "Consideraciones",
        body: "Es un compromiso importante para el avalista. Si no pagas, el banco puede ejecutar la garantía sobre su propiedad. Debe estar bien informado y de acuerdo.",
      },
    ],
  },
};
