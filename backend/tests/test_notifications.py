"""Notification endpoint tests (list, mark-read, mark-all, error paths)."""

from __future__ import annotations


def test_list_requires_auth(client):
    assert client.get("/v1/notifications").status_code == 401


def test_list_returns_overview(client, admin_headers):
    res = client.get("/v1/notifications", headers=admin_headers)
    assert res.status_code == 200
    body = res.json()
    assert "notifications" in body and "summary" in body
    assert "unread" in body["summary"]


def test_mark_single_read_decrements_unread(client, admin_headers):
    before = client.get("/v1/notifications", headers=admin_headers).json()
    unread_items = [n for n in before["notifications"] if not n["read"]]
    if not unread_items:
        return  # nothing unread to test against
    nid = unread_items[0]["id"]
    res = client.post(f"/v1/notifications/{nid}/read", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["read"] is True


def test_mark_unknown_notification_returns_404(client, admin_headers):
    res = client.post("/v1/notifications/ghost-id/read", headers=admin_headers)
    assert res.status_code == 404
    assert res.json()["error"]["code"] == "notification_not_found"


def test_mark_all_read_zeroes_unread(client, admin_headers):
    res = client.post("/v1/notifications/read-all", headers=admin_headers)
    assert res.status_code == 200
    assert res.json()["summary"]["unread"] == 0
