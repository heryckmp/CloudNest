import { Skeleton } from "@/components/ui/skeleton"

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-[18px] bg-sky-100 dark:bg-[#2a4270] p-5 shadow-sm">
      <div className="flex justify-between">
        <Skeleton className="h-20 w-20" />
        <div className="flex flex-col items-end justify-between">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
} 