from rest_framework import viewsets
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from core.api_mixins import APIResponseMixin
from projects.models import Project
from teams.models import Team
import json


class AvailableDataView:
    """View to fetch available projects with tabs, categories, subcategories and teams"""

    @staticmethod
    def get_available_data():
        """Get all available projects, tabs, categories, subcategories and teams"""

        # Get all projects with their details
        projects = Project.objects.all()
        projects_list = []
        all_categories = set()
        all_subcategories = set()

        for project in projects:
            # Extract tabs from JSONField (could be list or single value)
            tabs = project.tab if isinstance(project.tab, list) else [project.tab] if project.tab else []

            # Extract categories from JSONField (could be list or single value)
            categories = project.category if isinstance(project.category, list) else [project.category] if project.category else []

            # Extract subcategories from JSONField (could be list or single value)
            subcategories = project.subcategory if isinstance(project.subcategory, list) else [project.subcategory] if project.subcategory else []

            # Add to sets for collecting all unique values
            all_categories.update(categories)
            all_subcategories.update(subcategories)

            # Build tabs array - convert string list to objects with id and name


            project_data = {
                "id": project.id,
                "name": project.name,
                "category": categories,
                "subcategory": subcategories,
                "tabs": tabs
            }
            projects_list.append(project_data)

        # Get all teams
        teams = Team.objects.all()
        teams_list = [
            {
                "id": team.id,
                "team_id": team.team_id,
                "name": team.name
            }
            for team in teams
        ]

        return {
            "projects": projects_list,
            "teams": teams_list,
            "categories": list(all_categories),
            "subcategories": list(all_subcategories)
        }


@csrf_exempt
@require_http_methods(["GET"])
def available_data(request):
    """
    Custom API endpoint to fetch available projects, tabs, categories, subcategories and teams
    GET /api/available-data/

    Returns:
    {
        "success": true,
        "message": "Fetched successfully",
        "data": {
            "projects": [
                {
                    "id": 1,
                    "name": "Project Alpha",
                    "category": ["web", "mobile"],
                    "subcategory": ["frontend"],
                    "tabs": [
                        {"id": 101, "name": "Tab A"},
                        {"id": 102, "name": "Tab B"}
                    ]
                }
            ],
            "teams": [
                {"id": 1, "team_id": 1, "name": "Team Red"},
                {"id": 2, "team_id": 2, "name": "Team Blue"}
            ],
            "categories": ["web", "mobile"],
            "subcategories": ["frontend", "backend"]
        },
        "meta": {}
    }
    """
    try:
        data = AvailableDataView.get_available_data()

        response = {
            "success": True,
            "message": "Fetched successfully",
            "data": data,
            "meta": {}
        }

        return JsonResponse(response)

    except Exception as e:
        response = {
            "success": False,
            "message": f"Error: {str(e)}",
            "data": None,
            "meta": {"status_code": 500}
        }
        return JsonResponse(response, status=500)

