-- Insert sample flight deals
INSERT INTO flight_deals (
  destination, country, city, original_price, current_price, discount_percentage,
  airline, airline_logo, image_url, departure_date, return_date, seats_remaining,
  deal_expires_at, category, rating, review_count, competitor_price, daily_bookings,
  partner_id, affiliate_url, is_featured, is_deal_of_day
) VALUES
  ('Istanbul', 'Turkey', 'Istanbul', 245, 89, 64, 'Turkish Airlines', '/turkish-airlines-logo.png', '/istanbul-hagia-sophia-bosphorus.png', '2024-03-15', '2024-03-22', 12, NOW() + INTERVAL '2 days', 'budget', 4.7, 342, 198, 23, 'turkish_airlines', 'https://partner.turkishairlines.com/book?ref=spotmijnvlucht', true, true),
  ('Barcelona', 'Spain', 'Barcelona', 198, 67, 66, 'Vueling', '/vueling-logo.png', '/barcelona-sagrada-familia-park-guell.png', '2024-03-20', '2024-03-27', 8, NOW() + INTERVAL '1 day', 'weekend', 4.5, 189, 145, 31, 'vueling', 'https://partner.vueling.com/book?ref=spotmijnvlucht', true, false),
  ('London', 'United Kingdom', 'London', 156, 45, 71, 'British Airways', '/british-airways-logo.png', '/london-big-ben-tower-bridge.png', '2024-03-18', '2024-03-25', 15, NOW() + INTERVAL '3 days', 'budget', 4.3, 267, 112, 18, 'british_airways', 'https://partner.britishairways.com/book?ref=spotmijnvlucht', false, false),
  ('Rome', 'Italy', 'Rome', 234, 78, 67, 'ITA Airways', '/ita-airways-logo.png', '/rome-colosseum-vatican.png', '2024-03-25', '2024-04-01', 6, NOW() + INTERVAL '4 days', 'weekend', 4.6, 156, 167, 14, 'ita_airways', 'https://partner.itaairways.com/book?ref=spotmijnvlucht', false, false),
  ('Prague', 'Czech Republic', 'Prague', 189, 56, 70, 'Czech Airlines', '/czech-airlines-logo.png', '/prague-castle-charles-bridge.png', '2024-03-22', '2024-03-29', 9, NOW() + INTERVAL '5 days', 'budget', 4.4, 98, 134, 27, 'czech_airlines', 'https://partner.czechairlines.com/book?ref=spotmijnvlucht', false, false),
  ('Amsterdam', 'Netherlands', 'Amsterdam', 167, 52, 69, 'KLM', '/klm-logo.png', '/amsterdam-canals-tulips.png', '2024-03-28', '2024-04-04', 11, NOW() + INTERVAL '6 days', 'weekend', 4.8, 223, 98, 19, 'klm', 'https://partner.klm.com/book?ref=spotmijnvlucht', true, false),
  ('New York', 'United States', 'New York', 789, 445, 44, 'Delta Airlines', '/delta-airlines-logo.png', '/new-york-city-skyline.png', '2024-04-05', '2024-04-12', 4, NOW() + INTERVAL '7 days', 'long_haul', 4.5, 445, 567, 8, 'delta', 'https://partner.delta.com/book?ref=spotmijnvlucht', false, false),
  ('Tokyo', 'Japan', 'Tokyo', 1234, 678, 45, 'Japan Airlines', '/japan-airlines-logo.png', '/tokyo-fuji-skyline.png', '2024-04-10', '2024-04-17', 3, NOW() + INTERVAL '8 days', 'luxury', 4.9, 167, 789, 5, 'jal', 'https://partner.jal.com/book?ref=spotmijnvlucht', true, false),
  ('Paris', 'France', 'Paris', 198, 89, 55, 'Air France', '/air-france-logo.png', '/paris-eiffel-tower.png', '2024-04-15', '2024-04-22', 7, NOW() + INTERVAL '9 days', 'weekend', 4.6, 289, 156, 22, 'air_france', 'https://partner.airfrance.com/book?ref=spotmijnvlucht', false, false);

-- Insert sample email subscriptions
INSERT INTO email_subscriptions (email, subscription_type, preferences) VALUES
  ('user1@example.com', 'newsletter', '{"frequency": "weekly", "categories": ["budget", "weekend"]}'),
  ('user2@example.com', 'price_alerts', '{"destinations": ["London", "Paris"], "max_price": 100}'),
  ('user3@example.com', 'newsletter', '{"frequency": "daily", "categories": ["luxury", "long_haul"]}');
