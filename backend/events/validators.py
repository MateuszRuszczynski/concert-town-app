from pathlib import Path

from django.core.exceptions import ValidationError
from PIL import Image, UnidentifiedImageError


MAX_EVENT_IMAGE_SIZE = 5 * 1024 * 1024
IMAGE_TYPES = {
    ".jpg": ("JPEG", "image/jpeg"),
    ".jpeg": ("JPEG", "image/jpeg"),
    ".png": ("PNG", "image/png"),
    ".webp": ("WEBP", "image/webp"),
}


def validate_event_image(value):
    if value.size > MAX_EVENT_IMAGE_SIZE:
        raise ValidationError("Event images must be no larger than 5 MB.")

    expected = IMAGE_TYPES.get(Path(value.name).suffix.lower())
    if expected is None:
        raise ValidationError("Use a JPEG, PNG, or WebP image.")

    position = value.tell()
    try:
        value.seek(0)
        with Image.open(value) as image:
            if image.format != expected[0]:
                raise ValidationError("Image content must match its file extension.")
            image.verify()
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        raise ValidationError("Upload a valid image.") from exc
    finally:
        value.seek(position)

    content_type = getattr(value, "content_type", None)
    if content_type and content_type != expected[1]:
        raise ValidationError("Image content type must match its file extension.")
