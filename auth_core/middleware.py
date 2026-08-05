from django.conf import settings
from django.http import JsonResponse
import jwt
from jwt import PyJWKClient
import logging
from datetime import timedelta
import os

logger = logging.getLogger(__name__)

JWKS_CLIENTS_CACHE = {}


def get_jwks_client(realm_url):
    """Get or create a PyJWKClient for the given realm."""
    if realm_url not in JWKS_CLIENTS_CACHE:
        keycloak_server = os.environ.get('KEYCLOAK_SERVER_URL', realm_url)
        print(keycloak_server,"--------------------------18--------------------")
        realm_name = realm_url.split('/realms/')[-1]
        internal_url = f"{keycloak_server}/realms/{realm_name}"
        jwks_url = f"{realm_url}/protocol/openid-connect/certs"
        print(jwks_url,"dds")
        JWKS_CLIENTS_CACHE[realm_url] = PyJWKClient(jwks_url)
    return JWKS_CLIENTS_CACHE[realm_url]


# class KeycloakMiddleware:

#     def __init__(self, get_response):
#         self.get_response = get_response
#         self.exempt_paths = settings.KEYCLOAK_EXEMPT_PATHS

#     def __call__(self, request):
#         path = request.path_info.lstrip('/')
#         if any(path.startswith(exempt) for exempt in self.exempt_paths):
#             return self.get_response(request)

#         auth_header = request.META.get('HTTP_AUTHORIZATION', '')
#         if not auth_header.startswith('Bearer '):
#             return JsonResponse({'error': 'Authorization token missing'}, status=401)

#         token = auth_header.split(' ')[1]

#         try:
#             unverified = jwt.decode(token, options={"verify_signature": False})
#             issuer = unverified.get('iss')

#             if not issuer:
#                 return JsonResponse({'error': 'Invalid token: no issuer'}, status=401)

#             realm_name = issuer.split('/realms/')[-1]

#             jwks_client = get_jwks_client(issuer)
#             signing_key = jwks_client.get_signing_key_from_jwt(token)

#             decoded = jwt.decode(
#                 token,
#                 signing_key.key,
#                 algorithms=['RS256'],
#                 # audience='project-management-app',
#                 options={
#                     "verify_aud": False,
#                     "verify_iat": False,
#                 },
#                 leeway=timedelta(seconds=120)
#             )

#             YOUR_ROLES = ['superadmin', 'admin', 'author', 'editor', 'viewer']
#             all_roles = decoded.get('realm_access', {}).get('roles', [])
#             user_roles = [r for r in all_roles if r in YOUR_ROLES]

#             # Sync user into local DB — only write when creating or when something changed
#             from auth_core.models import ERPUser
#             is_first_login = False
#             erp_user = None
#             try:
#                 erp_user = ERPUser.objects.filter(sub=decoded['sub']).first()

#                 if erp_user is None:
#                     # Brand new user — create once
#                     erp_user = ERPUser.objects.create(
#                         sub=decoded['sub'],
#                         username=decoded.get('preferred_username', ''),
#                         email=decoded.get('email', ''),
#                         first_name=decoded.get('given_name', ''),
#                         last_name=decoded.get('family_name', ''),
#                         realm=realm_name,
#                         roles=user_roles,
#                     )
#                     is_first_login = True
#                 else:
#                     # Existing user — only write fields that actually changed
#                     incoming = {
#                         'username':   decoded.get('preferred_username', ''),
#                         'email':      decoded.get('email', ''),
#                         'first_name': decoded.get('given_name', ''),
#                         'last_name':  decoded.get('family_name', ''),
#                         'realm':      realm_name,
#                         'roles':      user_roles,
#                     }
#                     changed_fields = [
#                         field for field, value in incoming.items()
#                         if getattr(erp_user, field) != value
#                     ]
#                     if changed_fields:
#                         for field in changed_fields:
#                             setattr(erp_user, field, incoming[field])
#                         erp_user.save(update_fields=changed_fields)

#             except Exception as e:
#                 logger.warning(f"ERPUser sync failed: {e}")
            
#             if erp_user is None:
#                 return JsonResponse({'error': 'User sync failed'}, status=401)
#             print("...............................................kkkk.......................")
#             request.user = erp_user

#             request.META['KEYCLOAK_USER'] = {
#                 'username':        decoded.get('preferred_username'),
#                 'email':           decoded.get('email'),
#                 'first_name':      decoded.get('given_name'),
#                 'last_name':       decoded.get('family_name'),
#                 'realm':           realm_name,
#                 'roles':           user_roles,
#                 'sub':             decoded.get('sub'),
#                 'is_first_login':  is_first_login,
#             }

#         except jwt.ExpiredSignatureError:
#             return JsonResponse({'error': 'Token has expired'}, status=401)

#         except jwt.InvalidTokenError as e:
#             logger.error(f"JWT Error: {e}")
#             return JsonResponse({'error': 'Invalid token'}, status=401)

#         except Exception as e:
#             logger.error(f"Auth error: {e}")
#             return JsonResponse({'error': 'Authentication failed'}, status=401)

#         return self.get_response(request)




class KeycloakMiddleware:
 
    def __init__(self, get_response):
        self.get_response = get_response
        self.exempt_paths = settings.KEYCLOAK_EXEMPT_PATHS
 
    def __call__(self, request):
        path = request.path_info.lstrip('/')
        if any(path.startswith(exempt) for exempt in self.exempt_paths):
            return self.get_response(request)
 
        # ---- DEV-ONLY BYPASS: hardcoded user for local testing ----
        if getattr(settings, 'USE_FAKE_AUTH', False):
            from auth_core.models import ERPUser
 
            fake_sub = 'test-user-sub-001'
            erp_user, _ = ERPUser.objects.get_or_create(
                sub=fake_sub,
                defaults={
                    'username': 'testuser',
                    'email': 'testuser@example.com',
                    'first_name': 'Test',
                    'last_name': 'User',
                    'realm': 'test-realm',
                    'roles': ['admin'],
                }
            )
            request.user = erp_user
            request.META['KEYCLOAK_USER'] = {
                'username': erp_user.username,
                'email': erp_user.email,
                'first_name': erp_user.first_name,
                'last_name': erp_user.last_name,
                'realm': erp_user.realm,
                'roles': erp_user.roles,
                'sub': erp_user.sub,
                'is_first_login': False,
            }
            return self.get_response(request)
        # ---- END DEV BYPASS ----
 
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authorization token missing'}, status=401)
 
#         # ...rest of your existing real JWT logic stays exactly the same...
# class KeycloakMiddleware:
 
#     def __init__(self, get_response):
#         self.get_response = get_response
#         self.exempt_paths = settings.KEYCLOAK_EXEMPT_PATHS
 
#     def __call__(self, request):
#         path = request.path_info.lstrip('/')
#         if any(path.startswith(exempt) for exempt in self.exempt_paths):
#             return self.get_response(request)
 
#         # ---- DEV-ONLY BYPASS: hardcoded user for local testing ----
#         if getattr(settings, 'USE_FAKE_AUTH', False):
#             from auth_core.models import ERPUser
 
#             fake_sub = 'test-user-sub-001'
#             erp_user, _ = ERPUser.objects.get_or_create(
#                 sub=fake_sub,
#                 defaults={
#                     'username': 'testuser',
#                     'email': 'testuser@example.com',
#                     'first_name': 'Test',
#                     'last_name': 'User',
#                     'realm': 'test-realm',
#                     'roles': ['admin'],
#                 }
#             )
#             request.user = erp_user
#             request.META['KEYCLOAK_USER'] = {
#                 'username': erp_user.username,
#                 'email': erp_user.email,
#                 'first_name': erp_user.first_name,
#                 'last_name': erp_user.last_name,
#                 'realm': erp_user.realm,
#                 'roles': erp_user.roles,
#                 'sub': erp_user.sub,
#                 'is_first_login': False,
#             }
#             return self.get_response(request)
#         # ---- END DEV BYPASS ----
 
#         auth_header = request.META.get('HTTP_AUTHORIZATION', '')
#         if not auth_header.startswith('Bearer '):
#             return JsonResponse({'error': 'Authorization token missing'}, status=401)
 
#         # ...rest of your existing real JWT logic stays exactly the same...