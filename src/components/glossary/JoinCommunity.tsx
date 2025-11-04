import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function JoinCommunity() {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        <Users className="h-4 w-4" />
        Join our Community
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Get tips, new terms, and updates from our experts.
      </p>
      <Button asChild className="w-full">
        <Link href="/community">Join Now</Link>
      </Button>
    </div>
  );
}