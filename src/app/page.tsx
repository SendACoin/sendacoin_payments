"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
import { useRouter } from "next/navigation";

interface FeatureCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  imagePosition?: "left" | "right";
}

function FeatureCard({
  title,
  description,
  children,
  className,
  imagePosition = "left",
}: FeatureCardProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden",
        imagePosition === "left" && "bg-gradient-to-br ",
        className
      )}
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className={cn(
              "flex justify-center lg:justify-start",
              imagePosition === "right" ? "lg:order-2" : "lg:order-1"
            )}
          >
            {children}
          </div>
          <div
            className={cn(
              "space-y-6",
              imagePosition === "right" ? "lg:order-1" : "lg:order-2"
            )}
          >
            <h2 className="text-[32px] font-semibold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { open } = useAppKit();
  const router = useRouter();

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
            Accept Crypto Payments on Your website in Minutes
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl">
            Seamlessly integrate USDC payments into your business with our
            simple-to-use platform
          </p>

          <div className="flex gap-4 mt-4">
            <Button size="lg" onClick={() => open()}>
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                router.push(`/order?amount=1`);
              }}
            >
              View Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="flex flex-col gap-8 mt-16 space-y-20">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              imagePosition={index % 2 === 0 ? "left" : "right"}
            >
              <feature.icon className="h-16 w-16 text-primary" />
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}
