import queue
import threading
from os import getenv
from random import uniform, randint, choice
from time import sleep

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException

from utils import format_result, split_on_double_newline, remove_html_comments

models = ["google/gemma-2-2b-it", "meta-llama/Meta-Llama-3-8B-Instruct",
          "mistralai/Mistral-Nemo-Instruct-2407",
          "mistralai/Mistral-7B-Instruct-v0.3"]

prompt = (
    "Generate a note with HTML tags. Write a complete passage in "
    "the style of English literature classics, using formal language, "
    "descriptive imagery, and emotional depth. The passage MUST be fixed at "
    "350 characters length. Ensure the passage has a clear beginning, middle, "
    "and end, and does not cut off abruptly or leave sentences unfinished."
    "I don't wanna know about the text, I only wanna the text itself."
)

load_dotenv()
API_KEY = getenv("HUGGING_FACE_KEY")
headers = {"Authorization": f"Bearer {API_KEY}"}


def get_random_model():
    return choice(models)


QUEUE_SIZE = 10

app = FastAPI()


@app.get("/generate")
def generate():
    try:
        if result_queue.empty():
            raise HTTPException(status_code=503,
                                detail="Queue is empty, try again later.")
        result = result_queue.get()
        return result

    except Exception as e:
        print(f"Error {e}")
        raise HTTPException(status_code=500, detail=str(e))


result_queue = queue.Queue(maxsize=QUEUE_SIZE)


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
        "additional text, placeholders, or comments. Do not remove any HTML tag."
        "Output only the cleaned passage, with no additional text or notes."
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
            formatted_result = format_result(result, refine_prompt)
            text_without_extras = split_on_double_newline(formatted_result)
            cleaned_text = remove_html_comments(text_without_extras)
            return cleaned_text
        else:
            raise ValueError("Invalid response from API")
    else:
        raise ValueError(
            f"API request failed with status code {response.status_code}")


def fill_queue():
    while True:
        queue_size = result_queue.qsize()
        if queue_size < QUEUE_SIZE:
            for _ in range(QUEUE_SIZE - queue_size):
                try:
                    generated_text = generate_from_prompt()
                    result = refine_response(generated_text)
                    if result is not None:
                        result_queue.put(result)
                        print(f"{result} stored in queue!")
                except Exception as e:
                    print(f"Error: {e}")
        else:
            print("Queue is full, waiting for space...")
            sleep(30)


worker_thread = threading.Thread(target=fill_queue, daemon=True)
worker_thread.start()
