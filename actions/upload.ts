"use server";
import { writeFileSync, unlinkSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

export const uploadFile = async (file: File) => {
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  const unit8Array = new Uint8Array(buffer);

  const tempFilePath = join(tmpdir(), file.name);
  writeFileSync(tempFilePath, unit8Array);

  try {
    const uploadedFile = await ai.files.upload({
      file: tempFilePath,
      config: {
        mimeType: file.type,
        displayName: file.name,
      },
    });

    return uploadedFile;
  } finally {
    // Clean up temp file
    try {
      unlinkSync(tempFilePath);
    } catch {
      // ignore cleanup errors
    }
  }
};
