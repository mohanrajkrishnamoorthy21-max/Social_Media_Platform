class UIEngine {
    static getAvatarUrl(user) {
        if (user && user.profile_picture) {
            if (user.profile_picture.startsWith('http')) {
                return user.profile_picture;
            }
            return `http://localhost:8000${user.profile_picture}`;
        }
        return `https://api.dicebear.com/7.x/identicon/svg?seed=${user ? user.username : 'aura'}`;
    }

    static getPostImageUrl(imagePath) {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `http://localhost:8000${imagePath}`;
    }

    static formatTime(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHrs = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffSec < 60) return 'Just now';
        if (diffMin < 60) return `${diffMin}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    }

    static showToast(message, type = 'success') {
        const container = document.getElementById('toast-notifications');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = '<i class="fa-solid fa-circle-check"></i>';
        if (type === 'error') {
            icon = '<i class="fa-solid fa-circle-xmark"></i>';
        }

        toast.innerHTML = `
            ${icon}
            <span class="toast-message">${message}</span>
        `;

        container.appendChild(toast);

        // Remove toast after 4s
        setTimeout(() => {
            toast.style.animation = 'fadeIn 0.3s ease-out reverse';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    static showLoadingSkeleton(containerId, count = 3) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let skeletonsHtml = '';
        for (let i = 0; i < count; i++) {
            skeletonsHtml += `
                <div class="view-card post-card" style="opacity: 0.7;">
                    <div class="post-header">
                        <div class="post-user-info">
                            <div class="skeleton-avatar skeleton-shimmer"></div>
                            <div class="post-user-details">
                                <div class="skeleton-text skeleton-title skeleton-shimmer"></div>
                                <div class="skeleton-text skeleton-meta skeleton-shimmer" style="width: 40px;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="post-content">
                        <div class="skeleton-text skeleton-shimmer" style="width: 90%;"></div>
                        <div class="skeleton-text skeleton-shimmer" style="width: 80%;"></div>
                        <div class="skeleton-text skeleton-shimmer" style="width: 60%;"></div>
                    </div>
                    <div class="skeleton-image skeleton-shimmer" style="height: 200px; border-radius:16px;"></div>
                </div>
            `;
        }
        container.innerHTML = skeletonsHtml;
    }

    // Dynamic View Builders
    static renderLoginView(container) {
        container.innerHTML = `
            <div class="auth-container">
                <div class="view-card auth-card">
                    <div class="auth-header">
                        <div class="auth-logo"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                        <h2 class="auth-title">Welcome back</h2>
                        <p class="auth-subtitle">Step into your digital aura</p>
                    </div>
                    
                    <form id="login-form">
                        <div class="form-group">
                            <label class="form-label" for="login-username">Username</label>
                            <div class="input-wrapper">
                                <i class="fa-solid fa-user"></i>
                                <input type="text" id="login-username" class="form-control" placeholder="Enter your username" required autocomplete="username">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="login-password">Password</label>
                            <div class="input-wrapper">
                                <i class="fa-solid fa-lock"></i>
                                <input type="password" id="login-password" class="form-control" placeholder="Enter your password" required autocomplete="current-password">
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                            <span>Log In</span>
                            <i class="fa-solid fa-arrow-right"></i>
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        Don't have an account? <a href="#register" class="auth-link">Sign up</a>
                    </div>
                </div>
            </div>
        `;
    }

    static renderRegisterView(container) {
        container.innerHTML = `
            <div class="auth-container">
                <div class="view-card auth-card">
                    <div class="auth-header">
                        <div class="auth-logo"><i class="fa-solid fa-wand-magic-sparkles"></i></div>
                        <h2 class="auth-title">Create account</h2>
                        <p class="auth-subtitle">Begin your premium journey</p>
                    </div>
                    
                    <form id="register-form">
                        <div class="form-group">
                            <label class="form-label" for="register-username">Username</label>
                            <div class="input-wrapper">
                                <i class="fa-solid fa-user"></i>
                                <input type="text" id="register-username" class="form-control" placeholder="Choose a username" required autocomplete="username">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="register-email">Email Address</label>
                            <div class="input-wrapper">
                                <i class="fa-solid fa-envelope"></i>
                                <input type="email" id="register-email" class="form-control" placeholder="you@example.com" required autocomplete="email">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="register-password">Password</label>
                            <div class="input-wrapper">
                                <i class="fa-solid fa-lock"></i>
                                <input type="password" id="register-password" class="form-control" placeholder="Create a strong password" required autocomplete="new-password">
                            </div>
                        </div>
                        
                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
                            <span>Create Account</span>
                            <i class="fa-solid fa-user-plus"></i>
                        </button>
                    </form>
                    
                    <div class="auth-footer">
                        Already have an account? <a href="#login" class="auth-link">Log in</a>
                    </div>
                </div>
            </div>
        `;
    }

    static renderFeedView(container, posts = [], currentUser = null) {
        let feedHtml = '';
        
        // Post Creator Box (only if logged in)
        if (currentUser) {
            feedHtml += `
                <div class="view-card">
                    <form id="post-create-form" class="post-creator">
                        <div class="post-creator-header">
                            <img src="${this.getAvatarUrl(currentUser)}" alt="My Avatar" class="creator-avatar">
                            <textarea id="post-content-input" class="post-input" placeholder="What's happening in your aura?" required></textarea>
                        </div>
                        
                        <div id="post-preview-wrapper" class="post-image-preview-container">
                            <img id="post-image-preview" src="" alt="Selected Image" class="post-image-preview">
                            <button type="button" class="btn-remove-preview" id="btn-cancel-image"><i class="fa-solid fa-xmark"></i></button>
                        </div>

                        <div class="post-creator-footer">
                            <div class="file-input-wrapper">
                                <div class="btn-upload-trigger"><i class="fa-regular fa-image"></i></div>
                                <input type="file" id="post-image-input" accept="image/*">
                            </div>
                            <button type="submit" class="btn btn-primary">
                                <span>Post</span>
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </form>
                </div>
            `;
        }

        // Posts Feed Container
        feedHtml += `<div id="posts-feed-list">`;
        if (posts.length === 0) {
            feedHtml += `
                <div class="view-card" style="text-align: center; padding: 50px 20px;">
                    <i class="fa-regular fa-folder-open" style="font-size: 40px; color: var(--text-muted); margin-bottom: 16px;"></i>
                    <p style="color: var(--text-muted); font-size: 16px;">No posts to display. Be the first to post!</p>
                </div>
            `;
        } else {
            posts.forEach(post => {
                feedHtml += this.buildPostCardHtml(post, currentUser);
            });
        }
        feedHtml += `</div>`;

        container.innerHTML = feedHtml;
    }

    static buildPostCardHtml(post, currentUser) {
        const isOwner = currentUser && post.user.id === currentUser.id;
        const heartClass = post.is_liked ? 'liked' : '';
        const heartIcon = post.is_liked ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
        
        let imageHtml = '';
        if (post.image) {
            imageHtml = `
                <div class="post-image-container" style="margin-top: 10px;">
                    <img src="${this.getPostImageUrl(post.image)}" alt="Post Image" class="post-image">
                </div>
            `;
        }

        let dropdownMenuHtml = '';
        if (isOwner) {
            dropdownMenuHtml = `
                <div class="post-actions-menu">
                    <button class="btn-menu-trigger" onclick="UIEngine.togglePostDropdown(event, ${post.id})">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div class="post-menu-dropdown" id="dropdown-${post.id}">
                        <button class="btn-delete-post" onclick="window.appCoordinator.handleDeletePost(${post.id})">
                            <i class="fa-regular fa-trash-can"></i>
                            <span>Delete</span>
                        </button>
                    </div>
                </div>
            `;
        }

        return `
            <div class="view-card post-card" id="post-${post.id}">
                <div class="post-header">
                    <a href="#profile/${post.user.username}" class="post-user-info">
                        <img src="${this.getAvatarUrl(post.user)}" alt="${post.user.username}" class="post-avatar">
                        <div class="post-user-details">
                            <span class="post-author-name">${post.user.username}</span>
                            <span class="post-time">${this.formatTime(post.created_at)}</span>
                        </div>
                    </a>
                    ${dropdownMenuHtml}
                </div>
                
                <div class="post-content">${this.escapeHTML(post.content)}</div>
                
                ${imageHtml}
                
                <div class="post-footer">
                    <button class="post-action-btn ${heartClass}" id="like-btn-${post.id}" onclick="window.appCoordinator.handleLikeToggle(${post.id})">
                        <i class="${heartIcon}"></i>
                        <span id="like-count-${post.id}">${post.likes_count}</span>
                    </button>
                    <button class="post-action-btn" onclick="UIEngine.toggleCommentsSection(${post.id})">
                        <i class="fa-regular fa-comment"></i>
                        <span>${post.comments_count}</span>
                    </button>
                </div>

                <!-- Comments section (collapsed by default) -->
                <div class="comments-section" id="comments-sec-${post.id}" style="display: none;">
                    <div class="comment-input-container">
                        <img src="${currentUser ? this.getAvatarUrl(currentUser) : 'https://api.dicebear.com/7.x/identicon/svg?seed=aura'}" alt="Me" class="comment-avatar">
                        <div class="comment-input-wrapper">
                            <input type="text" placeholder="Write a comment..." class="comment-input" id="comment-input-${post.id}" 
                                onkeypress="if(event.key === 'Enter') window.appCoordinator.handleCommentSubmit(${post.id})">
                            <button class="btn-send-comment" onclick="window.appCoordinator.handleCommentSubmit(${post.id})">
                                <i class="fa-solid fa-arrow-up"></i>
                            </button>
                        </div>
                    </div>
                    <div class="comments-list" id="comments-list-${post.id}">
                        <!-- Comments dynamically loaded here -->
                    </div>
                </div>
            </div>
        `;
    }

    static togglePostDropdown(event, postId) {
        event.stopPropagation();
        
        // Hide all other dropdowns
        document.querySelectorAll('.post-menu-dropdown').forEach(dropdown => {
            if (dropdown.id !== `dropdown-${postId}`) {
                dropdown.style.display = 'none';
            }
        });

        const dropdown = document.getElementById(`dropdown-${postId}`);
        if (dropdown) {
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
        }

        // Close dropdown when clicking anywhere else
        const closeDropdownHandler = () => {
            if (dropdown) dropdown.style.display = 'none';
            document.removeEventListener('click', closeDropdownHandler);
        };
        setTimeout(() => {
            document.addEventListener('click', closeDropdownHandler);
        }, 10);
    }

    static toggleCommentsSection(postId) {
        const sec = document.getElementById(`comments-sec-${postId}`);
        if (!sec) return;
        
        const isCollapsed = sec.style.display === 'none';
        if (isCollapsed) {
            sec.style.display = 'flex';
            // Fetch comments
            window.appCoordinator.loadComments(postId);
        } else {
            sec.style.display = 'none';
        }
    }

    static renderCommentsList(postId, comments, currentUser) {
        const listContainer = document.getElementById(`comments-list-${postId}`);
        if (!listContainer) return;

        if (comments.length === 0) {
            listContainer.innerHTML = `<p style="font-size: 13px; color: var(--text-muted); padding: 5px;">No comments yet.</p>`;
            return;
        }

        let commentsHtml = '';
        comments.forEach(comment => {
            const isCommentOwner = currentUser && comment.user.id === currentUser.id;
            let deleteBtnHtml = '';
            if (isCommentOwner) {
                deleteBtnHtml = `
                    <button class="btn-delete-comment" onclick="window.appCoordinator.handleDeleteComment(${postId}, ${comment.id})">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                `;
            }

            commentsHtml += `
                <div class="comment-item" id="comment-${comment.id}">
                    <img src="${this.getAvatarUrl(comment.user)}" alt="${comment.user.username}" class="comment-avatar">
                    <div class="comment-content">
                        <div>
                            <a href="#profile/${comment.user.username}" class="comment-author-name">${comment.user.username}</a>
                            <span class="comment-text">${this.escapeHTML(comment.text)}</span>
                        </div>
                        <div class="comment-time">${this.formatTime(comment.created_at)}</div>
                    </div>
                    ${deleteBtnHtml}
                </div>
            `;
        });

        listContainer.innerHTML = commentsHtml;
    }

    static renderProfileView(container, user, posts = [], currentUser = null) {
        const isSelf = currentUser && user.username === currentUser.username;
        const followText = user.is_following ? 'Unfollow' : 'Follow';
        const followBtnClass = user.is_following ? 'btn-secondary' : 'btn-primary';
        
        let actionBtnHtml = '';
        if (isSelf) {
            actionBtnHtml = `
                <a href="#settings" class="btn btn-secondary">
                    <i class="fa-solid fa-user-pen"></i>
                    <span>Edit Profile</span>
                </a>
            `;
        } else if (currentUser) {
            actionBtnHtml = `
                <button class="btn ${followBtnClass}" onclick="window.appCoordinator.handleFollowToggle('${user.username}')">
                    <i class="fa-solid ${user.is_following ? 'fa-user-minus' : 'fa-user-plus'}"></i>
                    <span>${followText}</span>
                </button>
            `;
        }

        let profileHtml = `
            <div class="view-card" style="padding: 0; overflow: hidden;">
                <div class="profile-banner">
                    <div class="profile-avatar-wrapper">
                        <img src="${this.getAvatarUrl(user)}" alt="Avatar" class="profile-avatar">
                    </div>
                </div>
                
                <div style="padding: 24px 30px;">
                    <div class="profile-meta-actions">
                        ${actionBtnHtml}
                    </div>
                    
                    <div class="profile-info">
                        <h2 class="profile-fullname">${user.username}</h2>
                        <p class="profile-handle">@${user.username}</p>
                        <p class="profile-bio">${user.bio ? this.escapeHTML(user.bio) : 'No bio available.'}</p>
                    </div>
                    
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-value" id="profile-posts-val">${user.posts_count}</span>
                            <span class="stat-label">Posts</span>
                        </div>
                        <div class="stat-item" style="cursor: pointer;" onclick="window.appCoordinator.showFollowersModal('${user.username}')">
                            <span class="stat-value" id="profile-followers-val">${user.followers_count}</span>
                            <span class="stat-label">Followers</span>
                        </div>
                        <div class="stat-item" style="cursor: pointer;" onclick="window.appCoordinator.showFollowingModal('${user.username}')">
                            <span class="stat-value" id="profile-following-val">${user.following_count}</span>
                            <span class="stat-label">Following</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <h3 class="profile-posts-title">${isSelf ? 'My Posts' : `${user.username}'s Posts`}</h3>
            <div id="profile-posts-list">
        `;

        if (posts.length === 0) {
            profileHtml += `
                <div class="view-card" style="text-align: center; padding: 40px 20px;">
                    <i class="fa-regular fa-images" style="font-size: 32px; color: var(--text-muted); margin-bottom: 12px;"></i>
                    <p style="color: var(--text-muted);">No posts yet.</p>
                </div>
            `;
        } else {
            posts.forEach(post => {
                profileHtml += this.buildPostCardHtml(post, currentUser);
            });
        }
        
        profileHtml += `</div>`;

        container.innerHTML = profileHtml;
    }

    static renderSettingsView(container, user) {
        container.innerHTML = `
            <div class="view-card">
                <h2 class="widget-title" style="margin-bottom: 30px; font-size: 24px;">Account Settings</h2>
                
                <form id="settings-form">
                    <div class="avatar-upload-container">
                        <img src="${this.getAvatarUrl(user)}" alt="Avatar Preview" class="avatar-preview-lg" id="avatar-preview-element">
                        <div class="file-input-wrapper">
                            <button type="button" class="btn btn-secondary">Change Avatar</button>
                            <input type="file" id="settings-avatar-input" accept="image/*">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="settings-bio">Biography</label>
                        <textarea id="settings-bio" class="form-control form-textarea" placeholder="Tell the world about yourself...">${user.bio || ''}</textarea>
                    </div>

                    <div style="display: flex; gap: 12px; margin-top: 30px;">
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                        <a href="#profile" class="btn btn-secondary">Cancel</a>
                    </div>
                </form>
            </div>
        `;
    }

    // Modal helpers
    static renderFollowModal(title, userList) {
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'follow-modal';
        modalOverlay.style = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center;
            z-index: 10000; backdrop-filter: blur(8px);
        `;

        let listHtml = '';
        if (userList.length === 0) {
            listHtml = `<p style="color: var(--text-muted); text-align: center; padding: 20px;">No users found.</p>`;
        } else {
            userList.forEach(user => {
                listHtml += `
                    <div class="suggestion-item" style="padding: 10px 0; border-bottom: 1px solid var(--glass-border);">
                        <a href="#profile/${user.username}" class="suggestion-user-info" onclick="document.getElementById('follow-modal').remove()">
                            <img src="${this.getAvatarUrl(user)}" alt="avatar" class="suggestion-avatar">
                            <div class="suggestion-details">
                                <span class="suggestion-name">${user.username}</span>
                                <span class="suggestion-handle">@${user.username}</span>
                            </div>
                        </a>
                    </div>
                `;
            });
        }

        modalOverlay.innerHTML = `
            <div class="view-card" style="width: 100%; max-width: 400px; margin: 0 20px; animation: slideUp 0.3s ease-out; position: relative;">
                <button style="position: absolute; top: 20px; right: 20px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 20px;" 
                    onclick="document.getElementById('follow-modal').remove()">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <h3 class="widget-title" style="margin-bottom: 20px;">${title}</h3>
                <div style="max-height: 300px; overflow-y: auto; padding-right: 5px;">
                    ${listHtml}
                </div>
            </div>
        `;

        document.body.appendChild(modalOverlay);
        
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.remove();
            }
        });
    }

    // HTML escape utility
    static escapeHTML(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
