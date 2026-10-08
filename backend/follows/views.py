from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .models import Follow
from users.serializers import UserSerializer

User = get_user_model()

class FollowToggleView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, username):
        target_user = get_object_or_404(User, username=username)
        if target_user == request.user:
            return Response({'error': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
        
        follow_qs = Follow.objects.filter(follower=request.user, following=target_user)
        if follow_qs.exists():
            follow_qs.delete()
            return Response({'following': False, 'message': f'Unfollowed {username} successfully'}, status=status.HTTP_200_OK)
        else:
            Follow.objects.create(follower=request.user, following=target_user)
            return Response({'following': True, 'message': f'Followed {username} successfully'}, status=status.HTTP_201_CREATED)

class FollowersListView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        # follower is the FK in Follow pointing to CustomUser
        followers = User.objects.filter(following__following=user)
        serializer = UserSerializer(followers, many=True, context={'request': request})
        return Response(serializer.data)

class FollowingListView(APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, username):
        user = get_object_or_404(User, username=username)
        # following is the FK in Follow pointing to CustomUser
        following = User.objects.filter(followers__follower=user)
        serializer = UserSerializer(following, many=True, context={'request': request})
        return Response(serializer.data)
