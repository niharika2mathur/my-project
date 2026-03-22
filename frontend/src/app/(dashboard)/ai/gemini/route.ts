import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Use ONLY the server-side key for security
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is missing from .env file" }, 
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      // Sending the specific Google error (like 'Invalid API Key') to the frontend
      return NextResponse.json(
        { error: data.error?.message || "Gemini API Error", details: data }, 
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message }, 
      { status: 500 }
    );
  }
}