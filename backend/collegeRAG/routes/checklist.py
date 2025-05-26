from fastapi import APIRouter, HTTPException
from pathlib import Path
import json

from models import ItemStatusUpdate
from db import users, checklists

router = APIRouter()
TEMPLATE_PATH = Path("./templates")

@router.get("/checklist/{user_id}")
def get_user_checklist(user_id: str):
    user = users.find_one({"_id": user_id})
    user_checklist = checklists.find_one({"user_id": user_id})
    if not user or not user_checklist:
        raise HTTPException(status_code=404, detail="User or checklist not found")

    template_file = TEMPLATE_PATH / f"{user_checklist['template_id']}.json"
    with open(template_file) as f:
        template = json.load(f)

    progress_map = {p["item_id"]: p["completed"] for p in user_checklist["progress"]}
    items = [
        {
            "id": item["id"],
            "title": item["title"],
            "type": item["type"],
            "completed": progress_map.get(item["id"], False)
        }
        for item in template["items"]
    ]
    return {"title": template["title"], "items": items}

@router.patch("/checklist/{user_id}/{item_id}")
def update_checklist_item(user_id: str, item_id: str, update: ItemStatusUpdate):
    result = checklists.update_one(
        {"user_id": user_id, "progress.item_id": item_id},
        {"$set": {"progress.$.completed": update.completed}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Checklist item not found")
    return {"message": "Item updated"}
