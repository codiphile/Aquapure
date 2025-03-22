import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Asks the Gemini API a question with an optional image
 * @param prompt The text prompt to send to Gemini
 * @param image Optional image file to analyze
 * @returns Promise with the response text
 */
export async function askGemini(
  prompt: string,
  image?: File | null
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is not configured");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // If an image is provided, use multimodal model
    if (image) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

      // Convert the file to base64
      const base64EncodedImage = await fileToGenerativePart(image);

      const result = await model.generateContent([prompt, base64EncodedImage]);

      const response = await result.response;
      return response.text();
    }
    // Text-only query
    else {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a response from Gemini");
  }
}

/**
 * Converts a file to a GenerativeContentBlob format for the Gemini API
 */
async function fileToGenerativePart(file: File) {
  const base64EncodedData = await readFileAsBase64(file);

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}

/**
 * Reads a file and returns its base64 encoded data
 */
function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // Extract the base64 data from the result
      const base64String = (reader.result as string).split(",")[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
