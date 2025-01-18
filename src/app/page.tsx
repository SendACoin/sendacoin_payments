"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppKit } from "@reown/appkit/react";
import {
  ArrowRight,
  Bell,
  Link,
  Percent,
  Receipt,
  ShoppingCart,
  Zap,
} from "lucide-react";
import Image from "next/image";

export default function Home() {
  const { open } = useAppKit();

  const features = [
    {
      title: "1% Transaction Fee",
      description: "Competitive pricing with just 1% fee per transaction",
      icon: Percent,
    },
    {
      title: "Instant Notifications",
      description: "Real-time payment notifications for seamless operations",
      icon: Bell,
    },
    {
      title: "Digital Products",
      description: "Easily sell digital products and services",
      icon: ShoppingCart,
    },
    {
      title: "Invoice Generation",
      description: "Create and manage professional invoices",
      icon: Receipt,
    },
    {
      title: "Payment Links",
      description: "Share payment links with your customers",
      icon: Link,
    },
    {
      title: "Instant Settlement",
      description: "Receive payments instantly on Solana",
      icon: Zap,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b  bg-[#f3eee3] ">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="flex flex-col gap-8 items-center text-center mb-16">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={180}
            height={38}
            priority
            className="mb-4"
          />

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl">
            Accept Crypto Payments on Solana in Minutes
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl">
            Seamlessly integrate USDC payments into your business with our
            simple-to-use platform
          </p>

          <div className="flex gap-4 mt-4">
            <Button size="lg" onClick={() => open()}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {features.map((feature, index) => (
            <Card key={index} className="transition-colors shadow-none">
              <CardHeader>
                <feature.icon className="h-8 w-8 mb-4 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
