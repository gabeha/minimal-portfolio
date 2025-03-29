// scripts/generatePlaceholders.ts

import * as fs from "fs";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import path from "path";
import dotenv from "dotenv";

dotenv.config(); // Load env vars

const supabaseBucket = "images"; // Your Supabase bucket name

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Initialize Supabase client (anon or service role if private)
const supabase = createClient(supabaseUrl, supabaseKey);

// Where we'll write/read placeholders.json
const outputPath = path.join(process.cwd(), "public", "placeholders.json");

/**
 * Recursively list all files (not folders) in the Supabase bucket,
 * starting from the given `prefix` (folder path).
 *
 * Returns an array of full file paths like "albumName/image.jpg" or
 * "albumName/subalbum/file.png", etc.
 */
async function listAllFiles(prefix = ""): Promise<string[]> {
  const { data: items, error } = await supabase.storage
    .from(supabaseBucket)
    .list(prefix, { limit: 10000 });

  if (error) {
    console.error(`Error listing files in folder '${prefix}':`, error);
    return [];
  }
  if (!items) return [];

  const result: string[] = [];

  // For each item, check if it's a folder (metadata === null) or a file
  for (const item of items) {
    // Skip the special .emptyFolderPlaceholder
    if (item.name === ".emptyFolderPlaceholder") continue;

    // If metadata === null, it's a "folder"
    if (item.metadata === null) {
      // Build the subfolder path
      const subfolderPath = prefix ? `${prefix}/${item.name}` : item.name;
      // Recurse into subfolder
      const subfiles = await listAllFiles(subfolderPath);
      result.push(...subfiles);
    } else {
      // It's a file. Build the full path (including prefix).
      const filePath = prefix ? `${prefix}/${item.name}` : item.name;
      result.push(filePath);
    }
  }

  return result;
}

async function generatePlaceholders() {
  try {
    console.log("Listing all files in bucket...");
    const allFiles = await listAllFiles(""); // Start at root

    if (allFiles.length === 0) {
      console.log("No files found in the bucket.");
      return;
    }

    console.log(`Found ${allFiles.length} files total.`);

    // First, load existing placeholders if present
    let placeholders: Record<
      string,
      { placeholder: string; width: number; height: number }
    > = {};
    try {
      if (fs.existsSync(outputPath)) {
        const raw = fs.readFileSync(outputPath, "utf-8");
        placeholders = JSON.parse(raw);
        console.log(
          `Loaded ${Object.keys(placeholders).length} existing placeholders.`
        );
      } else {
        console.log("No existing placeholders.json found. Starting fresh.");
      }
    } catch {
      console.log("Error reading placeholders.json. Starting fresh.");
    }

    let newlyGeneratedCount = 0;

    console.log("Generating placeholders (only for new files)...");
    for (const filePath of allFiles) {
      // Skip if we already have a placeholder for this file
      if (placeholders[filePath]) {
        console.log(`Skipping ${filePath} (already exists in placeholders).`);
        continue;
      }

      try {
        // 1) Download the file
        const { data: fileData, error: downloadError } = await supabase.storage
          .from(supabaseBucket)
          .download(filePath);

        if (downloadError || !fileData) {
          console.error(`Error downloading ${filePath}:`, downloadError);
          continue;
        }

        // 2) Convert to buffer
        const arrayBuffer = await fileData.arrayBuffer();
        const originalBuffer = Buffer.from(arrayBuffer);

        // 3) Get original width & height from metadata
        const meta = await sharp(originalBuffer).metadata();
        const originalWidth = meta.width || 600; // fallback
        const originalHeight = meta.height || 400; // fallback

        console.log(
          `Processing ${filePath}: ${originalWidth}x${originalHeight}`
        );

        // 4) Generate a small (16×16) version for blur placeholder
        const resizedBuffer = await sharp(originalBuffer)
          .resize(16, 16)
          .toBuffer();

        // 5) Convert that tiny image to base64
        const mimeType = fileData.type || "image/jpeg";
        const base64Str = resizedBuffer.toString("base64");
        const blurDataURL = `data:${mimeType};base64,${base64Str}`;

        // 6) Store in placeholders
        placeholders[filePath] = {
          placeholder: blurDataURL,
          width: originalWidth,
          height: originalHeight,
        };
        newlyGeneratedCount++;

        console.log(`Generated placeholder for: ${filePath}`);
      } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
      }
    }

    // 7) Save updated placeholders to placeholders.json
    fs.writeFileSync(outputPath, JSON.stringify(placeholders, null, 2));

    console.log(`\nNewly generated: ${newlyGeneratedCount} placeholders.`);
    console.log(
      `Total placeholders in file: ${Object.keys(placeholders).length}`
    );
    console.log(`Saved to ${outputPath}\n`);
  } catch (err) {
    console.error("Unexpected error:", err);
    process.exit(1);
  }
}

// Run the script
generatePlaceholders();
