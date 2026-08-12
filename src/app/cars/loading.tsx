import { Skeleton } from "@/components/ui/skeleton";

export default function CarsLoading() {
  return (
    <div className="container-page pb-20 pt-8">
      <Skeleton className="h-[74px] w-full rounded-[var(--radius-2xl)]" />

      <div className="mt-8 grid gap-8 lg:grid-cols-[264px_1fr]">
        <div className="hidden lg:block">
          <div className="space-y-6 rounded-[var(--radius-2xl)] border border-hairline bg-surface p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-9 w-full" />
                <Skeleton className="h-9 w-4/5" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-9 w-40" />
          </div>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[var(--radius-2xl)] border border-hairline bg-surface"
              >
                <Skeleton className="aspect-[16/10] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
