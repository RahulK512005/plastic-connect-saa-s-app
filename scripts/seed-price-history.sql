-- Seed realistic price history data for AI pricing recommendations
-- This populates 30 days of transaction history across different materials, grades, and locations

-- Clear existing data (optional - comment out if you want to preserve data)
-- DELETE FROM public.price_history;

-- PET (Polyethylene Terephthalate) prices - high demand
INSERT INTO public.price_history (material_type, grade, purity_score, location, price_per_kg, market_trend, created_at)
VALUES
  ('PET', 'A', 97.5, 'California', 0.58, 'UP', NOW() - INTERVAL '30 days'),
  ('PET', 'A', 96.8, 'New York', 0.62, 'UP', NOW() - INTERVAL '28 days'),
  ('PET', 'B', 88.2, 'Texas', 0.45, 'STABLE', NOW() - INTERVAL '26 days'),
  ('PET', 'A', 98.1, 'Florida', 0.60, 'UP', NOW() - INTERVAL '24 days'),
  ('PET', 'B', 87.5, 'Illinois', 0.44, 'DOWN', NOW() - INTERVAL '22 days'),
  ('PET', 'A', 97.0, 'California', 0.59, 'UP', NOW() - INTERVAL '20 days'),
  ('PET', 'C', 72.3, 'Texas', 0.32, 'DOWN', NOW() - INTERVAL '18 days'),
  ('PET', 'A', 96.5, 'New York', 0.61, 'UP', NOW() - INTERVAL '16 days'),
  ('PET', 'B', 89.0, 'Florida', 0.46, 'UP', NOW() - INTERVAL '14 days'),
  ('PET', 'A', 97.8, 'California', 0.62, 'UP', NOW() - INTERVAL '12 days'),
  ('PET', 'B', 88.5, 'Illinois', 0.45, 'STABLE', NOW() - INTERVAL '10 days'),
  ('PET', 'A', 98.0, 'New York', 0.63, 'UP', NOW() - INTERVAL '8 days'),
  ('PET', 'B', 87.8, 'Texas', 0.46, 'UP', NOW() - INTERVAL '6 days'),
  ('PET', 'A', 97.2, 'Florida', 0.61, 'UP', NOW() - INTERVAL '4 days'),
  ('PET', 'A', 98.3, 'California', 0.64, 'UP', NOW() - INTERVAL '2 days');

-- HDPE (High-Density Polyethylene) prices
INSERT INTO public.price_history (material_type, grade, purity_score, location, price_per_kg, market_trend, created_at)
VALUES
  ('HDPE', 'A', 95.2, 'Texas', 0.62, 'STABLE', NOW() - INTERVAL '29 days'),
  ('HDPE', 'B', 86.5, 'California', 0.50, 'UP', NOW() - INTERVAL '27 days'),
  ('HDPE', 'A', 96.1, 'New York', 0.63, 'UP', NOW() - INTERVAL '25 days'),
  ('HDPE', 'B', 87.0, 'Florida', 0.51, 'STABLE', NOW() - INTERVAL '23 days'),
  ('HDPE', 'A', 94.8, 'Illinois', 0.61, 'DOWN', NOW() - INTERVAL '21 days'),
  ('HDPE', 'C', 75.5, 'Texas', 0.35, 'DOWN', NOW() - INTERVAL '19 days'),
  ('HDPE', 'B', 86.8, 'California', 0.51, 'UP', NOW() - INTERVAL '17 days'),
  ('HDPE', 'A', 95.5, 'New York', 0.64, 'UP', NOW() - INTERVAL '15 days'),
  ('HDPE', 'B', 87.2, 'Florida', 0.52, 'UP', NOW() - INTERVAL '13 days'),
  ('HDPE', 'A', 96.0, 'Texas', 0.63, 'STABLE', NOW() - INTERVAL '11 days');

-- PVC (Polyvinyl Chloride) prices - lower demand
INSERT INTO public.price_history (material_type, grade, purity_score, location, price_per_kg, market_trend, created_at)
VALUES
  ('PVC', 'A', 94.0, 'California', 0.42, 'DOWN', NOW() - INTERVAL '28 days'),
  ('PVC', 'B', 82.5, 'Texas', 0.35, 'DOWN', NOW() - INTERVAL '26 days'),
  ('PVC', 'A', 93.8, 'New York', 0.41, 'DOWN', NOW() - INTERVAL '24 days'),
  ('PVC', 'B', 83.0, 'Florida', 0.36, 'STABLE', NOW() - INTERVAL '22 days'),
  ('PVC', 'C', 70.2, 'Illinois', 0.24, 'DOWN', NOW() - INTERVAL '20 days'),
  ('PVC', 'A', 93.5, 'Texas', 0.40, 'DOWN', NOW() - INTERVAL '18 days'),
  ('PVC', 'B', 82.8, 'California', 0.35, 'DOWN', NOW() - INTERVAL '16 days'),
  ('PVC', 'A', 94.2, 'New York', 0.42, 'DOWN', NOW() - INTERVAL '14 days'),
  ('PVC', 'B', 83.2, 'Florida', 0.36, 'STABLE', NOW() - INTERVAL '12 days'),
  ('PVC', 'A', 93.9, 'California', 0.41, 'DOWN', NOW() - INTERVAL '10 days');

-- LDPE (Low-Density Polyethylene) prices
INSERT INTO public.price_history (material_type, grade, purity_score, location, price_per_kg, market_trend, created_at)
VALUES
  ('LDPE', 'A', 92.5, 'Texas', 0.48, 'STABLE', NOW() - INTERVAL '27 days'),
  ('LDPE', 'B', 84.5, 'California', 0.40, 'UP', NOW() - INTERVAL '25 days'),
  ('LDPE', 'A', 91.8, 'New York', 0.49, 'UP', NOW() - INTERVAL '23 days'),
  ('LDPE', 'B', 85.0, 'Florida', 0.41, 'STABLE', NOW() - INTERVAL '21 days'),
  ('LDPE', 'A', 92.2, 'Illinois', 0.48, 'STABLE', NOW() - INTERVAL '19 days'),
  ('LDPE', 'C', 73.5, 'Texas', 0.28, 'DOWN', NOW() - INTERVAL '17 days'),
  ('LDPE', 'B', 84.8, 'California', 0.40, 'UP', NOW() - INTERVAL '15 days'),
  ('LDPE', 'A', 93.0, 'New York', 0.50, 'UP', NOW() - INTERVAL '13 days'),
  ('LDPE', 'B', 85.2, 'Florida', 0.42, 'UP', NOW() - INTERVAL '11 days'),
  ('LDPE', 'A', 92.8, 'Texas', 0.49, 'STABLE', NOW() - INTERVAL '9 days');

-- PP (Polypropylene) prices - growing demand
INSERT INTO public.price_history (material_type, grade, purity_score, location, price_per_kg, market_trend, created_at)
VALUES
  ('PP', 'A', 94.5, 'California', 0.58, 'UP', NOW() - INTERVAL '29 days'),
  ('PP', 'B', 85.8, 'Texas', 0.48, 'UP', NOW() - INTERVAL '27 days'),
  ('PP', 'A', 95.2, 'New York', 0.59, 'UP', NOW() - INTERVAL '25 days'),
  ('PP', 'B', 86.2, 'Florida', 0.49, 'UP', NOW() - INTERVAL '23 days'),
  ('PP', 'A', 94.8, 'Illinois', 0.57, 'STABLE', NOW() - INTERVAL '21 days'),
  ('PP', 'C', 74.5, 'Texas', 0.34, 'STABLE', NOW() - INTERVAL '19 days'),
  ('PP', 'B', 86.0, 'California', 0.49, 'UP', NOW() - INTERVAL '17 days'),
  ('PP', 'A', 95.0, 'New York', 0.60, 'UP', NOW() - INTERVAL '15 days'),
  ('PP', 'B', 86.5, 'Florida', 0.50, 'UP', NOW() - INTERVAL '13 days'),
  ('PP', 'A', 95.5, 'California', 0.61, 'UP', NOW() - INTERVAL '11 days'),
  ('PP', 'B', 86.8, 'Texas', 0.50, 'UP', NOW() - INTERVAL '9 days'),
  ('PP', 'A', 95.8, 'New York', 0.61, 'UP', NOW() - INTERVAL '7 days');

-- PS (Polystyrene) prices
INSERT INTO public.price_history (material_type, grade, purity_score, location, price_per_kg, market_trend, created_at)
VALUES
  ('PS', 'A', 93.0, 'Texas', 0.46, 'STABLE', NOW() - INTERVAL '28 days'),
  ('PS', 'B', 81.5, 'California', 0.38, 'DOWN', NOW() - INTERVAL '26 days'),
  ('PS', 'A', 92.8, 'New York', 0.47, 'STABLE', NOW() - INTERVAL '24 days'),
  ('PS', 'B', 82.0, 'Florida', 0.39, 'DOWN', NOW() - INTERVAL '22 days'),
  ('PS', 'A', 93.2, 'Illinois', 0.46, 'STABLE', NOW() - INTERVAL '20 days'),
  ('PS', 'C', 71.8, 'Texas', 0.27, 'DOWN', NOW() - INTERVAL '18 days'),
  ('PS', 'B', 81.8, 'California', 0.38, 'DOWN', NOW() - INTERVAL '16 days'),
  ('PS', 'A', 92.9, 'New York', 0.47, 'STABLE', NOW() - INTERVAL '14 days'),
  ('PS', 'B', 81.9, 'Florida', 0.39, 'DOWN', NOW() - INTERVAL '12 days'),
  ('PS', 'A', 93.1, 'California', 0.47, 'STABLE', NOW() - INTERVAL '10 days');

-- OTHER/Mixed plastics - lower prices
INSERT INTO public.price_history (material_type, grade, purity_score, location, price_per_kg, market_trend, created_at)
VALUES
  ('OTHER', 'B', 76.5, 'California', 0.32, 'DOWN', NOW() - INTERVAL '27 days'),
  ('OTHER', 'C', 65.0, 'Texas', 0.22, 'DOWN', NOW() - INTERVAL '25 days'),
  ('OTHER', 'B', 77.0, 'New York', 0.33, 'STABLE', NOW() - INTERVAL '23 days'),
  ('OTHER', 'C', 64.5, 'Florida', 0.21, 'DOWN', NOW() - INTERVAL '21 days'),
  ('OTHER', 'B', 76.8, 'Illinois', 0.32, 'DOWN', NOW() - INTERVAL '19 days'),
  ('OTHER', 'C', 65.2, 'Texas', 0.22, 'DOWN', NOW() - INTERVAL '17 days'),
  ('OTHER', 'B', 77.2, 'California', 0.33, 'STABLE', NOW() - INTERVAL '15 days'),
  ('OTHER', 'B', 76.9, 'New York', 0.33, 'STABLE', NOW() - INTERVAL '13 days'),
  ('OTHER', 'C', 65.0, 'Florida', 0.22, 'DOWN', NOW() - INTERVAL '11 days'),
  ('OTHER', 'B', 77.1, 'California', 0.33, 'STABLE', NOW() - INTERVAL '9 days');
