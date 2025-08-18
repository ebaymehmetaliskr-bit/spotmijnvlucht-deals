-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  destination VARCHAR(100) NOT NULL,
  country VARCHAR(100) NOT NULL,
  origin VARCHAR(100) DEFAULT 'Amsterdam',
  current_price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2) NOT NULL,
  discount_percentage INTEGER GENERATED ALWAYS AS (
    ROUND(((original_price - current_price) / original_price * 100)::numeric)
  ) STORED,
  airline VARCHAR(100) NOT NULL,
  airline_logo_url TEXT,
  departure_date DATE,
  return_date DATE,
  deal_expiration TIMESTAMP WITH TIME ZONE NOT NULL,
  seats_available INTEGER DEFAULT 10,
  affiliate_url TEXT NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  destination_image_url TEXT,
  category VARCHAR(50) DEFAULT 'budget',
  rating DECIMAL(2,1) DEFAULT 4.5,
  review_count INTEGER DEFAULT 0,
  last_booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  booking_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  subscription_type VARCHAR(50) DEFAULT 'newsletter',
  preferences JSONB DEFAULT '{}',
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_email_sent TIMESTAMP WITH TIME ZONE,
  email_count INTEGER DEFAULT 0,
  source VARCHAR(100) DEFAULT 'website'
);

-- Create click_tracking table
CREATE TABLE IF NOT EXISTS click_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2),
  converted_at TIMESTAMP WITH TIME ZONE
);

-- Create email_campaigns table
CREATE TABLE IF NOT EXISTS email_campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  campaign_type VARCHAR(50) NOT NULL, -- 'newsletter', 'deal_alert', 'welcome', 'broadcast'
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'scheduled', 'sent', 'cancelled'
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  open_count INTEGER DEFAULT 0,
  click_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analytics_events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL, -- 'page_view', 'deal_click', 'email_signup', 'conversion'
  event_data JSONB DEFAULT '{}',
  user_id VARCHAR(255),
  session_id VARCHAR(255),
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET,
  referrer TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deals_active ON deals(is_active);
CREATE INDEX IF NOT EXISTS idx_deals_featured ON deals(is_featured);
CREATE INDEX IF NOT EXISTS idx_deals_expiration ON deals(deal_expiration);
CREATE INDEX IF NOT EXISTS idx_deals_category ON deals(category);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_active ON subscribers(is_active);
CREATE INDEX IF NOT EXISTS idx_click_tracking_deal_id ON click_tracking(deal_id);
CREATE INDEX IF NOT EXISTS idx_click_tracking_clicked_at ON click_tracking(clicked_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);

-- Enable Row Level Security
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now, can be restricted later)
CREATE POLICY "Allow all operations on deals" ON deals FOR ALL USING (true);
CREATE POLICY "Allow all operations on subscribers" ON subscribers FOR ALL USING (true);
CREATE POLICY "Allow all operations on click_tracking" ON click_tracking FOR ALL USING (true);
CREATE POLICY "Allow all operations on email_campaigns" ON email_campaigns FOR ALL USING (true);
CREATE POLICY "Allow all operations on admin_users" ON admin_users FOR ALL USING (true);
CREATE POLICY "Allow all operations on analytics_events" ON analytics_events FOR ALL USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
