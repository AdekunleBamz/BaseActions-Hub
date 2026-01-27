import { PageWrapper } from "@/components/Layout";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <PageWrapper>
      <div className="py-8">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="h-10 w-48 mx-auto mb-2" />
          <Skeleton className="h-5 w-72 mx-auto" />
        </div>

        {/* Form skeleton */}
        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl bg-gray-900/50 border border-white/5 p-6">
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton className="h-12 w-full mb-4" />
            
            <Skeleton className="h-5 w-32 mb-3" />
            <Skeleton className="h-24 w-full mb-4" />
            
            {/* Quick messages skeleton */}
            <div className="flex gap-2 flex-wrap mb-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-24 rounded-full" />
              ))}
            </div>
            
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
