"use client";
import React from "react";
import { Progress } from "@/components/ui/progress";
interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    
  return (
    <div className=" bg-gray-200 rounded-full dark:bg-gray-700 mt-1.5">
      <div
        className="bg-blue-600 text-xs font-medium text-foreground text-center p-0.5 leading-none rounded-full animate-pulse"
        style={{ width: `${progress}%` }}
      >
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
