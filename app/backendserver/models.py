from pydantic import BaseModel
from typing import List

class College(BaseModel):
    name: str
    CourseName: str
    Fees: float
    ExpectedKCETCutoff: int
    Placement: List[str]

class CollegeRequest(BaseModel):
    college: College