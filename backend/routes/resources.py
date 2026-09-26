from __future__ import annotations

import json
from pathlib import Path
from typing import Any


class ResourceError(RuntimeError):
    """Raised when a resource cannot be loaded."""


class ResourceLoader:
    """Load text, JSON, and binary files from a resource directory."""

    def __init__(self, resource_dir: str | Path = "resources") -> None:
        self.resource_dir = Path(resource_dir)

    def _resolve(self, name: str | Path) -> Path:
        path = self.resource_dir / Path(name)

        if not path.exists():
            raise ResourceError(f"Resource not found: {path}")

        if not path.is_file():
            raise ResourceError(f"Resource is not a file: {path}")

        return path

    def read_text(self, name: str | Path, encoding: str = "utf-8") -> str:
        """Read a text resource."""
        return self._resolve(name).read_text(encoding=encoding)

    def read_bytes(self, name: str | Path) -> bytes:
        """Read a binary resource."""
        return self._resolve(name).read_bytes()

    def read_json(self, name: str | Path) -> Any:
        """Read and parse a JSON resource."""
        try:
            return json.loads(self.read_text(name))
        except json.JSONDecodeError as exc:
            raise ResourceError(f"Invalid JSON resource: {name}") from exc


_default_loader = ResourceLoader()


def read_text(name: str | Path, encoding: str = "utf-8") -> str:
    return _default_loader.read_text(name, encoding)


def read_bytes(name: str | Path) -> bytes:
    return _default_loader.read_bytes(name)


def read_json(name: str | Path) -> Any:
    return _default_loader.read_json(name)