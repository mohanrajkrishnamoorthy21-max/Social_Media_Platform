from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth import get_user_model
from posts.models import Post
from comments.models import Comment
from likes.models import Like
from follows.models import Follow

User = get_user_model()

class SocialMediaAPITests(APITestCase):

    def setUp(self):
        self.user1_data = {
            'username': 'alice',
            'email': 'alice@example.com',
            'password': 'password123'
        }
        self.user2_data = {
            'username': 'bob',
            'email': 'bob@example.com',
            'password': 'password123'
        }
        # Register alice
        self.user1 = User.objects.create_user(**self.user1_data)
        # Register bob
        self.user2 = User.objects.create_user(**self.user2_data)

    def test_register_user(self):
        url = reverse('register')
        data = {
            'username': 'charlie',
            'email': 'charlie@example.com',
            'password': 'password123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertEqual(response.data['user']['username'], 'charlie')

    def test_login_user(self):
        url = reverse('login')
        data = {
            'username': 'alice',
            'password': 'password123'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_create_post(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('post-list-create')
        data = {'content': 'Hello world!'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['content'], 'Hello world!')
        self.assertEqual(response.data['user']['username'], 'alice')

    def test_like_post(self):
        post = Post.objects.create(user=self.user1, content='Alicia post')
        self.client.force_authenticate(user=self.user2)
        url = reverse('like-toggle', kwargs={'post_id': post.id})
        
        # Like
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['liked'])
        self.assertEqual(Like.objects.filter(post=post, user=self.user2).count(), 1)

        # Unlike
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['liked'])
        self.assertEqual(Like.objects.filter(post=post, user=self.user2).count(), 0)

    def test_comment_post(self):
        post = Post.objects.create(user=self.user1, content='Alicia post')
        self.client.force_authenticate(user=self.user2)
        url = reverse('comment-list-create', kwargs={'post_id': post.id})
        data = {'text': 'Awesome post!'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['text'], 'Awesome post!')
        self.assertEqual(Comment.objects.filter(post=post, user=self.user2).count(), 1)

    def test_follow_user(self):
        self.client.force_authenticate(user=self.user1)
        url = reverse('follow-toggle', kwargs={'username': 'bob'})
        
        # Follow
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data['following'])
        self.assertEqual(Follow.objects.filter(follower=self.user1, following=self.user2).count(), 1)

        # Unfollow
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['following'])
        self.assertEqual(Follow.objects.filter(follower=self.user1, following=self.user2).count(), 0)
