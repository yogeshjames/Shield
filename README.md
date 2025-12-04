<div align="center">

# 🛡️ Shield - AI Image Detector

### Detect AI-Generated Images Instantly While Browsing


**With AI image generation becoming indistinguishable from reality, Shield helps you identify fake content in real-time.**

</div>

## 🌟 Why Shield?

In an era where AI tools like **Midjourney v6**, **DALL-E 3**, and **Stable Diffusion 3.5** can create photorealistic images, distinguishing between real and AI-generated content has become nearly impossible. This creates serious problems:

### The Growing Problem

| Issue | Impact | Shield's Solution |
|-------|--------|-------------------|
| **Fake News & Misinformation** | AI-generated "evidence" photos spread false narratives | Real-time verification on news sites |
| **Social Media Fraud** | Influencers use AI for fake lifestyle content | Detect fake Instagram posts instantly |
| **Deepfakes & Manipulation** | Fake celebrity images, revenge porn, blackmail | Verify image authenticity before sharing |
| **Online Dating Scams** | Catfishing with AI-generated profile pictures | Analyze dating profiles privately |
| **E-Commerce Fraud** | Scammers use fake product images | Check product photos before buying |
| **Art Theft & Plagiarism** | AI models trained on stolen artwork | Identify genuine human-created art |

### Shield's Impact

- 🔍 **99%+ Detection Accuracy** - Powered by state-of-the-art AI model trained on 120,000+ images
- ⚡ **Instant Results** - Get predictions in under 2 seconds
- 🌐 **Works Everywhere** - Instagram, Twitter, Facebook, Reddit, any website
- 🔒 **Privacy First** - No data collection, images never stored
- 💯 **Completely Free** - Open-source, no subscriptions, no hidden costs

---

## ✨ Features

### 🔍 Real-Time Hover Detection

Simply **hover over any image for 1 second** to analyze it. No clicking, no uploading, no interruptions to your browsing.

```
Hover → Analyze → Get Results
     (1 second)    (2 seconds)
```

**Perfect for:**
- Browsing Instagram/Twitter feeds
- Reading news articles
- Scrolling through Reddit
- Checking Facebook posts
- Viewing Pinterest boards

### 📤 Private Image Upload

Upload images from your device for **secure, private analysis**. Perfect for verifying:
- Downloaded images
- Dating app profile pictures
- Product photos from sellers
- Suspicious images sent to you
- Art commissions before purchasing

**Privacy guarantee:** Images are analyzed and immediately discarded. Nothing is stored.

### 🎯 Smart Detection System

#### Ensemble Predictions
Each image is tested **3 times** with slight variations:
1. Original image analysis
2. Slightly rotated version (+1°)
3. Slightly zoomed version (crop & resize)

The system then **votes** on the results for maximum accuracy.

#### Confidence Scoring
- ✅ **85%+ confidence**: Definitive classification (AI or Human)
- ⚠️ **Below 85%**: Marked as "Uncertain" to avoid false positives
- 📊 **Full breakdown**: See exact percentages for both AI and Human probability

#### Bias Correction
High-contrast professional photography (studio shots, HDR landscapes) can sometimes trigger false positives. Shield automatically:
- Detects high-contrast characteristics
- Applies 10% probability correction
- Prevents professional photography from being mislabeled

#### Metadata Detection
Some AI-generated images contain embedded signatures. Shield instantly detects:
- Midjourney watermarks
- DALL-E metadata
- Stable Diffusion tags
- Adobe Firefly signatures
- And 10+ other AI tools

**Result:** Instant 100% confident detection without model inference!
## 🚀 Installation
### 💻 Backend Setup 
The extension requires a backend server to perform AI detection. You have two options:

### Run Your Own Backend (Recommended)

#### Prerequisites
- Python 3.10 or higher
- 4GB+ RAM (8GB recommended)
- Internet connection (for first-time model download)
#### Installation
1. **Clone Repository** (if not already done)
   ```bash
   git clone https://github.com/yourusername/shield-ai-detector.git
   cd shield-ai-detector/backend
   ```

2. **Create Virtual Environment** (recommended)
   ```bash
   # On macOS/Linux
   python3 -m venv venv
   source venv/bin/activate

   # On Windows
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

   This will install:
   - FastAPI (web framework)
   - PyTorch (deep learning)
   - Transformers (Hugging Face)
   - Pillow (image processing)
   - And other dependencies

4. **Start the Server**
   ```bash
     cd backend
     pip install -r requirements.txt
     uvicorn main:app --reload --port 8000
   ```

   First-time startup will download the AI model (~1GB). This only happens once.

   You should see:
   ```
   ============================================================
   🛡️  AI SHIELD - Enhanced Detection Backend
   ============================================================
   Version: 2.0-enhanced
   Features: Ensemble predictions, metadata detection, preprocessing
   ============================================================
   
   [Shield] Loading AI detection model...
   [Shield] Model ready! Enhanced accuracy mode enabled.
   [Shield] Detector v2.0-enhanced ready!
   [Shield] Confidence threshold: 85.0%
   [Shield] Ensemble mode: ENABLED
   
   INFO:     Uvicorn running on http://127.0.0.1:8000
   ```
API will be available at:
http://127.0.0.1:8000/detect

**Verify Backend is Running**
   ```bash
   # In a new terminal
   curl http://127.0.0.1:8000
   ```

   Should return:
   ```json
   {
     "status": "AI Shield Backend Running",
     "version": "2.0-enhanced"
   }
   ```

🧩 Installing the Chrome Extension
Go to: chrome://extensions/
Turn on Developer Mode
Click Load Unpacked
Select the extension/ folder
AIShield will appear in the Chrome toolbar
After enabling scanning, you can use AIShield instantly.


## 📖 Usage Guide

### Method 1: Hover Detection (Primary Feature)

This is the fastest and most seamless way to verify images while browsing.

#### Step-by-Step:

1. **Enable Scanning**
   - Click the Shield icon in your Chrome toolbar
   - Click the **"Enable Scanning"** button
   - Status should change to "Hover over any image to analyze"

2. **Browse Any Website**
   - Go to Instagram, Twitter, Reddit, or any site with images
   - Continue browsing normally

3. **Hover Over Images**
   - Move your mouse over any image
   - Keep hovering for **1 second** (countdown visible in console)
   - Detection happens automatically

4. **View Results**
   - Click the Shield icon to see results in popup
   - Results show:
     - **🤖 AI Probability**: Percentage chance it's AI-generated
     - **👤 Human Probability**: Percentage chance it's human-created
     - **Overall Prediction**: AI, Human, or Uncertain

5. **Visual Indicator**
   - If AI is detected, image gets a subtle **amber glow**
   - Glow follows the image when scrolling
   - Non-intrusive and doesn't affect page layout

#### Tips:
- ✅ Keep hover steady for full 1 second
- ✅ Each image is only scanned once (results cached)
- ✅ Works on background images too
- ✅ Instagram lazy-loaded images are handled automatically

### Method 2: Upload Private Images

For analyzing images you've downloaded or received privately.

#### Step-by-Step:

1. **Open Extension Popup**
   - Click Shield icon in toolbar

2. **Select Image**
   - Scroll to **"Upload Image to Analyze"** section
   - Click **"Choose File"** or drag & drop
   - Supported formats: JPG, PNG, WebP, GIF, BMP

3. **Analyze**
   - Click **"Analyze Image"** button
   - Processing takes 1-2 seconds

4. **View Detailed Results**
   - **Prediction**: AI / Human / Uncertain
   - **Confidence Score**: How sure the model is (0-100%)
   - **AI Probability**: Exact percentage
   - **Human Probability**: Exact percentage
   - **Image Analysis**: Contrast score, saturation details

#### Use Cases:
- 📱 Check dating app profile pictures
- 🛒 Verify product photos before buying
- 📧 Analyze suspicious images sent via email
- 💼 Verify portfolio images for freelancers
- 🎨 Check if artwork is AI-generated

## 🧠 How It Works

### The Technology Behind Shield

Shield uses cutting-edge machine learning to detect AI-generated images with 99%+ accuracy.

#### Model Architecture

**Base Model:** `Ateeqq/ai-vs-human-image-detector`
- **Type:** SiglipForImageClassification (Vision Transformer)
- **Training Data:** 120,000 images
  - 60,000 AI-generated (Midjourney v6.1, DALL-E 3, Stable Diffusion 3.5, Flux 1.1 Pro, GPT-4o)
  - 60,000 human-created photographs
- **Test Accuracy:** 99.23% on validation set
- **Model Size:** ~1GB
- **Framework:** PyTorch + Hugging Face Transformers
