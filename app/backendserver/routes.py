from fastapi import APIRouter, HTTPException
from .models import CollegeRequest
from .storage import save_college_data

router = APIRouter()

@router.post("/college-info")
def college_info(prompt: str):
    # For demonstration, return a static College JSON object
    college_data = {
        "college": {
            "name": "College-ABC",
            "CourseName": "Course-XYZ",
            "Fees": 12345.00,
            "ExpectedKCETCutoff": 1000,
            "Placement": ["HPE", "IBM"]
        }
    }
    return college_data

@router.post("/save-college")
def save_college(college_req: CollegeRequest):
    if save_college_data(college_req.dict()):
        return {"status": "success"}
    else:
        raise HTTPException(status_code=500, detail="Failed to save college")