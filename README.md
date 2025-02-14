# Tzusa-Chrome-Extension
A witty AI companion that makes snarky remarks based on your browsing!

## 🚀 Features
- Scrapes webpage text
- Sends it to GPT-4 for witty responses
- Displays comments as popups
- Runs in the background at intervals


## 🔧 Setup Instructions
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/ai-companion-chrome-extension.git
cd ai-companion-chrome-extension
```

### 2️⃣ Install Python Dependencies

```sh
cd backend
pip install -r requirements.txt
```

### 3️⃣ Add OpenAI API Key

Create a .env file in backend/ and add:

```OPENAI_API_KEY=your_openai_api_key```

### 4️⃣ Start the Backend

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```

### 5️⃣ Load the Chrome Extension

- Open Chrome → Extensions (chrome://extensions/).
- Enable Developer Mode (top-right).
- Click Load Unpacked and select the extension/ folder.

### 6️⃣ Browse and Enjoy!

Visit any website and let the AI companion roast you! 🔥


---

## **🎯 Final Thoughts**
- This setup ensures **fast, lightweight AI responses** using GPT-4.
- It’s **modular**, so you can later **replace OpenAI** with a local model.
- The extension **doesn’t store data**, keeping it private.
