"""
Unit tests for the pure calculation functions.
Run with: pytest (from the backend/ directory)
"""
import pytest

from app.services.calculations import get_limit_status


def test_limit_status_normal():
    assert get_limit_status(0) == "normal"
    assert get_limit_status(74.9) == "normal"


def test_limit_status_caution():
    assert get_limit_status(75) == "caution"
    assert get_limit_status(89.9) == "caution"


def test_limit_status_warning():
    assert get_limit_status(90) == "warning"
    assert get_limit_status(99.9) == "warning"


def test_limit_status_exceeded():
    assert get_limit_status(100) == "exceeded"
    assert get_limit_status(150) == "exceeded"
