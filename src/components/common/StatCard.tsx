import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  variant?: "default" | "primary";
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = "default",
}: StatCardProps) {
  if (variant === "primary") {
    return (
      <div className={cn("stat-card-primary", className)}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary-foreground/80">{title}</p>
            <p className="text-3xl font-bold text-primary-foreground">{value}</p>
            {description && (
              <p className="text-xs text-primary-foreground/70">{description}</p>
            )}
          </div>
          <div className="rounded-lg bg-primary-foreground/20 p-3">
            <Icon className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("stat-card group", className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              <span className={cn(
                "inline-block",
                trend.isPositive ? "rotate-0" : "rotate-180"
              )}>↑</span>
              {trend.value}% from last month
            </p>
          )}
        </div>
        <div className="rounded-lg bg-primary/10 p-3 group-hover:bg-primary/20 transition-colors">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
