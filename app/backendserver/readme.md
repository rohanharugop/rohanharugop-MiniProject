# College Info Backend Server

This is a FastAPI backend server that provides REST APIs for retrieving and saving college information.

## Features

- **/college-info**: Accepts a text prompt and returns a sample College JSON object.
- **/save-college**: Accepts a College JSON object and returns success or failure.
- Modular code structure for easy maintenance.

## Project Structure

```
backendserver/
├── main.py         # FastAPI app entry point
├── routes.py       # API route definitions
├── models.py       # Pydantic models for request/response
├── storage.py      # In-memory storage logic
├── requirements.txt
```

## College JSON Object Example

```json
{
  "college": {
    "name": "College-ABC",
    "CourseName": "Course-XYZ",
    "Fees": 12345.0,
    "ExpectedKCETCutoff": 1000,
    "Placement": ["HPE", "IBM"]
  }
}
```

## Setup & Run

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

2. **Run the server:**

   ```bash
   uvicorn main:app --reload
   ```

3. **API Endpoints:**

   - `POST /college-info`  
     Body: `{ "prompt": "your prompt here" }`
   - `POST /save-college`  
     Body: _College JSON object as above_

4. **Test root endpoint:**
   - `GET /`  
     Returns: `{ "message": "College API running" }`

## Notes

- This project uses in-memory storage for demonstration. Data will not persist after server restart.
- For production, consider integrating a database.

---
