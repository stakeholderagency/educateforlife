import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Filter, Search, ExternalLink, Clock, Calendar, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type VideoCategory = "all" | "interview" | "sprint" | "presentation" | "creative";

interface Video {
  id: string;
  youtubeId: string;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: VideoCategory;
  featured?: boolean;
}

const videos: Video[] = [
  {
    id: "1",
    youtubeId: "xBSBCsCp0jY",
    title: "Interview with Dr. Pinnaree Tea-makorn: Scenarios for AI in Community Driven Education",
    description: "An in-depth conversation exploring how AI can shape community-driven education models and what scenarios we should prepare for.",
    duration: "1:04:46",
    date: "2024",
    category: "interview",
    featured: true,
  },
  {
    id: "2",
    youtubeId: "VcTeZAf0aeU",
    title: "The Case Against Death",
    description: "A thought-provoking discussion on longevity, mortality, and the philosophical implications for education and lifelong learning.",
    duration: "1:32:23",
    date: "2024",
    category: "presentation",
    featured: true,
  },
  {
    id: "3",
    youtubeId: "5vAxRAqLsHQ",
    title: "XR & VR Use Cases in Education",
    description: "Presented at the 2025 EducateforLife commUnity kickoff — exploring immersive technologies and their potential in learning environments.",
    duration: "26:24",
    date: "2024",
    category: "presentation",
  },
  {
    id: "4",
    youtubeId: "w_JlMnJSg9Y",
    title: "How to Create and Grow a Virtual Community-of-Practice (VCoP)",
    description: "A deep dive into the Educatefor.Life case study — lessons learned in building and sustaining a virtual community of practice.",
    duration: "23:19",
    date: "2024",
    category: "presentation",
  },
  {
    id: "5",
    youtubeId: "MrNWKbk-Nc0",
    title: "Meet San José de Las Vegas and the MDE Challenge",
    description: "Discover the MDE Challenge initiative presented at the EducateforLife 2025 Kickoff event.",
    duration: "13:03",
    date: "2024",
    category: "sprint",
  },
  {
    id: "6",
    youtubeId: "tZQ-Bcf2A_g",
    title: "The EdTech Blues",
    description: "A creative musical take on the challenges and joys of educational technology — community storytelling at its finest.",
    duration: "3:20",
    date: "2024",
    category: "creative",
  },
  {
    id: "7",
    youtubeId: "GNNfFTmBsso",
    title: "Welcome to the EducateforLife Sprint",
    description: "Introduction to the EducateforLife Sprint — a $100k innovation & transformation sprint open to all community members.",
    duration: "1:09",
    date: "2018",
    category: "sprint",
  },
];

const categories: { value: VideoCategory; label: string }[] = [
  { value: "all", label: "All Events" },
  { value: "interview", label: "Interviews" },
  { value: "presentation", label: "Presentations" },
  { value: "sprint", label: "Sprint Sessions" },
  { value: "creative", label: "Creative" },
];

const Library = () => {
  const { user, loading } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  if (!loading && !user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 pt-28 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Lock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-3">Members Only</h1>
            <p className="text-muted-foreground mb-6">
              Sign in to access the community library of event recordings, interviews, and presentations.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/auth?mode=login">Sign In to Access</Link>
            </Button>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredVideos = videos.filter((video) => {
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredVideos = filteredVideos.filter((v) => v.featured);
  const regularVideos = filteredVideos.filter((v) => !v.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="outline" className="mb-4 border-primary/40 text-primary px-4 py-1.5">
              <Play className="w-3 h-3 mr-1.5" /> Community Library
            </Badge>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
              <span className="text-foreground">Event </span>
              <span className="text-gradient-primary">Recordings</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
              Relive our community's best moments — interviews, presentations, sprint sessions, and creative collaborations from across the years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 md:px-12 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className="rounded-full"
                >
                  {cat.label}
                </Button>
              ))}
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search recordings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card border-border/50 rounded-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Videos */}
      {featuredVideos.length > 0 && (
        <section className="px-6 md:px-12 pb-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6">Featured</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredVideos.map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i}
                  isPlaying={playingVideo === video.id}
                  onPlay={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                  large
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Videos Grid */}
      <section className="px-6 md:px-12 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-semibold text-foreground">
              {selectedCategory === "all" ? "All Recordings" : categories.find(c => c.value === selectedCategory)?.label}
            </h2>
            <span className="text-sm text-muted-foreground">{filteredVideos.length} videos</span>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No recordings found matching your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(regularVideos.length > 0 ? regularVideos : filteredVideos).map((video, i) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  index={i}
                  isPlaying={playingVideo === video.id}
                  onPlay={() => setPlayingVideo(playingVideo === video.id ? null : video.id)}
                />
              ))}
            </div>
          )}

          {/* YouTube Channel CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="inline-flex flex-col items-center gap-4 p-8 rounded-2xl bg-card border border-border/50">
              <p className="text-muted-foreground">Want more? Visit our full YouTube channel for all recordings.</p>
              <Button variant="outline" asChild className="gap-2">
                <a href="https://www.youtube.com/@educateforlifesprint" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" /> EducateforLife on YouTube
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

function VideoCard({
  video,
  index,
  isPlaying,
  onPlay,
  large,
}: {
  video: Video;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  large?: boolean;
}) {
  const categoryColors: Record<VideoCategory, string> = {
    all: "bg-primary/20 text-primary",
    interview: "bg-blue-500/20 text-blue-400",
    sprint: "bg-accent/20 text-accent",
    presentation: "bg-emerald-500/20 text-emerald-400",
    creative: "bg-pink-500/20 text-pink-400",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-xl overflow-hidden bg-card border border-border/50 hover:border-primary/30 transition-all duration-300"
    >
      <div className="relative cursor-pointer" onClick={onPlay}>
        <AspectRatio ratio={16 / 9}>
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          ) : (
            <>
              <img
                src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-background/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center shadow-lg">
                  <Play className="w-6 h-6 text-primary-foreground ml-0.5" fill="currentColor" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-background/80 text-xs text-foreground font-medium flex items-center gap-1">
                <Clock className="w-3 h-3" /> {video.duration}
              </div>
            </>
          )}
        </AspectRatio>
      </div>

      <div className={`p-4 ${large ? "md:p-5" : ""}`}>
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColors[video.category]}`}>
            {video.category}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {video.date}
          </span>
        </div>
        <h3 className={`font-display font-semibold text-foreground leading-snug mb-1.5 line-clamp-2 ${large ? "text-lg" : "text-sm"}`}>
          {video.title}
        </h3>
        <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{video.description}</p>
      </div>
    </motion.div>
  );
}

export default Library;
