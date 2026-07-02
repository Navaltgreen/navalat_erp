from django.urls import path
from auth_core.views import whoami

urlpatterns = [
    path('me/', whoami, name='whoami'),
#     path('complete-profile/', complete_profile, name='complete_profile'),
]