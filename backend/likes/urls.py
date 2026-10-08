from django.urls import path
from .views import LikeToggleView

urlpatterns = [
    path('posts/<int:post_id>/like/', LikeToggleView.as_view(), name='like-toggle'),
]
