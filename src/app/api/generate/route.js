import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Connect to DB and check user's plan and count
    await connectDB();

    let user = await User.findOne({ clerkId: userId });

    // Create user if doesn't exist
    if (!user) {
      const clerkUser = await (
        await import("@clerk/nextjs/server")
      ).currentUser();
      user = await User.create({
        clerkId: userId,
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.emailAddresses[0].emailAddress,
      });
    }

    // Check if user has reached limit (free plan = 5 images)
    if (user.plan === "free" && user.imageCount >= 5) {
      return NextResponse.json(
        {
          error: "Image limit reached. Please upgrade to continue.",
          limitReached: true,
        },
        { status: 403 }
      );
    }

    // Generate image using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent([
      {
        text: `Generate a detailed, creative image based on this prompt: ${prompt}. Return ONLY a direct URL to the generated image, nothing else.`,
      },
    ]);

    const response = await result.response;
    const imageUrl = response.text().trim();

    // For now, we'll return a placeholder since Gemini doesn't directly generate images
    // In production, you'd integrate with an actual image generation API
    const placeholderImageUrl = `https://placehold.co/512x512/6366f1/ffffff?text=${encodeURIComponent(
      prompt.substring(0, 30)
    )}`;
    console.log("Generated image URL:", imageUrl);
    console.log("response: ", response);

    return NextResponse.json({
      imageUrl: imageUrl,
      message: "Image generated successfully",
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      {
        error: "Failed to generate image",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
