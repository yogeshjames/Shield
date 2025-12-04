console.log("Shield content script loaded");

let enabled = false;
let hoverTimer = null;
let scannedImages = new Map();
let pendingScans = new Set();
let lastUrl = null;

// Initialize
chrome.storage.sync.get(["enabled"], (res) => {
    enabled = res.enabled || false;
    console.log("Shield:", enabled ? "ON" : "OFF");
});

// Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "toggle") {
        enabled = msg.enabled;
        console.log("Shield toggle:", enabled ? "ON" : "OFF");
        if (!enabled) {
            removeAllHighlights();
            scannedImages.clear();
            pendingScans.clear();
        }
        sendResponse({success: true});
    }
    
    if (msg.type === "highlight") {
        console.log("Highlighting AI image:", msg.url.substring(0, 50));
        highlightImage(msg.url);
        sendResponse({success: true});
    }
    
    if (msg.type === "scan_result") {
        if (lastUrl) {
            scannedImages.set(lastUrl, msg.data);
            pendingScans.delete(lastUrl);
            console.log("Result cached");
        }
        sendResponse({success: true});
    }
    
    return true;
});

// Inject NON-INVASIVE overlay CSS (no layout shifts!)
function injectHighlightCSS() {
    if (document.getElementById('aiShield-css')) return;
    
    const style = document.createElement('style');
    style.id = 'aiShield-css';
    style.textContent = `
        /* Overlay container - doesn't affect layout */
        .aiShield-overlay {
            position: fixed !important;
            pointer-events: none !important;
            z-index: 2147483647 !important;
            border: 3px solid rgba(245, 158, 11, 0.6) !important;
            border-radius: 4px !important;
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3) !important;
            animation: aiShield-glow 2.5s ease-in-out infinite !important;
            transition: all 0.1s ease !important;
        }
        
        @keyframes aiShield-glow {
            0%, 100% {
                border-color: rgba(245, 158, 11, 0.5);
                box-shadow: 0 0 15px rgba(245, 158, 11, 0.2);
            }
            50% {
                border-color: rgba(245, 158, 11, 0.8);
                box-shadow: 0 0 25px rgba(245, 158, 11, 0.4);
            }
        }
        
        @media (prefers-reduced-motion: reduce) {
            .aiShield-overlay {
                animation: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    console.log("CSS injected");
}

// Inject CSS on load
setTimeout(injectHighlightCSS, 100);

// Show refresh notification if extension was reloaded
function showRefreshNotification() {
    // Remove any existing notification
    const existing = document.getElementById('aiShield-refresh-notice');
    if (existing) existing.remove();
    
    // Create notification
    const notice = document.createElement('div');
    notice.id = 'aiShield-refresh-notice';
    notice.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            font-size: 14px;
            max-width: 320px;
            cursor: pointer;
        ">
            <div style="font-weight: 600; margin-bottom: 4px;">🛡️ Shield Extension Updated</div>
            <div style="font-size: 13px; opacity: 0.95;">Please refresh this page (F5) to continue scanning</div>
        </div>
    `;
    
    // Click to dismiss
    notice.onclick = () => notice.remove();
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notice.parentElement) {
            notice.style.transition = 'opacity 0.3s';
            notice.style.opacity = '0';
            setTimeout(() => notice.remove(), 300);
        }
    }, 8000);
    
    document.body.appendChild(notice);
}

// Inject CSS on load
setTimeout(injectHighlightCSS, 100);

function removeAllHighlights() {
    try {
        // Remove all overlay elements
        document.querySelectorAll(".aiShield-overlay").forEach(el => {
            el.remove();
        });
    } catch (e) {
        console.error("Highlight removal error:", e);
    }
}

function highlightImage(url) {
    try {
        let highlighted = 0;
        
        // Find the image element
        const images = document.querySelectorAll("img");
        images.forEach(img => {
            const imgUrl = img.currentSrc || img.src;
            if (imgUrl === url) {
                // Create overlay instead of modifying the image
                createOverlay(img);
                highlighted++;
                console.log("Highlighted IMG with overlay");
            }
        });
        
        if (highlighted === 0) {
            console.log("No elements found to highlight");
        }
    } catch (e) {
        console.error("Highlight error:", e);
    }
}

function createOverlay(element) {
    // Remove any existing overlay for this element
    const existingId = element.getAttribute('data-aiShield-overlay-id');
    if (existingId) {
        const existingOverlay = document.getElementById(existingId);
        if (existingOverlay) existingOverlay.remove();
    }
    
    // Get element position
    const rect = element.getBoundingClientRect();
    
    // Create overlay div
    const overlay = document.createElement('div');
    const overlayId = 'aiShield-overlay-' + Math.random().toString(36).substr(2, 9);
    overlay.id = overlayId;
    overlay.className = 'aiShield-overlay';
    
    // Position overlay over the image
    overlay.style.top = (rect.top + window.scrollY) + 'px';
    overlay.style.left = (rect.left + window.scrollX) + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
    
    // Add to body
    document.body.appendChild(overlay);
    
    // Store overlay ID on element
    element.setAttribute('data-aiShield-overlay-id', overlayId);
    
    // Update overlay position on scroll/resize
    const updatePosition = () => {
        const newRect = element.getBoundingClientRect();
        overlay.style.top = (newRect.top + window.scrollY) + 'px';
        overlay.style.left = (newRect.left + window.scrollX) + 'px';
        overlay.style.width = newRect.width + 'px';
        overlay.style.height = newRect.height + 'px';
    };
    
    // Listen for scroll and resize
    window.addEventListener('scroll', updatePosition, { passive: true });
    window.addEventListener('resize', updatePosition, { passive: true });
    
    // Clean up when element is removed or hidden
    const observer = new MutationObserver(() => {
        if (!document.body.contains(element) || element.offsetParent === null) {
            overlay.remove();
            observer.disconnect();
        }
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

// Get all possible image URLs
function getAllImageUrls(el) {
    const urls = new Set();
    
    // Direct IMG element
    if (el.tagName === "IMG") {
        const sources = [
            el.currentSrc,
            el.src,
            el.getAttribute("src"),
            el.getAttribute("data-src"),
            el.getAttribute("data-lazy-src"),
            el.getAttribute("srcset")?.split(',')[0]?.split(' ')[0]
        ];
        
        sources.forEach(url => {
            if (url && url.startsWith("http") && !url.startsWith("data:")) {
                urls.add(url);
            }
        });
    }
    
    // Check children for images
    try {
        const childImages = el.querySelectorAll ? el.querySelectorAll("img") : [];
        childImages.forEach(img => {
            const imgUrl = img.currentSrc || img.src;
            if (imgUrl && imgUrl.startsWith("http")) {
                urls.add(imgUrl);
            }
        });
        
        // Check parent for images
        if (el.parentElement) {
            const parentImages = el.parentElement.querySelectorAll("img");
            parentImages.forEach(img => {
                const imgUrl = img.currentSrc || img.src;
                if (imgUrl && imgUrl.startsWith("http")) {
                    urls.add(imgUrl);
                }
            });
        }
    } catch (e) {
        console.error("Error getting child/parent images:", e);
    }
    
    return Array.from(urls);
}

function sendScanRequest(url) {
    if (!url) return;
    
    if (scannedImages.has(url) || pendingScans.has(url)) {
        console.log("Already processed");
        return;
    }
    
    console.log("Scanning:", url.substring(0, 80));
    
    pendingScans.add(url);
    lastUrl = url;
    
    try {
        chrome.runtime.sendMessage({ 
            type: "scan_request", 
            url: url 
        }, (response) => {
            if (chrome.runtime.lastError) {
                const error = chrome.runtime.lastError.message;
                
                // Extension was reloaded - inform user to refresh page
                if (error.includes("Extension context invalidated")) {
                    console.warn("⚠️ Extension was reloaded. Please refresh this page (F5) to continue scanning.");
                    showRefreshNotification();
                    pendingScans.delete(url);
                    enabled = false; // Disable scanning to prevent more errors
                    return;
                }
                
                // Ignore harmless "receiving end" errors
                if (!error.includes("Receiving end does not exist")) {
                    console.error("Runtime error:", error);
                }
                pendingScans.delete(url);
            }
        });
    } catch (error) {
        // Catch "Extension context invalidated" errors
        if (error.message && error.message.includes("Extension context invalidated")) {
            console.warn("⚠️ Extension was reloaded. Please refresh this page (F5) to continue scanning.");
            showRefreshNotification();
            enabled = false;
        } else {
            console.error("Send error:", error);
        }
        pendingScans.delete(url);
    }
}

// Hover detection
let hoverDebounce = null;
let currentHoverElement = null;

document.addEventListener("mouseover", (e) => {
    if (!enabled) return;

    currentHoverElement = e.target;
    
    if (hoverDebounce) clearTimeout(hoverDebounce);

    hoverDebounce = setTimeout(() => {
        handleHover(currentHoverElement);
    }, 50);
}, true);

function handleHover(el) {
    if (!el) return;
    
    const urls = getAllImageUrls(el);
    
    if (urls.length === 0) return;
    
    console.log(`Found ${urls.length} image(s) on hover`);
    
    const url = urls[0];
    
    if (scannedImages.has(url) || pendingScans.has(url)) {
        console.log("Already processed");
        return;
    }

    if (hoverTimer) clearTimeout(hoverTimer);

    console.log("Starting 1 second hover timer...");

    hoverTimer = setTimeout(() => {
        console.log("Timer complete! Scanning now...");
        sendScanRequest(url);
    }, 1000);
}

document.addEventListener("mouseout", (e) => {
    if (hoverTimer) {
        console.log("Mouse left, clearing timer");
        clearTimeout(hoverTimer);
        hoverTimer = null;
    }
}, true);

// Watch for new images
let observerTimeout = null;
const observer = new MutationObserver((mutations) => {
    if (!enabled) return;
    
    if (observerTimeout) return;
    
    observerTimeout = setTimeout(() => {
        observerTimeout = null;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === "IMG") {
                    const url = node.currentSrc || node.src;
                    if (url && url.startsWith("http")) {
                        console.log("New image loaded:", url.substring(0, 60));
                    }
                }
            });
        });
    }, 500);
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("Shield ready!");

if (window.location.hostname.includes('instagram')) {
    console.log("Instagram detected - enhanced detection active");
}