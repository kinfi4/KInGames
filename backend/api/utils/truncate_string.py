def truncate_string(text: str, length=20) -> str:
    return text if len(text) > length else f'{text[:length]}...'
