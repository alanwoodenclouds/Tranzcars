import { Skeleton } from "@/components/ui/skeleton";

export default function CarDetailLoading() {
  return (
    <div className="container-page pb-20 pt-8">
      <Skeleton className="h-4 w-40" />
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <Skeleton className="aspect-[16/9] w-full rounded-[var(--radius-2xl)]" />
          <Skeleton className="mt-6 h-9 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/3" />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-[var(--radius-xl)]" />
            ))}
          </div>
          <Skeleton className="mt-8 h-40 w-full rounded-[var(--radius-xl)]" />
        </div>
        <Skeleton className="h-[380px] w-full rounded-[var(--radius-2xl)]" />
      </div>
    </div>
  );
}
