import { Spinner } from "@/components/ui/Spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern">
      <div className="text-center">
        <Spinner size="lg" className="mb-4" />
        <p className="text-gray-400 animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
