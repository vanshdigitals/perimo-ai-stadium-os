"""Password hashing/verification tests (PBKDF2-HMAC-SHA256)."""

from __future__ import annotations

from src.security.auth.passwords import hash_password, verify_password


def test_hash_verify_roundtrip():
    encoded = hash_password("S3cure!pass")
    assert verify_password("S3cure!pass", encoded) is True


def test_wrong_password_rejected():
    encoded = hash_password("correct-horse")
    assert verify_password("battery-staple", encoded) is False


def test_hash_is_salted_and_non_reversible():
    a = hash_password("same")
    b = hash_password("same")
    assert a != b  # per-password random salt
    assert "same" not in a  # plaintext never stored
    assert a.startswith("pbkdf2_sha256$")


def test_malformed_hash_rejected_not_crashing():
    assert verify_password("x", "not-a-valid-encoding") is False
    assert verify_password("x", "") is False


def test_unknown_algorithm_rejected():
    assert verify_password("x", "bcrypt$1$aa$bb") is False
