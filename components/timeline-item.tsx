import React from "react";

export interface TimelineItemProps {
  title: string;
  date: string;
  location: string;
  subitems: subitemProps[];
}

interface subitemProps {
  category?: string;
  description: string;
}

export default function TimelineItem({
  title,
  date,
  location,
  subitems,
}: TimelineItemProps) {
  return (
    <div>
      <div className="flex justify-between">
        <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
        <span>{date}</span>
      </div>
      <p className="italic">{location}</p>
      <div className="ml-4">
        <ul className="list-disc">
          {subitems.map((subitem, index) => {
            return subitem.category ? (
              <li key={index}>
                <span className="font-semibold">{subitem.category}:</span>{" "}
                <span className="italic">{subitem.description}</span>
              </li>
            ) : (
              <li key={index}>{subitem.description}</li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
