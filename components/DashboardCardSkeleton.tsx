import { Skeleton } from "@/components/ui/skeleton"

export function DashboardCardSkeleton() {
  return (
    <div className="dashboard-summary-card">
      <Skeleton className="h-[100px] w-[190px]" />
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
} 