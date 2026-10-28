import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Globe, MapPin, Users } from 'lucide-react';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

const COUNTRY_COORDS: Record<string, [number, number]> = {
  'United States': [-95, 38], 'USA': [-95, 38], 'US': [-95, 38],
  'United Kingdom': [-2, 54], 'UK': [-2, 54],
  'Germany': [10, 51], 'France': [2, 47], 'Spain': [-4, 40],
  'Italy': [12, 42], 'Netherlands': [5, 52], 'Belgium': [4, 51],
  'Switzerland': [8, 47], 'Austria': [14, 48], 'Sweden': [15, 62],
  'Norway': [10, 62], 'Denmark': [10, 56], 'Finland': [26, 64],
  'Poland': [20, 52], 'Portugal': [-8, 39],
  'Canada': [-106, 56], 'Mexico': [-102, 24],
  'Brazil': [-51, -10], 'Argentina': [-64, -34],
  'India': [79, 21], 'China': [104, 35], 'Japan': [138, 36],
  'South Korea': [128, 36], 'Australia': [134, -25],
  'New Zealand': [174, -41], 'South Africa': [25, -29],
  'Nigeria': [8, 10], 'Kenya': [38, 0], 'Egypt': [30, 27],
  'UAE': [54, 24], 'United Arab Emirates': [54, 24],
  'Saudi Arabia': [45, 24], 'Israel': [35, 31],
  'Turkey': [35, 39], 'Russia': [105, 60],
  'Singapore': [104, 1], 'Malaysia': [102, 4],
  'Indonesia': [120, -5], 'Thailand': [101, 15],
  'Vietnam': [108, 16], 'Philippines': [122, 13],
  'Colombia': [-74, 4], 'Chile': [-71, -35],
  'Peru': [-76, -10], 'Ireland': [-8, 53],
  'Czech Republic': [15, 50], 'Romania': [25, 46],
  'Greece': [22, 39], 'Hungary': [20, 47],
  'Ukraine': [32, 49], 'Pakistan': [69, 30],
  'Bangladesh': [90, 24], 'Sri Lanka': [81, 7],
  'Ghana': [-2, 8], 'Tanzania': [35, -6],
  'Ethiopia': [40, 9], 'Morocco': [-5, 32],
  'Albania': [20, 41], 'Bosnia and Herzegovina': [18, 44],
  'Belize': [-88, 17], 'Guyana': [-59, 5],
};

interface MemberStats {
  total_count: number;
  locations: Array<{ city: string | null; country: string | null }> | null;
  type_counts: Record<string, number> | null;
}

const SocialProofSection = () => {
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerItems, setTickerItems] = useState<string[]>([]);

  const handleMouseMove = useCallback((geo: any, evt: React.MouseEvent) => {
    const name = geo.properties?.name || geo.properties?.NAME || '';
    setTooltip({ x: evt.clientX, y: evt.clientY, name });
  }, []);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.rpc('get_public_member_stats');
      const s = data as unknown as MemberStats | null;
      setStats(s);

      // Build ticker items from locations
      if (s?.locations) {
        const items = s.locations
          .filter(l => l.city || l.country)
          .map(l => {
            const location = [l.city, l.country].filter(Boolean).join(', ');
            return `A new member joined from ${location}`;
          });
        // Shuffle and take a subset for variety
        const shuffled = items.sort(() => Math.random() - 0.5).slice(0, 20);
        setTickerItems(shuffled);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Rotate ticker
  useEffect(() => {
    if (tickerItems.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickerItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [tickerItems]);

  // Build markers
  const markers: Array<{ name: string; coords: [number, number] }> = [];
  if (stats?.locations) {
    const seen = new Set<string>();
    for (const loc of stats.locations) {
      const key = [loc.city, loc.country].filter(Boolean).join(', ');
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const country = loc.country || '';
      const coords = COUNTRY_COORDS[country];
      if (coords) {
        const offset = loc.city ? (Math.random() - 0.5) * 4 : 0;
        markers.push({ name: key, coords: [coords[0] + offset, coords[1] + offset] });
      }
    }
  }

  return (
    <section className="py-16 px-6 md:px-12 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Globe className="w-6 h-6 text-primary" />
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
                A Global Community
              </h2>
            </div>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {loading ? 'Loading...' : `${stats?.total_count || 0} members across ${markers.length} locations worldwide`}
            </p>
          </div>

          {/* News Ticker */}
          {tickerItems.length > 0 && (
            <div className="bg-card border border-border rounded-full px-6 py-3 mb-8 max-w-lg mx-auto overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tickerIndex}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center justify-center gap-2 text-sm"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="text-muted-foreground truncate">{tickerItems[tickerIndex]}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* Map */}
          <div className="bg-card border border-border rounded-2xl p-4 md:p-6 overflow-hidden relative">
            <ComposableMap
              projectionConfig={{ scale: 147, center: [0, 20] as any }}
              className="w-full h-auto"
              style={{ maxHeight: '420px' }}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill="hsl(var(--muted))"
                      stroke="hsl(var(--border))"
                      strokeWidth={0.5}
                      onMouseMove={(evt) => handleMouseMove(geo, evt as unknown as React.MouseEvent)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        default: { outline: 'none' },
                        hover: { fill: 'hsl(var(--accent))', outline: 'none' },
                        pressed: { outline: 'none' },
                      }}
                    />
                  ))
                }
              </Geographies>
              {markers.map(({ name, coords }, i) => (
                <Marker key={`${name}-${i}`} coordinates={coords as any}>
                  <circle r={4} fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth={1.5} opacity={0.85} />
                  <title>{name}</title>
                </Marker>
              ))}
            </ComposableMap>
            {tooltip && (
              <div
                className="fixed pointer-events-none z-50 px-2 py-1 rounded bg-popover text-popover-foreground text-xs font-normal shadow-sm border border-border"
                style={{ left: tooltip.x + 12, top: tooltip.y - 28 }}
              >
                {tooltip.name}
              </div>
            )}
          </div>

          {/* Member count badge */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-5 py-2 text-sm">
              <Users className="w-4 h-4 text-primary" />
              <span className="font-semibold text-foreground">{loading ? '—' : stats?.total_count || 0}</span>
              <span className="text-muted-foreground">members and counting</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SocialProofSection;
