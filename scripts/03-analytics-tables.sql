-- Create analytics events table
CREATE TABLE analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name VARCHAR(100) NOT NULL,
  event_data JSONB DEFAULT '{}',
  session_id VARCHAR(255),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create A/B test results table
CREATE TABLE ab_test_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  test_name VARCHAR(100) NOT NULL,
  variant VARCHAR(50) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  conversion_type VARCHAR(100),
  converted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create performance metrics table
CREATE TABLE performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name VARCHAR(100) NOT NULL,
  metric_value DECIMAL(10,2) NOT NULL,
  page_path VARCHAR(255),
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_ab_test_results_test_name ON ab_test_results(test_name);
CREATE INDEX idx_ab_test_results_variant ON ab_test_results(variant);
CREATE INDEX idx_performance_metrics_name ON performance_metrics(metric_name);

-- Enable RLS
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_test_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies (admin access only for analytics data)
CREATE POLICY "Analytics events are viewable by authenticated users" ON analytics_events FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "AB test results are viewable by authenticated users" ON ab_test_results FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Performance metrics are viewable by authenticated users" ON performance_metrics FOR SELECT USING (auth.role() = 'authenticated');
