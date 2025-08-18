-- Insert sample deals data
INSERT INTO deals (
  destination, country, current_price, original_price, airline, airline_logo_url,
  departure_date, return_date, deal_expiration, seats_available, affiliate_url,
  is_featured, destination_image_url, category, rating, review_count, booking_count
) VALUES 
(
  'Istanbul', 'Turkije', 89.00, 245.00, 'Turkish Airlines', '/turkish-airlines-logo.png',
  '2025-03-15', '2025-03-22', '2025-02-28 23:59:59+00', 8,
  'https://partner.com/book/istanbul', true, '/istanbul-hagia-sophia-bosphorus.png',
  'weekend', 4.7, 234, 47
),
(
  'Barcelona', 'Spanje', 67.00, 198.00, 'Vueling', '/vueling-logo.png',
  '2025-03-20', '2025-03-27', '2025-03-05 23:59:59+00', 12,
  'https://partner.com/book/barcelona', false, '/barcelona-sagrada-familia-park-guell.png',
  'budget', 4.5, 189, 32
),
(
  'London', 'Verenigd Koninkrijk', 45.00, 156.00, 'British Airways', '/british-airways-logo.png',
  '2025-03-10', '2025-03-17', '2025-02-25 23:59:59+00', 5,
  'https://partner.com/book/london', false, '/london-big-ben-tower-bridge.png',
  'weekend', 4.6, 156, 28
),
(
  'Rome', 'Italië', 78.00, 189.00, 'ITA Airways', '/ita-airways-logo.png',
  '2025-04-05', '2025-04-12', '2025-03-20 23:59:59+00', 15,
  'https://partner.com/book/rome', false, '/rome-colosseum-vatican.png',
  'budget', 4.4, 203, 41
),
(
  'Prague', 'Tsjechië', 56.00, 167.00, 'Czech Airlines', '/czech-airlines-logo.png',
  '2025-03-25', '2025-04-01', '2025-03-10 23:59:59+00', 9,
  'https://partner.com/book/prague', false, '/prague-castle-charles-bridge.png',
  'budget', 4.3, 178, 35
),
(
  'Amsterdam', 'Nederland', 123.00, 298.00, 'KLM', '/klm-logo.png',
  '2025-04-15', '2025-04-22', '2025-04-01 23:59:59+00', 6,
  'https://partner.com/book/amsterdam', true, '/amsterdam-canals-tulips.png',
  'luxury', 4.8, 267, 52
);

-- Insert sample subscribers
INSERT INTO subscribers (email, name, subscription_type, source) VALUES 
('john.doe@example.com', 'John Doe', 'newsletter', 'website'),
('maria.garcia@example.com', 'Maria Garcia', 'price_alerts', 'website'),
('peter.smith@example.com', 'Peter Smith', 'newsletter', 'social_media'),
('anna.johnson@example.com', 'Anna Johnson', 'newsletter', 'website'),
('david.brown@example.com', 'David Brown', 'price_alerts', 'referral');

-- Insert sample admin user (password: admin123, hashed with bcrypt)
INSERT INTO admin_users (username, password_hash, email) VALUES 
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQq', 'admin@spotmijnvlucht.nl');

-- Insert sample analytics events
INSERT INTO analytics_events (event_type, event_data, deal_id) 
SELECT 
  'deal_click',
  jsonb_build_object('source', 'homepage', 'position', floor(random() * 6) + 1),
  id
FROM deals
LIMIT 3;

INSERT INTO analytics_events (event_type, event_data) VALUES 
('email_signup', '{"source": "newsletter_popup", "page": "homepage"}'),
('page_view', '{"page": "/deals", "referrer": "google.com"}'),
('conversion', '{"deal_id": "uuid", "value": 89.00, "currency": "EUR"}');
