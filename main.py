from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import requests
import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from models import engine, MessageLog

load_dotenv()

WHATSAPP_TOKEN = os.getenv("WHATSAPP_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")
TEMPLATE_NAME = os.getenv("TEMPLATE_NAME")
SHOPIFY_STORE_URL = os.getenv("SHOPIFY_STORE_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Session = sessionmaker(bind=engine)

@app.get("/logs")
async def get_logs():
    session = Session()
    logs = session.query(MessageLog).order_by(MessageLog.timestamp.desc()).all()
    return [{"id": log.id, "phone": log.phone, "template": log.template_name, 
             "status": log.status, "error": log.error_details, 
             "timestamp": log.timestamp.isoformat()} for log in logs]

@app.post("/retry/{log_id}")
async def retry_message(log_id: int):
    session = Session()
    log = session.query(MessageLog).filter(MessageLog.id == log_id).first()
    if not log:
        return {"status": "Log not found"}
        
    # Reuse existing sending logic
    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "messaging_product": "whatsapp",
        "to": log.phone,
        "type": "template",
        "template": {
            "name": log.template_name,
            "language": {"code": "en_US"},
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {"type": "text", "text": "Your cart is waiting!"},
                        {"type": "text", "text": f"https://{SHOPIFY_STORE_URL}/cart"}
                    ]
                }
            ]
        }
    }

    r = requests.post(url, headers=headers, json=payload)
    return {"status": "Retried", "response": r.json()}

@app.post("/webhook")
async def handle_webhook(request: Request):
    data = await request.json()
    phone = data.get("phone")
    cart_url = f"https://{SHOPIFY_STORE_URL}/cart"

    if not phone:
        return {"status": "No phone number found in webhook"}

    url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
    headers = {
        "Authorization": f"Bearer {WHATSAPP_TOKEN}",
        "Content-Type": "application/json"
    }

    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "template",
        "template": {
            "name": TEMPLATE_NAME,
            "language": {"code": "en_US"},
            "components": [
                {
                    "type": "body",
                    "parameters": [
                        {"type": "text", "text": "Your cart is waiting!"},
                        {"type": "text", "text": cart_url}
                    ]
                }
            ]
        }
    }

    r = requests.post(url, headers=headers, json=payload)

    session = Session()
    log = MessageLog(
        phone=phone,
        template_name=TEMPLATE_NAME,
        status="success" if r.status_code == 200 else "failed",
        error_details=r.text if r.status_code != 200 else None
    )
    session.add(log)
    session.commit()

    if r.status_code == 200:
        return {"status": "Message sent!"}
    else:
        return {"status": "Failed", "details": r.text}