import Link from "next/link";
import { Compass } from "lucide-react";

export function Brand({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="flex items-center gap-2 px-1">
      <span className="flex size-7 items-center justify-center rounded-md bg-foreground text-background">
        <Compass className="size-4" strokeWidth={2.25} />
      </span>
      <span className="text-sm font-semibold tracking-tight">TaskPilot</span>
    </Link>
  );
}
