import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { Users, ArrowRight, Globe, MapPin, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

// Approximate geocoding for common countries/cities
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
};

interface MemberStats {
  total_count: number;
  locations: Array<{ city: string | null; country: string | null }> | null;
  type_counts: Record<string, number> | null;
  countries_count: number | null;
  newest_member: { name: string; joined_at: string } | null;
}

const CommunityOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; name: string } | null>(null);

  const handleMouseMove = useCallback((geo: any, evt: React.MouseEvent) => {
    const name = geo.properties?.name || geo.properties?.NAME || '';
    setTooltip({ x: evt.clientX, y: evt.clientY, name });
  }, []);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await supabase.rpc('get_public_member_stats');
      setStats(data as unknown as MemberStats | null);
      setLoading(false);
    };
    fetchStats();
  }, []);

  // Deduplicate locations and resolve coords
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
        // Offset slightly for multiple cities in same country
        const offset = loc.city ? (Math.random() - 0.5) * 4 : 0;
        markers.push({ name: key, coords: [coords[0] + offset, coords[1] + offset] });
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Globe className="w-10 h-10 text-primary" />
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Our Global Community
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A worldwide network of changemakers, learners, and innovators committed to lifelong growth.
            </p>
          </div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12"
          >
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-foreground">
                {loading ? '—' : stats?.total_count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Members</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-foreground">
                {loading ? '—' : stats?.countries_count || 0}
              </div>
              <div className="text-sm text-muted-foreground">Countries represented</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <UserPlus className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-display text-xl font-bold text-foreground min-h-9 flex items-center justify-center">
                {loading ? '—' : stats?.newest_member?.name || 'No new members yet'}
              </div>
              <div className="text-sm text-muted-foreground">Newest member</div>
            </div>
          </motion.div>

          {/* World Map */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-4 md:p-8 mb-12 overflow-hidden"
          >
            <ComposableMap
              projectionConfig={{ scale: 147, center: [0, 20] as any }}
              className="w-full h-auto"
              style={{ maxHeight: '500px' }}
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
                  <circle r={5} fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth={1.5} opacity={0.85} />
                  <title>{name}</title>
                </Marker>
              ))}
            </ComposableMap>
            {markers.length === 0 && !loading && (
              <p className="text-center text-muted-foreground text-sm mt-4">
                Member locations will appear here as the community grows.
              </p>
            )}
            {tooltip && (
              <div
                className="fixed pointer-events-none z-50 px-2 py-1 rounded bg-popover text-popover-foreground text-xs font-normal shadow-sm border border-border"
                style={{ left: tooltip.x + 12, top: tooltip.y - 28 }}
              >
                {tooltip.name}
              </div>
            )}
          </motion.div>

          {/* CTA */}
          <div className="text-center">
            {user ? (
              <Button size="lg" asChild>
                <Link to="/members/directory" className="flex items-center gap-2">
                  Browse Member Directory <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Sign in to explore the full member directory and connect with the community.
                </p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <Button variant="hero" size="lg" asChild>
                    <Link to="/auth" className="flex items-center gap-2">
                      Join the Community <ArrowRight className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button variant="heroOutline" size="lg" asChild>
                    <Link to="/auth?mode=login" className="flex items-center gap-2">
                      Member Login
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CommunityOverview;
