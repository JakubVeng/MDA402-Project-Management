"use client";
import { Button } from "@/components/button";

export const Print = () => {
  return (
    <Button
      className="border border-gray-200 px-3 py-2 mb-5 rounded-xl w-32"
      onClick={() => window.print()}
    >
      Print
    </Button>
  );
};
