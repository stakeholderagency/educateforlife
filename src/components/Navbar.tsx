import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X, LogOut, User, Users, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "/logo.png";

type NavLink = { label: string; href: string; children?: { label: string; href: string }[] };

const navLinks: NavLink[] = [
  {
    label: "About",
    href: "/#about",
    children: [
      { label: "Timeline", href: "/timeline" },
      { label: "Memorandum", href: "/memorandum" },
    ],
  },
  { label: "Skills", href: "/skills" },
  { label: "Library", href: "/library" },
  { label: "Chat", href: "/chat" },
  { label: "Townhall", href: "/townhall" },
  { label: "Features", href: "/#features" },
  { label: "Members", href: "/members" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, profile, signOut } = useAuth();

  const initials = (profile?.display_name || profile?.full_name || '?').slice(0, 2).toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl md:text-2xl tracking-tight">
          <img src={logo} alt="Educatefor.Life" className="w-10 h-10 md:w-12 md:h-12" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.children ? (
              <DropdownMenu key={link.label}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                    <Link to={link.href}>{link.label}</Link>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-40">
                  {link.children.map((child) => (
                    <DropdownMenuItem key={child.label} asChild>
                      <Link to={child.href}>{child.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.label}
              </Link>
            )
          )}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 group">
                  <Avatar className="w-8 h-8 border border-primary/30">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs font-display bg-primary/20 text-primary">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to={`/members/${user.id}`} className="flex items-center gap-2">
                    <User className="w-4 h-4" /> My Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/profile/setup" className="flex items-center gap-2">
                    <Users className="w-4 h-4" /> Edit Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-destructive">
                  <LogOut className="w-4 h-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="hero" size="sm" asChild>
              <Link to="/auth">Join Community</Link>
            </Button>
          )}
        </div>

        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 p-6">
              {navLinks.map((link) => (
                <div key={link.label} className="flex flex-col gap-2">
                  <Link
                    to={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.children?.map((child) => (
                    <Link
                      key={child.label}
                      to={child.href}
                      className="text-sm font-medium text-muted-foreground/70 hover:text-foreground transition-colors pl-4"
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              {user ? (
                <>
                  <Link to={`/members/${user.id}`} className="text-base font-medium text-muted-foreground hover:text-foreground" onClick={() => setOpen(false)}>
                    My Profile
                  </Link>
                  <button onClick={() => { signOut(); setOpen(false); }} className="text-base font-medium text-destructive text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <Button variant="hero" size="sm" asChild>
                  <Link to="/auth" onClick={() => setOpen(false)}>Join Community</Link>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
