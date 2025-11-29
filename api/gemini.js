// File: api/gemini.js (Serverless Function Vercel)
import fetch from 'node-fetch';

export default async function (req, res) {
    // 1. TANGANI CORS PREFLIGHT (OPTIONS)
    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Max-Age', '86400');
        res.status(200).end();
        return;
    }
    
    // 2. HANYA IZINKAN POST
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed. POST only' });
        return;
    }

    try {
        // SOLUSI UNTUK ERROR 404: Menggunakan nama model yang paling stabil
        const MODEL_NAME = "gemini-1.5-flash"; 
        
        // Ambil API Key dari Environment Variable Vercel
        const GEMINI_KEY = process.env.GEMINI_KEY;

        if (!GEMINI_KEY) {
             res.status(500).json({ error: { message: "GEMINI_KEY is missing in Vercel Environment Variables. Please configure it." } });
             return;
        }

        const url = 
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_KEY}`;

        // Kirim request ke Google Gemini API
        const apiResponse = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json" 
            },
            body: JSON.stringify(req.body) 
        });

        const data = await apiResponse.json();

        // Kembalikan respons ke frontend
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(apiResponse.status).json(data);

    } catch (error) {
        console.error("Vercel Function Error:", error);
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.status(500).json({ error: { message: 'Internal Server Error in Vercel Function.' } });
    }
}
