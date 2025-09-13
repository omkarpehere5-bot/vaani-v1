from typing import Optional


def simple_describe(width: int, height: int, mode: str = "image") -> str:
    return f"A {mode} of size {width}x{height} with general content."
