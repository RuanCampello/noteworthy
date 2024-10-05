def format_result(result, prompt):
    generated_text = result[0].get("generated_text", "")
    if generated_text.startswith(prompt):
        generated_text = generated_text[len(prompt):].strip()
    return generated_text


def extract_title_and_content(text):
    title_part = text.split("Title: ")[1].split("\n")[0]

    content_part = text.split("Content: ")[1]
    print("title", title_part, "content", content_part)
    return title_part, content_part
