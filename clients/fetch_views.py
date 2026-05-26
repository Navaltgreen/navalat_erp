from rest_framework import viewsets
from rest_framework.response import Response
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from core.api_mixins import APIResponseMixin
from .models import Client
from projects.models import Project
import json


class ClientsWithProjectsView:
    """Custom view to fetch clients with nested projects and totals"""

    @staticmethod
    def get_clients_data():
        """Get all clients with their associated projects"""
        clients = Client.objects.all()
        clients_list = []
        total_projects = 0

        for client in clients:
            # Get projects for this client
            # Assuming projects are associated with clients somehow
            # For now, we'll get all projects and associate them
            projects = Project.objects.all().values('id', 'name')

            projects_list = [
                {
                    'id': str(p['id']),
                    'name': p['name']
                }
                for p in projects
            ]

            total_projects += len(projects_list)

            client_data = {
                'id': str(client.id),
                'name': client.name,
                'email': client.email or '',
                'phone_number': str(client.phone_number) if client.phone_number else '',
                'country': client.country or '',
                'address': client.address or '',
                'projects': projects_list
            }
            clients_list.append(client_data)

        return {
            'clients': clients_list,
            'totalClients': len(clients_list),
            'totalProjects': total_projects
        }


@csrf_exempt
@require_http_methods(["GET"])
def fetch_clients(request):
    """
    Custom API endpoint to fetch clients with nested projects
    GET /api/fetch-clients/

    Returns:
    {
        "success": true,
        "data": {
            "clients": [...],
            "totalClients": 2,
            "totalProjects": 3
        },
        "message": "Fetched successfully",
        "meta": {}
    }
    """
    try:
        data = ClientsWithProjectsView.get_clients_data()

        response = {
            "success": True,
            "data": data,
            "message": "Fetched successfully",
            "meta": {}
        }

        return JsonResponse(response)

    except Exception as e:
        response = {
            "success": False,
            "data": None,
            "message": f"Error: {str(e)}",
            "meta": {"status_code": 500}
        }
        return JsonResponse(response, status=500)

