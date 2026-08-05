from rest_framework.authentication import BaseAuthentication
from django.contrib.auth.models import AnonymousUser


class KeycloakDRFAuthentication(BaseAuthentication):
    """
    Bridges the ERPUser already attached to request.user by
    KeycloakMiddleware into DRF's authentication flow.
    """
    def authenticate(self, request):
        user = getattr(request._request, 'user', None)

        if user and not isinstance(user, AnonymousUser):
            return (user, None)

        return None