"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductData {
  name: string;
  description: string;
  price: number;
  rating: number;
  imageUrl: string;
}

const product: ProductData = {
  name: "Premium Wireless Headphones",
  description:
    "High-quality wireless headphones with noise cancellation, premium sound quality, and comfortable fit. Perfect for music lovers and professionals alike.",
  price: 299.99,
  rating: 4.5,
  imageUrl:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
};

const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          className={`h-5 w-5 ${
            index < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
};

const Page = () => {
  const router = useRouter();
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative aspect-square">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="object-cover rounded-lg w-full h-full"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <RatingStars rating={product.rating} />

            <div className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </div>

            <p className="text-gray-600 mt-4">{product.description}</p>

            <div className="mt-8">
              <Button
                onClick={() => {
                  router.push("/order?amount=299.99");
                }}
                size="lg"
                className="w-full"
              >
                Purchase
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Page;
