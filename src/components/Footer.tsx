import logo from "/logo.png";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <a href="#" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight">
          <img src={logo} alt="Educatefor.Life" className="w-10 h-10" />
        </a>

        <div className="flex items-center gap-6">
          <a
            href="https://www.youtube.com/channel/UCCoIUAn_lKLZFb2rYFXDuEw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            YouTube
          </a>
          <a
            href="https://educatefor.life"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Website
          </a>
        </div>

        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Educatefor.Life
        </p>
      </div>
    </footer>
  );
};

export default Footer;
