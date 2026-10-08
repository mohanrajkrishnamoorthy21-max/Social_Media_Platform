from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from posts.models import Post
from .models import Like

class LikeToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, post_id):
        post = get_object_or_404(Post, pk=post_id)
        like_qs = Like.objects.filter(post=post, user=request.user)
        if like_qs.exists():
            like_qs.delete()
            return Response({'liked': False, 'message': 'Post unliked successfully'}, status=status.HTTP_200_OK)
        else:
            Like.objects.create(post=post, user=request.user)
            return Response({'liked': True, 'message': 'Post liked successfully'}, status=status.HTTP_201_CREATED)
