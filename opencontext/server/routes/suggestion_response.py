# -*- coding: utf-8 -*-

# Copyright (c) 2025 Beijing Volcano Engine Technology Co., Ltd.
# SPDX-License-Identifier: Apache-2.0

"""
Suggestion Response API routes - handles user responses to proactive suggestions
"""

from typing import Optional

from fastapi import APIRouter
from pydantic import BaseModel

from opencontext.storage.global_storage import get_storage
from opencontext.utils.logging_utils import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api/suggestion", tags=["suggestion"])


class SuggestionResponse(BaseModel):
    """Model for suggestion response data"""
    suggestion_id: str
    action: str  # 'accept' or 'reject'
    reason: Optional[str] = None
    timestamp: float


@router.post("/response")
async def save_suggestion_response(response: SuggestionResponse):
    """
    Save user's response to a proactive suggestion.

    Args:
        response: The suggestion response containing:
            - suggestion_id: ID of the suggestion
            - action: 'accept' or 'reject'
            - reason: Optional reason provided by user
            - timestamp: When the response was made

    Returns:
        Status of the save operation
    """
    try:
        storage = get_storage()
        if storage is None:
            logger.warning("Storage not initialized, cannot save suggestion response")
            return {"status": "error", "message": "Storage not initialized"}

        # Save the response
        success = storage.save_suggestion_response(
            suggestion_id=response.suggestion_id,
            action=response.action,
            reason=response.reason,
            timestamp=response.timestamp,
        )

        if success:
            logger.info(
                f"Suggestion response saved: {response.action} for {response.suggestion_id}"
            )
            return {"status": "ok"}
        else:
            logger.error("Failed to save suggestion response")
            return {"status": "error", "message": "Failed to save response"}

    except Exception as e:
        logger.exception(f"Error saving suggestion response: {e}")
        return {"status": "error", "message": str(e)}


@router.get("/responses")
async def get_suggestion_responses(
    limit: int = 100,
    offset: int = 0,
    action: Optional[str] = None,
):
    """
    Get list of suggestion responses.

    Args:
        limit: Maximum number of responses to return
        offset: Offset for pagination
        action: Filter by action type ('accept' or 'reject')

    Returns:
        List of suggestion responses
    """
    try:
        storage = get_storage()
        if storage is None:
            return {"status": "error", "message": "Storage not initialized", "data": []}

        responses = storage.get_suggestion_responses(
            limit=limit,
            offset=offset,
            action=action,
        )

        return {"status": "ok", "data": responses}

    except Exception as e:
        logger.exception(f"Error getting suggestion responses: {e}")
        return {"status": "error", "message": str(e), "data": []}
