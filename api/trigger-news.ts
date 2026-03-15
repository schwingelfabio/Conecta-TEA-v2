import admin from "firebase-admin";
import { fetchAndPostAutismNews } from "../src/lib/news";

export default async function handler(req: any, res: any) {
  // Allow only GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.VITE_FIREBASE_PROJECT_ID;
    
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      if (projectId) {
        admin.initializeApp({ projectId });
      } else {
        admin.initializeApp();
      }
    }

    const db = admin.firestore();

    const result = await fetchAndPostAutismNews(db);

    if (result?.skipped) {
      return res.status(200).json(result);
    }

    return res.status(200).json({ success: true, message: "News fetch triggered successfully." });
  } catch (error: any) {
    console.error("[News API] Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to generate news" });
  }
}
