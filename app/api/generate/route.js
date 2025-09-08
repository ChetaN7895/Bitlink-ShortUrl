import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    console.log("🔍 Parsing request...");
    const body = await request.json();
    console.log("✅ Request body:", body);

    const client = await clientPromise;
    console.log("✅ MongoDB connected");

    const db = client.db("bitlinks");
    const collection = db.collection("url");

    // Check if URL exists
    const existing = await collection.findOne({ shorturl: body.shorturl });
    console.log("🔍 Existing URL check:", existing);

    if (existing) {
      return NextResponse.json(
        { success: false, error: true, message: "URL already exists!" },
        { status: 400 }
      );
    }

    await collection.insertOne({
      url: body.url,
      shorturl: body.shorturl,
    });
    console.log("✅ Inserted new URL");

    return NextResponse.json(
      { success: true, error: false, message: "URL Generated Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      { success: false, error: true, message: error.message },
      { status: 500 }
    );
  }
}
