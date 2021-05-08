def truncate_string(text: str, length=20) -> str:
    if len(text) < length:
        return text
    else:
        return f'{text[:20]}...'
