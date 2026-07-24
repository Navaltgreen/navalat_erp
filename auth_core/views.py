import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from auth_core.models import ERPUser

@require_http_methods(["GET"])
def whoami(request):
    """Returns the current authenticated user's details."""
    user_info = request.META.get('KEYCLOAK_USER')
    if not user_info:
        return JsonResponse({'error': 'Not authenticated'}, status=401)

    try:
        erp_user = ERPUser.objects.get(sub=user_info['sub'])
    except ERPUser.DoesNotExist:
        return JsonResponse({'error': 'User not found'}, status=404)

    return JsonResponse({
        'sub':               erp_user.sub,
        'username':          erp_user.username,
        'email':             erp_user.email,
        'first_name':        erp_user.first_name,
        'last_name':         erp_user.last_name,
        'roles':             erp_user.roles,
        'designation':       erp_user.designation,
        'employee_id':       erp_user.employee_id,
        'phone_number':      erp_user.phone_number,
        'team_member_id':    erp_user.team_member_id,
        'profile_completed': erp_user.profile_completed,
        'is_first_login':    user_info.get('is_first_login', False),
    })