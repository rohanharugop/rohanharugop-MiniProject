from fastapi import APIRouter, HTTPException
from pathlib import Path
import uuid
import json

from models import UserCreate
from db import users, checklists

router = APIRouter()
TEMPLATE_PATH = Path("./templates")

@router.post("/signup")
def create_user_checklist(user_data: UserCreate):
    template_key = f"{user_data.stream.lower()}_{user_data.goal.lower()}_{user_data.specialization.lower()}"
    template_file = TEMPLATE_PATH / f"{template_key}.json"

    if not template_file.exists():
        raise HTTPException(status_code=404, detail="Template not found")

    with open(template_file) as f:
        template = json.load(f)

    user_id = str(uuid.uuid4())

    users.insert_one({
        "_id": user_id,
        "stream": user_data.stream,
        "goal": user_data.goal,
        "specialization": user_data.specialization
    })

    progress = [{"item_id": item["id"], "completed": False} for item in template["items"]]
    checklists.insert_one({
        "user_id": user_id,
        "template_id": template_key,
        "progress": progress
    })

    return {"user_id": user_id}
