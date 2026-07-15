from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel
import json
from src.platform.ai.manager import ai_manager
from src.platform.audit.service import audit_service
from src.platform.eventbus.bus import DomainEvent
from src.security.auth.dependencies import require_user
from src.security.auth.schemas import UserPublic
import uuid
import datetime

router = APIRouter()

class DashboardContext(BaseModel):
    timestamp: str
    gateStatus: list
    unitStatus: dict
    crowdCongestion: list
    thermalAnomalies: int

@router.post("/recommendations")
async def generate_recommendations(
    context: DashboardContext,
    request: Request,
    _user: UserPublic = Depends(require_user)
):
    event_bus = request.app.state.event_bus
    # Log the action
    event = DomainEvent(
        event_type="ai.copilot_requested",
        actor_id=_user.id,
        payload={"context": context.model_dump()}
    )
    event_bus.publish_sync(event)

    prompt = f"""
You are the AI Operations Copilot for PERIMO, a Smart Stadiums & Tournament Operations platform.
Analyze the following live dashboard state and generate critical operational recommendations.
Do not generate generic responses. Be specific, actionable, and calm.
Never execute actions automatically; you are only recommending them.

Current Dashboard State:
{json.dumps(context.model_dump(), indent=2)}

Provide your response as a JSON array of objects with these keys: title, explanation, whyItMatters, confidence, recommendedAction, estimatedImpact, classification.
    """
    
    # We will let ai_manager generate content. 
    # Usually we pass responseSchema in generation_config, but we can also just ask for JSON string.
    try:
        response_text = await ai_manager.generate_content(prompt)
        
        # Clean markdown formatting if any
        if response_text.startswith("```json"):
            response_text = response_text[7:-3]
        elif response_text.startswith("```"):
            response_text = response_text[3:-3]
            
        data = json.loads(response_text)
        
        # Add generated IDs and timestamps
        for item in data:
            item["id"] = str(uuid.uuid4())
            item["timestamp"] = datetime.datetime.utcnow().isoformat()
            item["status"] = "PENDING"
            
        return data
    except Exception as e:
        return {"error": "AI Copilot is temporarily unavailable.", "details": str(e)}

@router.get("/health")
def get_ai_health():
    return ai_manager.check_health()
