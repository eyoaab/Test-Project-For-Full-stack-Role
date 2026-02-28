import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  color?: string;
}

export function StatsCard({ title, value, icon: Icon, description, color = "bg-primary" }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-full ${color} bg-opacity-10 flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
