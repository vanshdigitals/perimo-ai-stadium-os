from fastapi import APIRouter, Depends, Request
from src.security.auth import require_user, User
from src.domains.fan.schema import HomeOverview

router = APIRouter()

@router.get("/home", response_model=HomeOverview)
def get_home_overview(request: Request, user: User = Depends(require_user)):
    service = request.app.state.fan_home_service
    return service.get_overview(user.id)
