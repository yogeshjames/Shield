const toggleBtn = document.getElementById("toggleBtn");
const statusText = document.getElementById("status");
const uploadBtn = document.getElementById("uploadBtn");
const uploadInput = document.getElementById("uploadInput");

// UI Result elements
const resultBox = document.getElementById("resultBox");
const loading = document.getElementById("loading");
const info = document.getElementById("info");
const prediction = document.getElementById("prediction");
const aiBar = document.getElementById("aiBar");
const humanBar = document.getElementById("humanBar");
const aiPercentage = document.getElementById("aiPercentage");
const humanPercentage = document.getElementById("humanPercentage");

// Load scanning state
chrome.storage.sync.get(["enabled"], (res) => {
    const isEnabled = res.enabled || false;
    updateUI(isEnabled);
    
    // Send state to content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, { type: "toggle", enabled: isEnabled })
                .catch(err => console.log("Content script not ready yet"));
        }
    });
});

toggleBtn.onclick = () => {
    chrome.storage.sync.get(["enabled"], (res) => {
        const newState = !res.enabled;
        chrome.storage.sync.set({ enabled: newState });
        updateUI(newState);

        // Notify content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(tabs[0].id, { type: "toggle", enabled: newState })
                    .catch(err => console.log("Content script not ready"));
            }
        });
    });
};

// Update toggle UI
function updateUI(enabled) {
    if (enabled) {
        toggleBtn.textContent = "Disable Scanning";
        toggleBtn.classList.add("btn-off");
        statusText.textContent = "Hover over any image to analyze";
        statusText.style.color = "#10b981";
    } else {
        toggleBtn.textContent = "Enable Scanning";
        toggleBtn.classList.remove("btn-off");
        statusText.textContent = "Scanning is OFF";
        statusText.style.color = "#6b7280";
    }
}

// LISTEN FOR SCAN RESULTS FROM BACKGROUND
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "analyzing") {
        showAnalyzing();
    }

    if (msg.type === "scan_result") {
        showResult(msg.data);
    }
});

// Show loading UI
function showAnalyzing() {
    resultBox.style.display = "block";
    loading.style.display = "block";
    info.style.display = "none";
}

// Show final results
function showResult(data) {
    loading.style.display = "none";
    info.style.display = "block";
    resultBox.style.display = "block";

    if (data.error) {
        prediction.textContent = `Error: ${data.error}`;
        prediction.style.color = "#ef4444";
        aiBar.style.width = "0%";
        humanBar.style.width = "0%";
        aiPercentage.textContent = "0%";
        humanPercentage.textContent = "0%";
        return;
    }

    const predText = data.prediction.toUpperCase();
    
    if (data.prediction === "ai") {
        prediction.textContent = "🤖 AI Generated";
        prediction.style.color = "#f59e0b";
    } else if (data.prediction === "hum" || data.prediction === "human") {
        prediction.textContent = "✓ Human Created";
        prediction.style.color = "#10b981";
    } else {
        prediction.textContent = `Result: ${predText}`;
        prediction.style.color = "#6b7280";
    }

    const aiProb = data.ai_probability || 0;
    const humanProb = data.human_probability || 0;

    aiBar.style.width = (aiProb * 100) + "%";
    humanBar.style.width = (humanProb * 100) + "%";
    
    aiPercentage.textContent = `${(aiProb * 100).toFixed(1)}%`;
    humanPercentage.textContent = `${(humanProb * 100).toFixed(1)}%`;
}

// ------------ UPLOAD FEATURE ------------------

uploadBtn.onclick = () => {
    const file = uploadInput.files[0];
    if (!file) {
        alert("Please choose an image first");
        return;
    }

    if (!file.type.startsWith('image/')) {
        alert("Please select a valid image file");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        chrome.runtime.sendMessage({
            type: "scan_upload",
            dataUrl: reader.result
        });
    };
    reader.readAsDataURL(file);

    showAnalyzing();
};

// Update button text when file selected
uploadInput.onchange = () => {
    if (uploadInput.files[0]) {
        const fileName = uploadInput.files[0].name;
        const shortName = fileName.length > 20 ? fileName.substring(0, 20) + "..." : fileName;
        uploadBtn.textContent = `Analyze: ${shortName}`;
    } else {
        uploadBtn.textContent = "Analyze Image";
    }
};