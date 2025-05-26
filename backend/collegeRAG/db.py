from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017")
db = client["career_app"]

users = db["users"]
checklists = db["user_checklists"]
