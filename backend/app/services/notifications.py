import os
import smtplib
from email.message import EmailMessage


def send_booking_notification(chef_email: str, subject: str, body: str) -> bool:
    """Send booking notification email when SMTP is configured.

    Returns True when send succeeds. If SMTP env vars are missing, returns False.
    """
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    sender = os.getenv("SMTP_FROM", smtp_user or "noreply@foodforthought.local")

    if not (smtp_host and smtp_user and smtp_pass and chef_email):
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = sender
    msg["To"] = chef_email
    msg.set_content(body)

    with smtplib.SMTP(smtp_host, smtp_port, timeout=10) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)

    return True
