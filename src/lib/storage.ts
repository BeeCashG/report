import { writeFile, mkdir, unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

export async function saveFile(file: File): Promise<string> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
  const path = join(UPLOAD_DIR, fileName);
  
  await writeFile(path, buffer);
  
  return `/uploads/${fileName}`;
}

export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl.startsWith("/uploads/")) return;
  
  const fileName = fileUrl.replace("/uploads/", "");
  const path = join(UPLOAD_DIR, fileName);
  
  try {
    if (existsSync(path)) {
      await unlink(path);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
}
