from fastapi import FastAPI, Request
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq
from collections import deque

load_dotenv()  # Load API key from .env file

API_KEY = os.getenv("GROQ_API_KEY")
RESPONSE_QUEUE_LEN = 5
SYSTEM_PROMPT = ""
RESPONSE_HISTORY = deque(maxlen=RESPONSE_QUEUE_LEN)     # Create a queue of responses

# client = OpenAI(api_key=API_KEY, base_url="https://api.deepseek.com")

client = Groq(
    api_key=API_KEY,    

)

app = FastAPI()

# CORS for allowing frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origin in production
    allow_methods=["POST"],
    allow_headers=["*"],
)

# Define request body model
class ChatRequest(BaseModel):
    text: str



def include_history():
    """Generate a history string to prevent repetition."""
    if RESPONSE_HISTORY:
        return " Here are some of your previous responses (avoid repeating these): " + " | ".join(RESPONSE_HISTORY)
    return ""


# Get response
@app.post("/get_response")  
async def get_response(request: ChatRequest):
    # data = await request.json()
    # prompt = data.get("text", "")
    prompt = request.text

    if not prompt:
        return {"response": "I have nothing to say right now."}

    # Create system prompt with history
    SYSTEM_PROMPT = (
        "The prompt is the content that the user is watching. You are a witty AI companion that makes sarcastic, "
        "funny, or mocking remarks based on what the user is viewing. Keep it extremely short, like a small phrase or one-liner. "
        "You may taunt the user or just say something friendly to them regarding what they are viewing, like small talk. "
        "Talk to the user like you're their friend. You might use very casual language." +
        include_history()
    )



    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "system", "content": SYSTEM_PROMPT},
                  {"role": "user", "content": prompt}],
        stream=False
    )

    bot_response = response.choices[0].message.content

    # Store response in history
    RESPONSE_HISTORY.append(bot_response)

    return {"response": bot_response}


