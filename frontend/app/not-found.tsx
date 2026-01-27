import Link from "next/link";
import { PageWrapper } from "@/components/Layout";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <PageWrapper>
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-8xl font-bold gradient-text mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
          <p className="text-gray-400 mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button variant="primary">Go Home</Button>
            </Link>
            <Link href="/leaderboard">
              <Button variant="secondary">View Leaderboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
