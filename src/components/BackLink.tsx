import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function BackLink({ href, label = "Back" }: { href: string; label?: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-ink"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  );
}
