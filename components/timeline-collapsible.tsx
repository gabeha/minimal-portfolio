"use client";

import { ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import TimelineItem, { TimelineItemProps } from "./timeline-item";
import { cn } from "@/lib/utils"; // Adjust the import based on your file structure

interface TimelineCollapsibleProps {
  title: string;
  timelineItems: TimelineItemProps[];
}

export function TimelineCollapsible({
  title,
  timelineItems,
}: TimelineCollapsibleProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-2">
      <div className="flex items-center justify-between flex-col">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            size="default"
            className="w-fit font-normal hover:bg-inherit"
          >
            <span className="text-xl sm:text-2xl">{title}</span>
            <ChevronsUpDown className="h-4 w-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>

      <div className="relative">
        {/* Use the cn utility for conditional class names */}
        <div
          className={cn(
            "relative",
            !isOpen &&
              "text-transparent bg-clip-text bg-linear-to-b from-black to-transparent"
          )}
        >
          {timelineItems[0] && <TimelineItem {...timelineItems[0]} />}
        </div>
      </div>

      <CollapsibleContent className="space-y-2">
        {timelineItems.slice(1).map((item, index) => (
          <TimelineItem key={index + 1} {...item} />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
