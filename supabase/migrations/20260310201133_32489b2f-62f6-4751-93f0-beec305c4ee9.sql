
-- Add active and min_age columns
ALTER TABLE public.housing_aids ADD COLUMN IF NOT EXISTS active boolean NOT NULL DEFAULT true;
ALTER TABLE public.housing_aids ADD COLUMN IF NOT EXISTS min_age integer;

-- Update all records with Spanish names and descriptions
UPDATE public.housing_aids SET
  name = 'Aval ICO para Primera Vivienda',
  benefit_description = 'Aval del Estado que permite financiar hasta el 100 % del precio de la vivienda, cubriendo el 20 % de entrada que normalmente exige el banco.'
WHERE name = 'ICO First Home Guarantee';

UPDATE public.housing_aids SET
  name = 'Aval ICO para Familias con Hijos',
  benefit_description = 'Programa de avales del ICO dirigido a familias con menores a cargo para facilitar el acceso a una hipoteca con menor ahorro inicial.'
WHERE name = 'ICO Guarantee for Families';

UPDATE public.housing_aids SET
  name = 'Plan Mi Primera Vivienda (Madrid)',
  benefit_description = 'Programa de la Comunidad de Madrid que avala parte de la hipoteca para jóvenes y familias que compran su primera vivienda.'
WHERE name = 'Plan Mi Primera Vivienda';

UPDATE public.housing_aids SET
  name = 'Aval Hipotecario para Jóvenes de Andalucía',
  benefit_description = 'Aval de la Junta de Andalucía que facilita a los jóvenes el acceso a una hipoteca reduciendo el ahorro necesario para la entrada.'
WHERE name = 'Andalucía Mortgage Guarantee';

UPDATE public.housing_aids SET
  name = 'Reducción del ITP para Jóvenes en Andalucía',
  benefit_description = 'Tipo reducido en el Impuesto de Transmisiones Patrimoniales para jóvenes que compran vivienda habitual.'
WHERE name = 'Andalucía Reduced Property Transfer Tax';

UPDATE public.housing_aids SET
  name = 'Hipoteca Joven de Cataluña',
  benefit_description = 'Programas y acuerdos financieros que facilitan condiciones hipotecarias más accesibles para jóvenes compradores.'
WHERE name = 'Hipoteca Jove Catalunya';

UPDATE public.housing_aids SET
  name = 'Deducción Fiscal para Jóvenes Compradores en Cataluña',
  benefit_description = 'Beneficio fiscal que permite reducir la carga impositiva en la compra de vivienda para determinados perfiles jóvenes.'
WHERE name = 'Catalonia Young Buyer Tax Deduction';

UPDATE public.housing_aids SET
  name = 'Subvención para Jóvenes Compradores en la Comunidad Valenciana',
  benefit_description = 'Ayuda económica directa destinada a jóvenes que compran su primera vivienda habitual.'
WHERE name = 'Valencia Young Buyer Grant';

UPDATE public.housing_aids SET
  name = 'Ayuda a la Vivienda Rural en Galicia',
  benefit_description = 'Subvención para la compra o rehabilitación de viviendas en municipios rurales de Galicia.'
WHERE name = 'Galicia Rural Housing Aid';

UPDATE public.housing_aids SET
  name = 'Programa de Vivienda Joven de Castilla y León',
  benefit_description = 'Conjunto de ayudas destinadas a facilitar el acceso a vivienda para jóvenes en la comunidad.'
WHERE name = 'Castilla y León Youth Housing Program';

UPDATE public.housing_aids SET
  name = 'Aval Hipotecario Joven de Canarias',
  benefit_description = 'Aval autonómico que facilita el acceso a financiación hipotecaria para jóvenes compradores.'
WHERE name = 'Canarias Young Mortgage Guarantee';

UPDATE public.housing_aids SET
  name = 'Aval para Primera Vivienda en Murcia',
  benefit_description = 'Programa de avales de la Región de Murcia para reducir la entrada necesaria al comprar la primera vivienda.'
WHERE name = 'Murcia First Home Guarantee';
