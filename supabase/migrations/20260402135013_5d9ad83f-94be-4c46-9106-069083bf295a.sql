
-- Clear FK references first
DELETE FROM public.user_tracker_state;
DELETE FROM public.user_journey_progress;
DELETE FROM public.journey_steps;
DELETE FROM public.journey_phases;

-- Insert 10 phases
INSERT INTO public.journey_phases (id, order_index, name, description) VALUES
  (gen_random_uuid(), 1, 'Entiende cuánto puedes comprar', 'Tener claridad real de tu punto de partida'),
  (gen_random_uuid(), 2, 'Calcula cuánto necesitas (entrada + gastos)', 'Eliminar la incertidumbre del ahorro'),
  (gen_random_uuid(), 3, 'Descubre cómo comprar antes (ayudas)', 'Reducir barrera de entrada'),
  (gen_random_uuid(), 4, 'Entiende cómo funcionará tu hipoteca', 'Quitar miedo técnico'),
  (gen_random_uuid(), 5, 'Sal al mercado: bancos o broker', 'Validar condiciones reales'),
  (gen_random_uuid(), 6, 'Prepárate para que el banco te diga que sí', 'Estar hipoteca-ready'),
  (gen_random_uuid(), 7, 'Define qué vivienda necesitas (de verdad)', 'Evitar malas decisiones emocionales'),
  (gen_random_uuid(), 8, 'Analiza zonas como una decisión inteligente', 'Comprar bien, no solo comprar'),
  (gen_random_uuid(), 9, 'Busca, filtra y visita viviendas', 'Pasar a opciones reales'),
  (gen_random_uuid(), 10, 'Cierra la compra con seguridad', 'Ejecutar sin errores');

-- Phase 1
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Definir tu presupuesto máximo de compra', '' FROM public.journey_phases WHERE order_index = 1;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Calcular cuota mensual cómoda', '' FROM public.journey_phases WHERE order_index = 1;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 3, 'Validar estabilidad de ingresos', '' FROM public.journey_phases WHERE order_index = 1;

-- Phase 2
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Calcular objetivo total de ahorro', '' FROM public.journey_phases WHERE order_index = 2;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Separar entrada vs gastos', '' FROM public.journey_phases WHERE order_index = 2;

-- Phase 3
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Ver ayudas aplicables a mi perfil', '' FROM public.journey_phases WHERE order_index = 3;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Identificar requisitos clave', '' FROM public.journey_phases WHERE order_index = 3;

-- Phase 4
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Elegir tipo de hipoteca', '' FROM public.journey_phases WHERE order_index = 4;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Entender porcentajes a financiar', '' FROM public.journey_phases WHERE order_index = 4;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 3, 'Negociación con bancos', '' FROM public.journey_phases WHERE order_index = 4;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 4, 'Qué es el pre-scoring', '' FROM public.journey_phases WHERE order_index = 4;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 5, 'Entender la tasación', '' FROM public.journey_phases WHERE order_index = 4;

-- Phase 5
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Contactar 2–3 bancos', '' FROM public.journey_phases WHERE order_index = 5;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Pedir simulaciones', '' FROM public.journey_phases WHERE order_index = 5;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 3, 'Evaluar broker', '' FROM public.journey_phases WHERE order_index = 5;

-- Phase 6
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Reunir documentación', '' FROM public.journey_phases WHERE order_index = 6;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Revisar deudas', '' FROM public.journey_phases WHERE order_index = 6;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 3, 'Optimizar perfil financiero', '' FROM public.journey_phases WHERE order_index = 6;

-- Phase 7
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Crear checklist de necesidades', '' FROM public.journey_phases WHERE order_index = 7;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Definir red flags', '' FROM public.journey_phases WHERE order_index = 7;

-- Phase 8
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Definir zonas objetivo', '' FROM public.journey_phases WHERE order_index = 8;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Evaluar riesgos de zona', '' FROM public.journey_phases WHERE order_index = 8;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 3, 'Analizar barrio', '' FROM public.journey_phases WHERE order_index = 8;

-- Phase 9
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Guardar favoritos', '' FROM public.journey_phases WHERE order_index = 9;
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 2, 'Realizar visitas', '' FROM public.journey_phases WHERE order_index = 9;

-- Phase 10
INSERT INTO public.journey_steps (phase_id, order_index, title, description) SELECT id, 1, 'Hacer oferta', '' FROM public.journey_phases WHERE order_index = 10;
