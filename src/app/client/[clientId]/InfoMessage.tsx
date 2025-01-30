"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const InfoMessage = () => {
  return (
    <div>
      <Alert variant="default" className="mb-6 bg-[#f3eee3]">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>You can view the sample checkout page </span>
          <a href="/example" target="_BLANK">
            <Button variant="default" size="sm">
              View Demo
            </Button>
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default InfoMessage;
