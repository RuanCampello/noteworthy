from re import sub, DOTALL


def format_result(result, prompt):
    generated_text = result[0].get("generated_text", "")
    if generated_text.startswith(prompt):
        generated_text = generated_text[len(prompt):].strip()
    return generated_text


def split_on_double_newline(text):
    parts = text.split('\n\n')
    return parts[-1] if parts else ''


def remove_html_comments(text):
    cleaned_text = sub(r'<!--.*?-->', '', text, flags=DOTALL)
    return cleaned_text
