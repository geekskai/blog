#!/usr/bin/env python3
import os
import shutil
import tempfile
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
EXCLUDED_DIRS = {
    ".agents",
    ".aws",
    ".codex",
    ".git",
    ".next",
    ".contentlayer",
    ".turbo",
    ".vercel",
    "node_modules",
    "out",
    "dist",
    "coverage",
}
EXCLUDED_FILES = {
    ".env",
    ".env.local",
    ".env.development.local",
    ".env.production.local",
    ".yarn/install-state.gz",
}
SECRET_SUFFIXES = (".pem", ".key", ".p12", ".pfx")


def should_skip(path: Path) -> bool:
    relative = path.relative_to(PROJECT_ROOT)
    parts = set(relative.parts)
    if parts & EXCLUDED_DIRS:
        return True
    if len(relative.parts) >= 2 and relative.parts[:2] == (".yarn", "cache"):
        return True
    if str(relative) in EXCLUDED_FILES:
        return True
    if path.name.startswith(".env.") and not path.name.endswith(".example"):
        return True
    if path.suffix.lower() in SECRET_SUFFIXES:
        return True
    return False


def main() -> None:
    output_dir = Path(tempfile.mkdtemp(prefix="geekskai-source-archive-"))
    target = output_dir / "geekskai-source"

    def ignore(directory: str, names: list[str]) -> set[str]:
        skipped = set()
        base = Path(directory)
        for name in names:
            candidate = base / name
            try:
                if should_skip(candidate):
                    skipped.add(name)
            except ValueError:
                skipped.add(name)
        return skipped

    shutil.copytree(PROJECT_ROOT, target, ignore=ignore)
    archive_base = output_dir / "geekskai-source"
    archive_path = shutil.make_archive(str(archive_base), "zip", target)
    size_mb = Path(archive_path).stat().st_size / 1024 / 1024
    print(f"Archive created: {archive_path}")
    print(f"Archive size: {size_mb:.1f} MB")


if __name__ == "__main__":
    main()
