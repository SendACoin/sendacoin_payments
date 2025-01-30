"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface SettingsFormData {
  name: string;
  logoUrl: string;
  webhookUrl: string;
}

const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SettingsFormData>({
    name: "",
    logoUrl: "",
    webhookUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement settings update logic
    setIsLoading(false);
  };

  return (
    <div className="container py-2">
      <h1 className="text-3xl font-bold px-6">Settings</h1>
      <Card className="p-6 shadow-none border-none">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Enter your business name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo URL</Label>
            <Input
              id="logoUrl"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, logoUrl: e.target.value }))
              }
              placeholder="Enter your logo URL"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookUrl">Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={formData.webhookUrl}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, webhookUrl: e.target.value }))
              }
              placeholder="Enter your webhook URL"
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Page;
