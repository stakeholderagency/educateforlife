
-- Change member_type from single enum to array of enum
ALTER TABLE public.profiles 
  ALTER COLUMN member_type TYPE member_type[] 
  USING CASE WHEN member_type IS NULL THEN NULL ELSE ARRAY[member_type] END;
