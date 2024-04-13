import asyncio
import datetime
import json
import uuid

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse

app = FastAPI()

# Set up CORS middleware
# You can adjust the origins list to the domains you want to allow
# '*' allows all domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4173"],  # Adjust this to your frontend's address
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


async def fake_video_streamer():
    for i in range(10):
        await asyncio.sleep(1)
        # Create a JSON object for this iteration
        data = {
            "id": str(uuid.uuid4()),
            "iteration": i,
            "content": f"some fake video bytes at {datetime.datetime.now()}",
        }
        # Convert the JSON object to a string and add a newline at the end
        yield json.dumps(data) + "\n"


@app.get("/")
async def main():
    return StreamingResponse(fake_video_streamer())


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
