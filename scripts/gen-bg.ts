import { GoogleGenAI } from '@google/genai';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: 'Dark cinematic background with Earth glowing at night, golden light, emotional atmosphere, premium design, strong contrast, ultra-realistic. A family silhouette looking at a glowing Earth with a glowing golden heart light symbol. Gold and blue premium colors, strong glow effects, emotional lighting. No text. Clean composition.',
      config: {
        imageConfig: {
          aspectRatio: "9:16"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        fs.writeFileSync('./public/vip-promo-bg.jpg', buffer);
        console.log('Image saved to public/vip-promo-bg.jpg');
      }
    }
  } catch (e) {
    console.error("Error generating image:", e);
  }
}
run();
