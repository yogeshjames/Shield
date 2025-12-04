// Track pending requests to prevent duplicates
const pendingRequests = new Map();
const requestCache = new Map();
const CACHE_DURATION = 60000; // 1 minute cache

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

    // HOVER SCAN (URL)
    if (msg.type === "scan_request") {
        const url = msg.url;
        
        // Check cache first
        const cached = requestCache.get(url);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log("[Shield] Using cached result for:", url.substring(0, 50));
            chrome.runtime.sendMessage({ type: "scan_result", data: cached.data });
            
            if (cached.data.prediction === "ai") {
                chrome.tabs.sendMessage(sender.tab.id, { type: "highlight", url: url })
                    .catch(err => console.log("Tab not ready"));
            }
            return;
        }
        
        // Check if already pending
        if (pendingRequests.has(url)) {
            console.log("[Shield] Request already pending for:", url.substring(0, 50));
            return;
        }
        
        // Mark as pending
        pendingRequests.set(url, true);
        
        chrome.runtime.sendMessage({ type: "analyzing" });

        fetch("http://127.0.0.1:8000/detect", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            // Cache the result
            requestCache.set(url, {
                data: data,
                timestamp: Date.now()
            });
            
            // Remove from pending
            pendingRequests.delete(url);
            
            chrome.runtime.sendMessage({ type: "scan_result", data });

            if (data.prediction === "ai") {
                chrome.tabs.sendMessage(sender.tab.id, { type: "highlight", url: url })
                    .catch(err => console.log("Tab not ready for highlight"));
            }
            
            // Send response back
            if (sendResponse) {
                sendResponse({ success: true });
            }
        })
        .catch(err => {
            console.error("Scan error:", err);
            pendingRequests.delete(url);
            
            chrome.runtime.sendMessage({ 
                type: "scan_result", 
                data: { 
                    prediction: "error", 
                    ai_probability: 0, 
                    human_probability: 0,
                    error: "Failed to connect to backend. Is the server running?" 
                } 
            });
            
            if (sendResponse) {
                sendResponse({ success: false, error: err.message });
            }
        });
        
        return true; // Keep message channel open
    }

    // UPLOAD SCAN (BASE64)
    if (msg.type === "scan_upload") {
        chrome.runtime.sendMessage({ type: "analyzing" });

        fetch("http://127.0.0.1:8000/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: msg.dataUrl })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            chrome.runtime.sendMessage({ type: "scan_result", data });
        })
        .catch(err => {
            console.error("Upload error:", err);
            chrome.runtime.sendMessage({ 
                type: "scan_result", 
                data: { 
                    prediction: "error", 
                    ai_probability: 0, 
                    human_probability: 0,
                    error: "Failed to upload image. Check if backend is running." 
                } 
            });
        });
    }
});

// Clear old cache entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [url, cached] of requestCache.entries()) {
        if (now - cached.timestamp > CACHE_DURATION) {
            requestCache.delete(url);
        }
    }
}, 30000); // Clean every 30 seconds

console.log("[Shield] Background service worker initialized");