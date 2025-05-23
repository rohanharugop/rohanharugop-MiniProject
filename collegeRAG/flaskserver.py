from flask import Flask, request, jsonify
import rag

app = Flask(__name__)

# In-memory storage for demonstration
saved_colleges = []

@app.route('/college-info', methods=['POST'])
def college_info():
    data = request.get_json()
    resp = rag.call_rag(data['prompt'])
    # You can use data['prompt'] if needed
    # college_json = {
    #     "college": {
    #         "name": "College-ABC",
    #         "CourseName": "Course-XYZ",
    #         "Fees": 12345.00,
    #         "ExpectedKCETCutoff": 1000,
    #         "Placement": ["HPE", "IBM"]
    #     }
    # }
    # return jsonify(college_json)
    return (resp)

@app.route('/save-college', methods=['POST'])
def save_college():
    college_data = request.get_json()
    try:
        saved_colleges.append(college_data)
        return jsonify({"status": "success"})
    except Exception:
        return jsonify({"status": "failure"}), 500

@app.route('/', methods=['GET'])
def root():
    return jsonify({"message": "College API running"})

if __name__ == '__main__':
    app.run(debug=True)