import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

/**
 * Shown with every chat and meeting window. Taking part means accepting the
 * Code of Conduct, so the wording says so wherever someone is about to join.
 */
const CodeOfConductNotice = ({ className = '' }: { className?: string }) => (
  <p className={`flex items-center gap-2 text-xs text-muted-foreground ${className}`}>
    <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
    <span>
      By joining, you agree to follow our{' '}
      <Link to="/code-of-conduct" className="text-primary hover:underline font-medium">Code of Conduct</Link>
      {' '}— a safe, fun and respectful place for everyone, families included.
    </span>
  </p>
);

export default CodeOfConductNotice;
