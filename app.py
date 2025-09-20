# app.py

"""
Minimal FastAPI server demonstrating how to integrate Pydantic AI
with the AG‑UI protocol for a healthcare insurance assistant.

This code sets up an AI agent using the pydantic‑ai library and
exposes it over AG‑UI.  A single endpoint receives AG‑UI requests
from a front‑end (for example a React Native mobile app) and
returns a streaming response of AG‑UI events.

The agent definition shows how to register custom tools that can
interact with your business logic (e.g. calling nphies APIs or
internal services).  A simple `check_eligibility` tool is provided
as an example.
"""

from __future__ import annotations

from fastapi import FastAPI, Request
from starlette.responses import Response, FileResponse
from pydantic import BaseModel

# Import the core pieces from pydantic‑ai
from pydantic_ai import Agent, RunContext
from pydantic_ai.ag_ui import handle_ag_ui_request, StateDeps
from pydantic_ai.messages import ToolReturn

# Import AG‑UI event classes for sending state updates
from ag_ui.core import EventType
from ag_ui.core import StateSnapshotEvent


class ConversationState(BaseModel):
    """Shared state between the client and agent.

    The AG‑UI protocol allows the server to maintain a state
    object that is synchronized with the front‑end.  You can
    expand this with fields relevant to your domain (e.g.
    claim identifiers, coverage flags, uploaded documents).
    """

    claim_id: str | None = None
    coverage_checked: bool = False


# Instantiate an agent using an OpenAI model and provide basic
# instructions.  Replace `openai:gpt-4.1` with another provider
# when using a different LLM.  The `deps_type` argument tells
# pydantic‑ai to use StateDeps with our ConversationState class.
agent = Agent(
    "openai:gpt-4.1",
    instructions=(
        "You are an assistant that helps healthcare providers and insurers "
        "communicate about insurance eligibility, claims and pre‑authorizations. "
        "Answer clearly in the same language as the user input (Arabic or English) "
        "and explain next steps when appropriate."
    ),
    deps_type=StateDeps[ConversationState],
)


@agent.tool
async def check_eligibility(
    ctx: RunContext[StateDeps[ConversationState]],
    patient_id: str,
    provider_id: str,
) -> ToolReturn:
    """Simulate an insurance eligibility check.

    In a production system this function would call the nphies API
    or an internal insurance eligibility service.  Here we update
    the shared state and return a dummy result.  The return value
    must be wrapped in a ToolReturn so that pydantic‑ai can
    translate it into an AG‑UI tool return event.  We also send
    back a StateSnapshotEvent to synchronize the updated state
    with the front‑end.
    """
    # Update the conversation state to reflect that coverage has been checked
    ctx.deps.state.coverage_checked = True

    # Compose a response message.  In a real integration you would
    # build this based on the API response.
    result_message = (
        f"Eligibility check for patient {patient_id} at provider "
        f"{provider_id}: covered."
    )

    # Send the response along with a state snapshot so the UI
    # can update its local state.
    return ToolReturn(
        return_value=result_message,
        metadata=[
            StateSnapshotEvent(
                type=EventType.STATE_SNAPSHOT,
                snapshot=ctx.deps.state,
            ),
        ],
    )


@agent.tool
async def summarize_claim(
    claim_text: str,
) -> str:
    """A placeholder tool to summarize claim details.

    The pydantic‑ai framework will call the underlying LLM to
    generate a summary.  This could be enhanced with RAG
    techniques to pull in policy definitions or ICD codes.
    """
    # The default agent will use the LLM to process this prompt
    return f"Please summarize the following claim in plain language: {claim_text}"


# Initialize the FastAPI application
app = FastAPI()


@app.post("/")
async def run_agent(request: Request) -> Response:
    """HTTP endpoint that handles AG‑UI requests.

    The AG‑UI front‑end will POST a RunAgentInput JSON to this
    endpoint.  `handle_ag_ui_request` converts the request into
    pydantic‑ai types and returns a streaming response of AG‑UI
    events.  The FastAPI endpoint returns this streaming
    response directly to the client.
    """
    return await handle_ag_ui_request(agent, request)

@app.get("/login")
async def login():
    return FileResponse("login.html")

@app.get("/dashboard")
async def dashboard():
    return FileResponse("dashboard.html")

@app.get("/nphies")
async def nphies():
    return FileResponse("nphies.html")

@app.get("/profile")
async def profile():
    return FileResponse("profile.html")

@app.get("/notifications")
async def notifications():
    return FileResponse("notifications.html")

@app.get("/pre-authorization")
async def pre_authorization():
    return FileResponse("pre-authorization.html")

@app.get("/eligibility")
async def eligibility():
    return FileResponse("eligibility.html")

