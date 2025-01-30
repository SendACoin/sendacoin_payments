"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
            <p className="text-lg leading-relaxed text-gray-600 max-w-[500px]">
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
  const { address, isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isConnected && address) {
      router.push(`/client/550e8400-e29b-41d4-a716-446655440000`);
    }
  }, [isConnected, address, router]);

  const features = [
    {
      title: "1% Transaction Fee",
      description:
        "Experience cost-effective payment processing with our competitive 1% transaction fee. We keep our pricing transparent and straightforward so you can focus on growing your business.",
      icon: "/1.png",
    },
    {
      title: "Instant Notifications",
      description:
        "Stay informed with real-time payment notifications that keep you updated on every transaction. Our instant alert system ensures you never miss a payment and can manage your business operations efficiently.",
      icon: "/2.png",
    },
    {
      title: "Digital Products",
      description:
        "Expand your online business by selling digital products and services with ease. Our platform provides secure delivery and automated fulfillment, making it simple to manage your digital inventory.",
      icon: "/3.png",
    },
    {
      title: "Invoice Generation",
      description:
        "Create professional, customizable invoices in seconds with our intuitive invoice generation system. Keep track of all your transactions and maintain organized financial records effortlessly.",
      icon: "/4.png",
    },
    {
      title: "Instant Settlement",
      description:
        "Experience the power of instant payments with Solana blockchain technology. Your funds are settled immediately after transaction confirmation, providing you with quick access to your earnings.",
      icon: "/5.png",
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
            Seamlessly integrate SOL payments into your business with our
            simple-to-use platform
          </p>

          <div className="flex gap-4 mt-4">
            <Button size="lg" onClick={() => open()}>
              Connect Wallet <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                router.push(`/example`);
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
              <img src={feature.icon} className="max-w-[500px]" />
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}
