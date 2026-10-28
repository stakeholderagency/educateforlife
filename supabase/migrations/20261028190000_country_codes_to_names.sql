-- Member locations mix ISO3 codes and country names. Store names everywhere
-- (the world map and the directory look countries up by name).
WITH m(code, name) AS (VALUES
  ('ARE','United Arab Emirates'),('ARG','Argentina'),('AUS','Australia'),('AUT','Austria'),
  ('BEL','Belgium'),('BHR','Bahrain'),('BRA','Brazil'),('CAN','Canada'),('CHE','Switzerland'),
  ('CHL','Chile'),('CHN','China'),('COL','Colombia'),('DEU','Germany'),('DNK','Denmark'),
  ('EGY','Egypt'),('ESP','Spain'),('FRA','France'),('GBR','United Kingdom'),('GUY','Guyana'),
  ('HKG','Hong Kong'),('HUN','Hungary'),('IND','India'),('ITA','Italy'),('KAZ','Kazakhstan'),
  ('KEN','Kenya'),('LBN','Lebanon'),('MAR','Morocco'),('MEX','Mexico'),('MYS','Malaysia'),
  ('NLD','Netherlands'),('NZL','New Zealand'),('PAN','Panama'),('PHL','Philippines'),
  ('PRT','Portugal'),('ROU','Romania'),('SLV','El Salvador'),('TUR','Turkey'),('UGA','Uganda'),
  ('USA','United States'),('UZB','Uzbekistan'),('VNM','Vietnam'),('ZAF','South Africa')
)
UPDATE public.legacy_members l SET location_country = m.name
FROM m WHERE upper(trim(l.location_country)) = m.code;

WITH m(code, name) AS (VALUES
  ('ARE','United Arab Emirates'),('ARG','Argentina'),('AUS','Australia'),('AUT','Austria'),
  ('BEL','Belgium'),('BHR','Bahrain'),('BRA','Brazil'),('CAN','Canada'),('CHE','Switzerland'),
  ('CHL','Chile'),('CHN','China'),('COL','Colombia'),('DEU','Germany'),('DNK','Denmark'),
  ('EGY','Egypt'),('ESP','Spain'),('FRA','France'),('GBR','United Kingdom'),('GUY','Guyana'),
  ('HKG','Hong Kong'),('HUN','Hungary'),('IND','India'),('ITA','Italy'),('KAZ','Kazakhstan'),
  ('KEN','Kenya'),('LBN','Lebanon'),('MAR','Morocco'),('MEX','Mexico'),('MYS','Malaysia'),
  ('NLD','Netherlands'),('NZL','New Zealand'),('PAN','Panama'),('PHL','Philippines'),
  ('PRT','Portugal'),('ROU','Romania'),('SLV','El Salvador'),('TUR','Turkey'),('UGA','Uganda'),
  ('USA','United States'),('UZB','Uzbekistan'),('VNM','Vietnam'),('ZAF','South Africa')
)
UPDATE public.profiles p SET location_country = m.name
FROM m WHERE upper(trim(p.location_country)) = m.code;
