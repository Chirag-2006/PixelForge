"use client";

import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PromptInput() {
  const router = useRouter();

  return (
    <div className="flex items-center w-full max-w-sm mx-auto bg-purple-600 rounded-md p-1 mt-10">
      <Input
        type="text"
        placeholder="Enter your prompt"
        className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white"
      />
      <Button
        size="lg"
        variant="ghost"
        className="text-white hover:bg-white rounded-md"
        onClick={() => router.push("/create")}
      >
        <ArrowRight className="size-5" />
      </Button>
    </div>
  );
}
