"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

interface UnifiedQuizPanelProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  items: Array<{ q_no: string; display_text: string }>;
  routePrefix: string;
}

export default function UnifiedQuizPanel({
  title,
  subtitle,
  icon: Icon,
  items,
  routePrefix,
}: UnifiedQuizPanelProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-12 bg-background">
      <Card className="w-full max-w-2xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
        {/* Header */}
        <CardHeader className="flex flex-col items-center gap-4 text-center border-b border-border/50">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold tracking-tight">
              {title}
            </CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </CardHeader>

        {/* Content */}
        <CardContent className="pt-6">
          <div className="space-y-2">
            {items.map((item) => (
              <Link
                key={item.q_no}
                href={`${routePrefix}/${item.q_no}`}
                className="group flex items-center justify-between p-4 rounded-lg border border-transparent hover:border-border hover:bg-muted/50 transition-all duration-200"
              >
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {item.display_text}
                </span>
                <Badge
                  variant="outline"
                  className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all flex items-center gap-1"
                >
                  View
                  <ChevronRight className="w-3 h-3" />
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
