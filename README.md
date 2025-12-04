# 🛡️ AIShield — Real-Time AI Image Detector (Browser Extension + ML Backend)

![GitHub stars](https://img.shields.io/github/stars/yourusername/AIShield?style=flat&color=yellow)
![GitHub forks](https://img.shields.io/github/forks/yourusername/AIShield?style=flat&color=orange)
![Issues](https://img.shields.io/github/issues/yourusername/AIShield)
![License](https://img.shields.io/github/license/yourusername/AIShield)
![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)

AIShield is a **browser extension** that detects whether any image you see online is **AI-generated or real**.  
Works on **Instagram, Facebook, Twitter, Pinterest, Google Images**, and **every website**.

🔍 Hover over any image → AIShield automatically analyzes it.  
📡 Uses a fine-tuned **AI-vs-Human** deep-learning model.  
🧠 Backend powered by **FastAPI + PyTorch** or **ONNX Runtime**.  
⚡ Fast, private, and works on any site.

---

## 🚀 Features

### 🌐 Browser Extension
- 🖱️ **Hover-to-Scan** → instantly analyze any image on any website  
- 🧪 Real-time AI vs Human prediction  
- 🎨 Modern popup UI with probability bars  
- 🖼️ Upload-your-own-image support  
- ⭐ Works on all social media platforms  
- 🔒 Secure — no data stored

### 🤖 Backend (Machine Learning API)
- 🧠 Uses state-of-the-art AI image classifier  
- 📦 REST API endpoint `/detect`  
- 🖥️ Supports image URLs and Base64 uploads  
- 🚀 Deployable via **Cloud Run**, **Railway**, or **HuggingFace Spaces**  
- ⚡ Fast inference


## 🏗️ How It Works

### 1️⃣ Content Script — Detects Images on Webpages  
AIShield scans dynamically loaded images using `MutationObserver` and sends the hovered image to the backend.

### 2️⃣ Background Service Worker  
Handles API calls and returns prediction results to the popup UI.

### 3️⃣ Machine Learning Backend  
A FastAPI server loads the image classification model and exposes:

POST /detect
{
"url": "<image_url>"
}

nginx
Copy code

or

POST /detect
{
"base64": "<image_base64>"
}

makefile
Copy code

Returns:

{
"prediction": "ai" | "hum",
"ai_probability": 0.98,
"human_probability": 0.02
}

yaml
Copy code

---

## 🧪 Running the Backend Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
🧩 Install the Chrome Extension
Go to chrome://extensions/

Enable Developer Mode

Click Load Unpacked

Select the extension/ folder

Extension will appear as AIShield

