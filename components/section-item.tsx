import React from "react";

export interface SectionItemProps {
  category: string;
  description: string;
}

export default function TimelineItem({
  category,
  description,
}: SectionItemProps) {
  return (
    <div>
      <h3 className="text-base sm:text-lg font-semibold">{category}</h3>
      <span>{description}</span>
    </div>
  );
}
