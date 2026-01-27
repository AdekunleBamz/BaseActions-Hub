import { PageWrapper } from "@/components/Layout";
import { Skeleton, StatCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <div className="py-8">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-56 mx-auto mb-2" />
          <Skeleton className="h-5 w-80 mx-auto" />
        </div>

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>

        {/* Activity section skeleton */}
        <div className="rounded-2xl bg-gray-900/50 border border-white/5 p-6">
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-48 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
