from django.urls import path
from .views import FollowToggleView, FollowersListView, FollowingListView

urlpatterns = [
    path('users/<str:username>/follow/', FollowToggleView.as_view(), name='follow-toggle'),
    path('users/<str:username>/followers/', FollowersListView.as_view(), name='followers-list'),
    path('users/<str:username>/following/', FollowingListView.as_view(), name='following-list'),
]
