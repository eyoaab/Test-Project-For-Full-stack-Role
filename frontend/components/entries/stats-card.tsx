import { memo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  description?: string;
  color?: string;
  gradient?: string;
}

function StatsCardComponent({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  color = "bg-purple-600",
  gradient = "from-purple-500 to-purple-700"
}: StatsCardProps) {
  return (
    <Card className="border-0 shadow-smooth hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-white overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-10">
          <Icon className="w-full h-full text-purple-600" />
        </div>
        
        <div className="relative space-y-3">
          <div className="flex items-center justify-between">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-md`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            {description && (
              <p className="text-xs text-gray-500 font-medium">{description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export const StatsCard = memo(StatsCardComponent);
