class AppCoordinator {
    constructor() {
        this.currentUser = null;
        this.currentView = '';
        this.contentContainer = document.getElementById('app-content');
        this.mainSidebar = document.getElementById('main-sidebar');
        this.widgetsSidebar = document.getElementById('widgets-sidebar');
        this.btnLogout = document.getElementById('btn-logout');
        this.mobileNav = document.getElementById('mobile-nav');
        this.btnMobileLogout = document.getElementById('btn-mobile-logout-nav');
        
        // Image preview states
        this.selectedPostFile = null;
        this.selectedSettingsAvatar = null;
    }

    async init() {
        const token = ApiService.getToken();
        if (token) {
            try {
                const response = await ApiService.getMe();
                if (response.success) {
                    this.currentUser = response.data;
                    this.setupAuthenticatedUI();
                } else {
                    this.logoutUser();
                }
            } catch (err) {
                console.error("Auth initialization failed:", err);
                this.logoutUser();
            }
        } else {
            this.logoutUser();
        }

        // Setup routing
        window.addEventListener('hashchange', () => this.route());
        this.route();

        // Setup logout buttons
        this.btnLogout.addEventListener('click', () => this.handleLogout());
        if (this.btnMobileLogout) {
            this.btnMobileLogout.addEventListener('click', () => this.handleLogout());
        }

        // Setup mobile menu toggle
        const mobToggle = document.getElementById('mobile-menu-toggle');
        if (mobToggle) {
            mobToggle.addEventListener('click', () => {
                this.mainSidebar.classList.toggle('active');
            });
        }
    }

    setupAuthenticatedUI() {
        this.mainSidebar.style.display = 'flex';
        this.widgetsSidebar.style.display = 'flex';
        this.btnLogout.style.display = 'flex';
        if (this.mobileNav) this.mobileNav.style.display = 'flex';
        
        // Show current user widget info
        const userWidget = document.getElementById('user-widget');
        const widgetAvatar = document.getElementById('widget-user-avatar');
        const widgetFullname = document.getElementById('widget-user-fullname');
        const widgetHandle = document.getElementById('widget-user-handle');
        const suggestionsWidget = document.getElementById('suggestions-widget');

        if (userWidget && widgetAvatar && widgetFullname && widgetHandle) {
            userWidget.style.display = 'block';
            widgetAvatar.src = UIEngine.getAvatarUrl(this.currentUser);
            widgetFullname.textContent = this.currentUser.username;
            widgetHandle.textContent = `@${this.currentUser.username}`;
        }
        
        if (suggestionsWidget) {
            suggestionsWidget.style.display = 'block';
        }

        this.loadSuggestedUsers();
    }

    logoutUser() {
        this.currentUser = null;
        ApiService.setToken(null);
        this.mainSidebar.style.display = 'none';
        this.widgetsSidebar.style.display = 'none';
        this.btnLogout.style.display = 'none';
        if (this.mobileNav) this.mobileNav.style.display = 'none';
        
        const userWidget = document.getElementById('user-widget');
        const suggestionsWidget = document.getElementById('suggestions-widget');
        if (userWidget) userWidget.style.display = 'none';
        if (suggestionsWidget) suggestionsWidget.style.display = 'none';
        
        if (!window.location.hash.startsWith('#register')) {
            window.location.hash = '#login';
        }
    }

    async loadSuggestedUsers() {
        const listContainer = document.getElementById('widget-suggestions-list');
        if (!listContainer) return;

        try {
            const response = await ApiService.getSuggestedUsers();
            if (response.success && response.data.length > 0) {
                let suggestionsHtml = '';
                response.data.forEach(user => {
                    suggestionsHtml += `
                        <div class="suggestion-item">
                            <a href="#profile/${user.username}" class="suggestion-user-info">
                                <img src="${UIEngine.getAvatarUrl(user)}" alt="${user.username}" class="suggestion-avatar">
                                <div class="suggestion-details">
                                    <span class="suggestion-name">${user.username}</span>
                                    <span class="suggestion-handle">@${user.username}</span>
                                </div>
                            </a>
                            <button class="btn btn-primary btn-follow-sm" onclick="window.appCoordinator.handleFollowToggle('${user.username}', true)">
                                Follow
                            </button>
                        </div>
                    `;
                });
                listContainer.innerHTML = suggestionsHtml;
            } else {
                listContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted);">No suggestions right now.</p>`;
            }
        } catch (error) {
            console.error("Failed to load suggested users:", error);
        }
    }

    // Router
    route() {
        const hash = window.location.hash || '#feed';
        this.currentView = hash;
        
        // Update active navigation item styling
        document.querySelectorAll('.nav-item, .mobile-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const isAuthRoute = hash.startsWith('#login') || hash.startsWith('#register');
        
        if (!this.currentUser && !isAuthRoute) {
            window.location.hash = '#login';
            return;
        }

        if (this.currentUser && isAuthRoute) {
            window.location.hash = '#feed';
            return;
        }

        // Hide mobile menu drawer if active
        this.mainSidebar.classList.remove('active');

        if (hash === '#login') {
            UIEngine.renderLoginView(this.contentContainer);
            this.bindLoginEvents();
        } else if (hash === '#register') {
            UIEngine.renderRegisterView(this.contentContainer);
            this.bindRegisterEvents();
        } else if (hash === '#feed') {
            const sidebarFeed = document.getElementById('nav-feed');
            const mobileFeed = document.getElementById('mob-nav-feed');
            if (sidebarFeed) sidebarFeed.classList.add('active');
            if (mobileFeed) mobileFeed.classList.add('active');
            this.loadFeed();
        } else if (hash.startsWith('#profile')) {
            const sidebarProfile = document.getElementById('nav-profile');
            const mobileProfile = document.getElementById('mob-nav-profile');
            if (sidebarProfile) sidebarProfile.classList.add('active');
            if (mobileProfile) mobileProfile.classList.add('active');
            const parts = hash.split('/');
            const username = parts[1] || (this.currentUser ? this.currentUser.username : '');
            if (username) {
                this.loadProfile(username);
            }
        } else if (hash === '#settings') {
            const sidebarSettings = document.getElementById('nav-settings');
            const mobileSettings = document.getElementById('mob-nav-settings');
            if (sidebarSettings) sidebarSettings.classList.add('active');
            if (mobileSettings) mobileSettings.classList.add('active');
            UIEngine.renderSettingsView(this.contentContainer, this.currentUser);
            this.bindSettingsEvents();
        }
    }

    // Auth actions
    bindLoginEvents() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await ApiService.login(username, password);
                if (response.success) {
                    ApiService.setToken(response.data.token);
                    this.currentUser = response.data.user;
                    this.setupAuthenticatedUI();
                    UIEngine.showToast('Successfully logged in!', 'success');
                    window.location.hash = '#feed';
                }
            } catch (error) {
                const msg = error.errors?.error || 'Invalid credentials. Please try again.';
                UIEngine.showToast(msg, 'error');
            }
        });
    }

    bindRegisterEvents() {
        const form = document.getElementById('register-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            try {
                const response = await ApiService.register(username, email, password);
                if (response.success) {
                    ApiService.setToken(response.data.token);
                    this.currentUser = response.data.user;
                    this.setupAuthenticatedUI();
                    UIEngine.showToast('Account created successfully!', 'success');
                    window.location.hash = '#feed';
                }
            } catch (error) {
                let errorMsg = 'Failed to register.';
                if (error.errors) {
                    const keys = Object.keys(error.errors);
                    errorMsg = error.errors[keys[0]][0];
                }
                UIEngine.showToast(errorMsg, 'error');
            }
        });
    }

    async handleLogout() {
        try {
            await ApiService.logout();
        } catch (e) {
            console.error("Logout request error:", e);
        }
        this.logoutUser();
        UIEngine.showToast('Logged out.', 'success');
    }

    // Feed actions
    async loadFeed() {
        UIEngine.showLoadingSkeleton('app-content');
        try {
            const response = await ApiService.getFeed();
            if (response.success) {
                UIEngine.renderFeedView(this.contentContainer, response.data, this.currentUser);
                this.bindPostCreatorEvents();
            }
        } catch (error) {
            UIEngine.showToast('Could not load feed.', 'error');
        }
    }

    bindPostCreatorEvents() {
        const form = document.getElementById('post-create-form');
        const fileInput = document.getElementById('post-image-input');
        const previewWrapper = document.getElementById('post-preview-wrapper');
        const previewImg = document.getElementById('post-image-preview');
        const btnCancelImg = document.getElementById('btn-cancel-image');

        if (!form) return;

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                this.selectedPostFile = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                    previewWrapper.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        btnCancelImg.addEventListener('click', () => {
            this.selectedPostFile = null;
            fileInput.value = '';
            previewWrapper.style.display = 'none';
            previewImg.src = '';
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const content = document.getElementById('post-content-input').value;
            
            const formData = new FormData();
            formData.append('content', content);
            if (this.selectedPostFile) {
                formData.append('image', this.selectedPostFile);
            }

            try {
                const response = await ApiService.createPost(formData);
                if (response.success) {
                    UIEngine.showToast('Post created!', 'success');
                    this.selectedPostFile = null;
                    this.loadFeed();
                }
            } catch (error) {
                UIEngine.showToast('Failed to create post.', 'error');
            }
        });
    }

    async handleDeletePost(postId) {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const response = await ApiService.deletePost(postId);
            if (response.success) {
                UIEngine.showToast('Post deleted.', 'success');
                const card = document.getElementById(`post-${postId}`);
                if (card) card.remove();
                
                // If on profile view, decrement posts count
                const profilePostsVal = document.getElementById('profile-posts-val');
                if (profilePostsVal) {
                    profilePostsVal.textContent = parseInt(profilePostsVal.textContent) - 1;
                }
            }
        } catch (error) {
            UIEngine.showToast('Failed to delete post.', 'error');
        }
    }

    async handleLikeToggle(postId) {
        const likeBtn = document.getElementById(`like-btn-${postId}`);
        const likeCountSpan = document.getElementById(`like-count-${postId}`);
        if (!likeBtn || !likeCountSpan) return;

        try {
            const response = await ApiService.toggleLike(postId);
            if (response.success) {
                const liked = response.data.liked;
                const heartIcon = likeBtn.querySelector('i');
                
                if (liked) {
                    likeBtn.classList.add('liked');
                    heartIcon.className = 'fa-solid fa-heart';
                    likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
                } else {
                    likeBtn.classList.remove('liked');
                    heartIcon.className = 'fa-regular fa-heart';
                    likeCountSpan.textContent = parseInt(likeCountSpan.textContent) - 1;
                }
            }
        } catch (error) {
            UIEngine.showToast('Please login to like posts.', 'error');
        }
    }

    // Comment actions
    async loadComments(postId) {
        const listContainer = document.getElementById(`comments-list-${postId}`);
        if (!listContainer) return;
        
        listContainer.innerHTML = `<p style="font-size:12px; color: var(--text-muted); padding:5px;">Loading comments...</p>`;

        try {
            const response = await ApiService.getComments(postId);
            if (response.success) {
                UIEngine.renderCommentsList(postId, response.data, this.currentUser);
            }
        } catch (error) {
            listContainer.innerHTML = `<p style="font-size:12px; color: hsl(0,85%,60%); padding:5px;">Failed to load comments.</p>`;
        }
    }

    async handleCommentSubmit(postId) {
        const input = document.getElementById(`comment-input-${postId}`);
        if (!input || !input.value.trim()) return;

        const text = input.value.trim();
        input.value = '';

        try {
            const response = await ApiService.addComment(postId, text);
            if (response.success) {
                this.loadComments(postId);
                
                const commentBtnSpan = document.querySelector(`#post-${postId} .post-action-btn:nth-child(2) span`);
                if (commentBtnSpan) {
                    commentBtnSpan.textContent = parseInt(commentBtnSpan.textContent) + 1;
                }
            }
        } catch (error) {
            UIEngine.showToast('Failed to add comment.', 'error');
        }
    }

    async handleDeleteComment(postId, commentId) {
        try {
            const response = await ApiService.deleteComment(commentId);
            if (response.success) {
                UIEngine.showToast('Comment deleted.', 'success');
                const commentEl = document.getElementById(`comment-${commentId}`);
                if (commentEl) commentEl.remove();

                const commentBtnSpan = document.querySelector(`#post-${postId} .post-action-btn:nth-child(2) span`);
                if (commentBtnSpan) {
                    commentBtnSpan.textContent = parseInt(commentBtnSpan.textContent) - 1;
                }
            }
        } catch (error) {
            UIEngine.showToast('Failed to delete comment.', 'error');
        }
    }

    // Profile actions
    async loadProfile(username) {
        UIEngine.showLoadingSkeleton('app-content');
        try {
            const userResp = await ApiService.getProfile(username);
            const postsResp = await ApiService.getUserPosts(username);
            
            if (userResp.success && postsResp.success) {
                UIEngine.renderProfileView(this.contentContainer, userResp.data, postsResp.data, this.currentUser);
            }
        } catch (error) {
            UIEngine.showToast('Could not load profile.', 'error');
        }
    }

    async handleFollowToggle(username, isFromSuggestion = false) {
        try {
            const response = await ApiService.toggleFollow(username);
            if (response.success) {
                const following = response.data.following;
                UIEngine.showToast(response.data.message, 'success');
                
                if (isFromSuggestion) {
                    this.loadSuggestedUsers();
                    if (this.currentView.startsWith('#profile')) {
                        const profileUsername = this.currentView.split('/')[1] || this.currentUser.username;
                        this.loadProfile(profileUsername);
                    }
                } else {
                    const followVal = document.getElementById('profile-followers-val');
                    if (followVal) {
                        followVal.textContent = parseInt(followVal.textContent) + (following ? 1 : -1);
                    }
                    this.loadProfile(username);
                    this.loadSuggestedUsers();
                }
            }
        } catch (error) {
            UIEngine.showToast('Failed to execute follow toggle.', 'error');
        }
    }

    async showFollowersModal(username) {
        try {
            const response = await ApiService.getFollowers(username);
            if (response.success) {
                UIEngine.renderFollowModal('Followers', response.data);
            }
        } catch (error) {
            UIEngine.showToast('Could not load followers.', 'error');
        }
    }

    async showFollowingModal(username) {
        try {
            const response = await ApiService.getFollowing(username);
            if (response.success) {
                UIEngine.renderFollowModal('Following', response.data);
            }
        } catch (error) {
            UIEngine.showToast('Could not load following.', 'error');
        }
    }

    // Settings actions
    bindSettingsEvents() {
        const form = document.getElementById('settings-form');
        const fileInput = document.getElementById('settings-avatar-input');
        const previewImg = document.getElementById('avatar-preview-element');

        if (!form) return;

        fileInput.addEventListener('change', () => {
            const file = fileInput.files[0];
            if (file) {
                this.selectedSettingsAvatar = file;
                const reader = new FileReader();
                reader.onload = (e) => {
                    previewImg.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const bio = document.getElementById('settings-bio').value;
            
            const formData = new FormData();
            formData.append('bio', bio);
            if (this.selectedSettingsAvatar) {
                formData.append('profile_picture', this.selectedSettingsAvatar);
            }

            try {
                const response = await ApiService.updateProfile(formData);
                if (response.success) {
                    this.currentUser = response.data;
                    this.selectedSettingsAvatar = null;
                    this.setupAuthenticatedUI();
                    UIEngine.showToast('Profile updated!', 'success');
                    window.location.hash = '#profile';
                }
            } catch (error) {
                UIEngine.showToast('Failed to update profile settings.', 'error');
            }
        });
    }
}

// Initial coordinator startup
document.addEventListener('DOMContentLoaded', () => {
    window.appCoordinator = new AppCoordinator();
    window.appCoordinator.init();
});
