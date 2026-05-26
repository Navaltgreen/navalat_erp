from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .fetch_views import fetch_clients

router = DefaultRouter()
router.register(r'', views.ClientViewSet, basename='client')

urlpatterns = [
    path('fetch/', fetch_clients, name='fetch-clients'),
    path('', include(router.urls)),
]

