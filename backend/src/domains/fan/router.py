from fastapi import APIRouter
from src.domains.fan.home.router import router as home_router

router = APIRouter(tags=["fan"])
router.include_router(home_router)
