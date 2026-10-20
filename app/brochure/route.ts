import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const publicPath = path.join(process.cwd(), "public", "GENESIS_6_BROCHURE_.pdf");
  const requiredPath = path.join(process.cwd(), "required files", "GENESIS_6_BROCHURE_.pdf");
  const targetPath = fs.existsSync(publicPath) ? publicPath : requiredPath;

  if (!fs.existsSync(targetPath)) {
    return new NextResponse("Genesis Tournament Brochure PDF not found", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(targetPath);

    // Also mirror to public directory for static caching if not already there
    const publicPath = path.join(process.cwd(), "public", "GENESIS_6_BROCHURE_.pdf");
    if (!fs.existsSync(publicPath)) {
      try {
        fs.copyFileSync(filePath, publicPath);
      } catch {
        // Non-blocking fallback
      }
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="GENESIS_6_BROCHURE_.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error("Error serving Genesis brochure PDF:", err);
    return new NextResponse("Error loading Genesis brochure PDF", { status: 500 });
  }
}
