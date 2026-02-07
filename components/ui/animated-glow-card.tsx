"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardCanvasProps {
  children: ReactNode;
  className?: string;
}

const CardCanvas = ({ children, className = "" }: CardCanvasProps) => {
  return (
    <div className={cn("card-canvas", className)}>
      <svg
        style={{ position: "absolute", width: 0, height: 0 }}
        aria-hidden
      >
        <filter
          width="3000%"
          x="-1000%"
          height="3000%"
          y="-1000%"
          id="unopaq"
        >
          <feColorMatrix
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 3 0"
          />
        </filter>
      </svg>
      <div className="card-backdrop" aria-hidden />
      {children}
    </div>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div className={cn("glow-card", className)}>
      <div className="border-element border-left" aria-hidden />
      <div className="border-element border-right" aria-hidden />
      <div className="border-element border-top" aria-hidden />
      <div className="border-element border-bottom" aria-hidden />
      <div className="card-content">{children}</div>
    </div>
  );
};

export { CardCanvas, Card };
