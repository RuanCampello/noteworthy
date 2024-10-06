import threading
from os import getenv
from random import uniform, randint, choice
from time import sleep

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from valkey import Valkey

from utils import format_result, extract_title_and_content

models = ["google/gemma-2-2b-it", "meta-llama/Meta-Llama-3-8B-Instruct",
          "mistralai/Mistral-7B-Instruct-v0.3"]

prompt = (
    "Write a complete passage in the style of English literature classics, "
    "using formal language,"
    "descriptive imagery, and emotional depth. The passage MUST be fixed at "
    "350 characters length. Ensure the passage has a clear beginning, middle, "
    "and end, and does not cut off abruptly or leave sentences unfinished."
    "I don't wanna know about the text, I only wanna the text itself."
)

load_dotenv()
API_KEY = getenv("HUGGING_FACE_KEY")
REDIS_URL = getenv("REDIS_URL")
headers = {"Authorization": f"Bearer {API_KEY}"}


def get_random_model():
    return choice(models)


MAX_QUEUE_SIZE = 15
QUEUE_KEY = "generated_text_queue"

redis_client = Valkey.from_url(REDIS_URL)
app = FastAPI()


@app.get("/generate")
def generate():
    try:
        if redis_client.llen(QUEUE_KEY) == 0:
            raise HTTPException(status_code=503,
                                detail="Queue is empty, try again later.")
        result = redis_client.lpop(QUEUE_KEY)
        if result is None:
            raise HTTPException(status_code=503, detail="Queue is empty.")

        return result

    except Exception as e:
        print(f"Error {e}")
        raise HTTPException(status_code=500, detail=str(e))


def generate_from_prompt():
    random_params = {
        "temperature": round(uniform(0.7, 1.0), 2),
        "top_k": randint(10, 100),
        "top_p": 0.95,
        "do_sample": True,
        "no_repeat_ngram_size": 2,
        "max_new_tokens": 350,
    }

    input_text = {
        "inputs": prompt,
        "parameters": random_params,
    }

    model = get_random_model()
    api_url = f"https://api-inference.huggingface.co/models/{model}"
    response = requests.post(api_url, json=input_text, headers=headers)

    if response.status_code == 200:
        result = response.json()

        if isinstance(result, list):
            return format_result(result, prompt)
        else:
            raise ValueError("Invalid response from API")
    else:
        raise ValueError(
            f"API request failed with status code {response.status_code}")


def refine_response(response: str):
    refine_prompt = (
        "You have been given a passage of text that includes extra content, "
        "instructions, or comments."
        "Your task is to extract only the passage itself, removing all "
        "additional text, placeholders, or comments. Also, generate a title "
        "to the given text. Structure the output exactly with 'title' and 'content'."
        f"Text to clean:\n\n\"{response}")

    input_text = {
        "inputs": refine_prompt,
        "parameters": {
            "temperature": 0.2,
            "top_p": 0.7,
            "max_new_tokens": 400
        }
    }
    response = requests.post(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        json=input_text, headers=headers)

    if response.status_code == 200:
        result = response.json()
        if isinstance(result, list):
            title, content = extract_title_and_content(
                format_result(result, prompt))
            return {"title": title, "content": content}
        else:
            raise ValueError("Invalid response from API")
    else:
        raise ValueError(
            f"API request failed with status code {response.status_code}")


def fill_queue():
    while True:
        queue_size = redis_client.llen(QUEUE_KEY)
        if queue_size < MAX_QUEUE_SIZE:
            for _ in range(MAX_QUEUE_SIZE - queue_size):
                try:
                    generated_text = generate_from_prompt()
                    result = refine_response(generated_text)
                    if result is not None:
                        redis_client.rpush(QUEUE_KEY, str(result))
                        print(f"{result} stored in queue!")
                except Exception as e:
                    print(f"Error: {e}")
        else:
            print("Queue is full, waiting for space...")
            sleep(30)


worker_thread = threading.Thread(target=fill_queue, daemon=True)
worker_thread.start()
