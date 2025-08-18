-- Create flight deals table
CREATE TABLE flight_deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  destination VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  original_price INTEGER NOT NULL,
  current_price INTEGER NOT NULL,
  discount_percentage INTEGER NOT NULL,
  airline VARCHAR(100) NOT NULL,
  airline_logo VARCHAR(255),
  image_url VARCHAR(255),
  departure_date DATE,
  return_date DATE,
  seats_remaining INTEGER DEFAULT 0,
  deal_expires_at TIMESTAMP WITH TIME ZONE,
  category VARCHAR(50) DEFAULT 'budget',
  rating DECIMAL(2,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  competitor_price INTEGER,
  daily_bookings INTEGER DEFAULT 0,
  partner_id VARCHAR(100),
  affiliate_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_deal_of_day BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  preferences JSONB DEFAULT '{}',
  is_premium BOOLEAN DEFAULT false,
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email subscriptions table
CREATE TABLE email_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_type VARCHAR(50) NOT NULL DEFAULT 'newsletter',
  is_active BOOLEAN DEFAULT true,
  preferences JSONB DEFAULT '{}',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Create click tracking table
CREATE TABLE click_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES flight_deals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create price alerts table
CREATE TABLE price_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  destination VARCHAR(100) NOT NULL,
  max_price INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  triggered_at TIMESTAMP WITH TIME ZONE
);

-- Create email campaigns table
CREATE TABLE email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  sent_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_flight_deals_category ON flight_deals(category);
CREATE INDEX idx_flight_deals_featured ON flight_deals(is_featured);
CREATE INDEX idx_flight_deals_deal_of_day ON flight_deals(is_deal_of_day);
CREATE INDEX idx_flight_deals_expires ON flight_deals(deal_expires_at);
CREATE INDEX idx_click_tracking_deal_id ON click_tracking(deal_id);
CREATE INDEX idx_click_tracking_user_id ON click_tracking(user_id);
CREATE INDEX idx_price_alerts_user_id ON price_alerts(user_id);
CREATE INDEX idx_price_alerts_active ON price_alerts(is_active);

-- Enable Row Level Security
ALTER TABLE flight_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Flight deals are viewable by everyone" ON flight_deals FOR SELECT USING (true);
CREATE POLICY "Users can view their own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can manage their own subscriptions" ON email_subscriptions FOR ALL USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can view their own price alerts" ON price_alerts FOR ALL USING (auth.uid() = user_id);
