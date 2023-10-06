from django.urls import path
from apps.users.views import UserCreateAPIView

urlpatterns = [
    path('registration/', UserCreateAPIView.as_view(), name='registration'),
]
