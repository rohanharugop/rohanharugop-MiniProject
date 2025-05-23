from typing import List, Dict, Any

# In-memory storage for demonstration
saved_colleges: List[Dict[str, Any]] = []

def save_college_data(college_data: Dict[str, Any]) -> bool:
    try:
        saved_colleges.append(college_data)
        return True
    except Exception:
        return False