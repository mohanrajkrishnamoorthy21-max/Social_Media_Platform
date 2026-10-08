from django.urls import path
from .views import (
    RegisterView, LoginView, LogoutView, CurrentUserView,
    UserProfileView, UpdateProfileView, SuggestedUsersView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', CurrentUserView.as_view(), name='me'),
    path('profile/update/', UpdateProfileView.as_view(), name='profile-update'),
    path('profile/<str:username>/', UserProfileView.as_view(), name='profile-detail'),
    path('suggested/', SuggestedUsersView.as_view(), name='suggested-users'),
]
