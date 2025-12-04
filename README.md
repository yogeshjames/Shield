## 🛠️ How To Use AIShield (Full Guide — Instagram, Facebook, Google Images, Everywhere)

Once you install the extension, here’s exactly how it works:

---

## 1️⃣ Enable AIShield
Click the **AIShield icon** → press **“Enable Scanning”** inside the popup.

You will see:

✓ Scanning enabled
Hover any image to analyze.

yaml
Copy code

When scanning is OFF, the extension does nothing.

---

## 2️⃣ Hover Over ANY Image to Scan
Once scanning is ON:

- Move your mouse over **any image** on any website  
- Pause for **0.5–1 second**  
- AIShield will analyze ONLY that image  
- Popup UI shows: “Analyzing…”  
- Then displays:

✔ Prediction ("AI" or "Human")  
✔ Confidence bars  
✔ Probability scores  

This works on:

### 🟦 Instagram  
- Supports feed posts  
- Explore page  
- Profiles  
- Reels thumbnails  
- Automatically handles lazy-loaded images while scrolling  

### 🟦 Facebook  
- Posts  
- Ads  
- Profile photos  
- Marketplace images  

### 🟦 Google Images / Bing Images  
- Direct-image search results  
- High-resolution preview images  

### 🟦 Twitter / X  
- Post images  
- Previews  
- Thumbnails  

### 🟦 Pinterest / Reddit / LinkedIn  
- All supported — no changes required  

You DO NOT need to reload the page.  
You DO NOT need to click anything.  
Just **hover**.

---

## 3️⃣ Upload Your Own Images
The popup also allows manual scanning:

1. Open the extension popup  
2. Use the **Upload Image** button  
3. Select any image from your device  
4. AIShield scans it locally via backend  
5. Results appear instantly with probability bars  

This is perfect for testing AI images from:
- Midjourney  
- Stable Diffusion  
- DALL·E  
- Adobe Firefly  
- OpenAI GPT-Image  
- AI edits  

---

## 4️⃣ What Happens Behind the Scenes?

The browser extension sends the hovered image to your backend through:

POST /detect
{
"url": "<image_url>"
}

rust
Copy code

or (for uploads)

POST /detect
{
"base64": "<image_base64>"
}

pgsql
Copy code

The backend returns clean JSON:

```json
{
  "prediction": "ai",
  "ai_probability": 0.9821,
  "human_probability": 0.0179
}
🧪 Running the Backend Locally
bash
Copy code
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
API will be available at:

arduino
Copy code
http://127.0.0.1:8000/detect
🧩 Installing the Chrome Extension
Go to: chrome://extensions/

Turn on Developer Mode

Click Load Unpacked

Select the extension/ folder

AIShield will appear in the Chrome toolbar

After enabling scanning, you can use AIShield instantly.
