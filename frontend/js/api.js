const API_BASE_URL = 'http://localhost:8000/api';

class ApiService {
    static getToken() {
        return localStorage.getItem('aura_token');
    }

    static setToken(token) {
        if (token) {
            localStorage.setItem('aura_token', token);
        } else {
            localStorage.removeItem('aura_token');
        }
    }

    static getHeaders(contentType = 'application/json') {
        const headers = {};
        if (contentType) {
            headers['Content-Type'] = contentType;
        }
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }
        return headers;
    }

    static async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        
        // Handle Content-Type header if sending FormData (should NOT set Content-Type manually, fetch will do it with boundary)
        const isFormData = options.body instanceof FormData;
        const headers = this.getHeaders(isFormData ? null : 'application/json');

        const config = {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 204) {
                return { success: true };
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw { status: response.status, errors: data };
            }
            
            return { success: true, data };
        } catch (error) {
            console.error(`API Error on ${endpoint}:`, error);
            throw error;
        }
    }

    // Auth endpoints
    static register(username, email, password) {
        return this.request('/register/', {
            method: 'POST',
            body: JSON.stringify({ username, email, password })
        });
    }

    static login(username, password) {
        return this.request('/login/', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
    }

    static logout() {
        return this.request('/logout/', { method: 'POST' });
    }

    static getMe() {
        return this.request('/me/');
    }

    // Profiles
    static getProfile(username) {
        return this.request(`/profile/${username}/`);
    }

    static updateProfile(formData) {
        return this.request('/profile/update/', {
            method: 'PUT',
            body: formData
        });
    }

    static getSuggestedUsers() {
        return this.request('/suggested/');
    }

    // Posts
    static getFeed() {
        return this.request('/posts/');
    }

    static getUserPosts(username) {
        return this.request(`/posts/user/${username}/`);
    }

    static getPostDetail(id) {
        return this.request(`/posts/${id}/`);
    }

    static createPost(formData) {
        return this.request('/posts/', {
            method: 'POST',
            body: formData
        });
    }

    static updatePost(id, content) {
        return this.request(`/posts/${id}/`, {
            method: 'PUT',
            body: JSON.stringify({ content })
        });
    }

    static deletePost(id) {
        return this.request(`/posts/${id}/`, { method: 'DELETE' });
    }

    // Comments
    static getComments(postId) {
        return this.request(`/posts/${postId}/comments/`);
    }

    static addComment(postId, text) {
        return this.request(`/posts/${postId}/comments/`, {
            method: 'POST',
            body: JSON.stringify({ text })
        });
    }

    static deleteComment(id) {
        return this.request(`/comments/${id}/`, { method: 'DELETE' });
    }

    // Likes
    static toggleLike(postId) {
        return this.request(`/posts/${postId}/like/`, { method: 'POST' });
    }

    // Follows
    static toggleFollow(username) {
        return this.request(`/users/${username}/follow/`, { method: 'POST' });
    }

    static getFollowers(username) {
        return this.request(`/users/${username}/followers/`);
    }

    static getFollowing(username) {
        return this.request(`/users/${username}/following/`);
    }
}
