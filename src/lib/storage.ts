import * as ftp from "basic-ftp";
import { Readable } from "stream";

export async function saveFile(file: File): Promise<string> {
  const client = new ftp.Client();
  // client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
      secure: false, // Set to true if your server supports FTPS
    });

    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, "_")}`;
    const remotePath = `${process.env.FTP_PATH || "/public_html/uploads"}/${fileName}`;

    // Convert File to a readable stream
    const buffer = Buffer.from(await file.arrayBuffer());
    const source = new Readable();
    source.push(buffer);
    source.push(null);

    await client.uploadFrom(source, remotePath);

    // Return the public URL
    const baseUrl = process.env.NEXT_PUBLIC_STORAGE_URL || "https://bikashgupta.com/uploads";
    return `${baseUrl}/${fileName}`;
  } catch (err) {
    console.error("FTP Upload Error:", err);
    throw new Error("Failed to upload file to remote storage");
  } finally {
    client.close();
  }
}

export async function deleteFile(fileUrl: string): Promise<void> {
  const client = new ftp.Client();
  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASSWORD,
    });

    const fileName = fileUrl.split("/").pop();
    if (fileName) {
      const remotePath = `${process.env.FTP_PATH || "/public_html/uploads"}/${fileName}`;
      await client.remove(remotePath);
    }
  } catch (err) {
    console.error("FTP Delete Error:", err);
  } finally {
    client.close();
  }
}
