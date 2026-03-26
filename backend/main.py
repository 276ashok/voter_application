import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import upload, records

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Voter Data API")

origins = [
    "http://localhost:5173", 
    "http://127.0.0.1:5173"
]

production_url = os.getenv("FRONTEND_URL")
if production_url:
    origins.append(production_url)

# Configure CORS for our frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(records.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Voter Data API"}
