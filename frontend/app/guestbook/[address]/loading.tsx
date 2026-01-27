import { PageWrapper } from "@/components/Layout";
import { Skeleton, SignatureCardSkeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <div className="py-8">
        {/* Owner info skeleton */}
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 rounded-xl bg-gray-900/50 border border-white/5">
              <Skeleton className="h-8 w-12 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>

        {/* Signatures skeleton */}
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <SignatureCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
