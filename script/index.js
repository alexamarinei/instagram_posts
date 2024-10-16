const posts = [
    {
        name: "Edvard Munch",
        username: "munchies2435",
        location: "Hedmark, Norvegia",
        avatar: "images/avatar-munch.jpg",
        post: "images/post-munch.jpg",
        description: "Nothing to panic about",
        likes: 42,
        comments: []
    },
    {
        name: "Leonardo da Vinci",
        username: "daVinci2234",
        location: "Vinci, Republic of Florence",
        avatar: "images/avatar-davinci.jpg",
        post: "images/post-daVinci.jpg",
        description: "Anyone knows her ?!",
        likes: 102,
        comments: []
    },
    {
        name: "Rembrandt Harmenszoon van Rijn",
        username: "rembrandt1143",
        location: "Paris, France",
        avatar: "images/avatar-rembrandt.jpg",
        post: "images/post-rembrandt.jpg",
        description: "Lovely weather today! ",
        likes: 254,
        comments: []
    }
]

const postsContainer = document.getElementById("posts-container");

const storeComments = (username, comments) => {
    localStorage.setItem(`${username}-comments`, JSON.stringify(comments));
}

const getStoredComments = (username) => {
    const storedComments = localStorage.getItem(`${username}-comments`);
    return storedComments ? JSON.parse(storedComments) : [];
}

const isPostLiked = (username) => {
    return localStorage.getItem(`${username}-liked`) === "true";
}

const getLikes = (username, defaultLikes) => {
    const storedLikes = localStorage.getItem(`${username}-likes`);
    return storedLikes ? parseInt(storedLikes) : defaultLikes;
}

const toggleLikeStatus = (username) => {
    const isLiked = isPostLiked(username);
    let likes = getLikes(username, posts.find(p => p.username === username).likes);

    if (isLiked) {
        likes--;
        localStorage.setItem(`${username}-liked`, "false");
    } else {
        likes++;
        localStorage.setItem(`${username}-liked`, "true");
    }

    localStorage.setItem(`${username}-likes`, likes);
    return likes;
}

posts.forEach(post => {
    const comments = getStoredComments(post.username);

    const postHTML = `
        <section class="post-section">
            <div class="user-post flex-center gap-5">
                <img class="avatar" src="${post.avatar}" alt="${post.name} avatar">
                <div class="user-details">
                    <span class="bold-text">${post.name}</span>
                    <span>${post.location}</span>
                </div>
            </div>
            <img class="photo-post" src="${post.post}" alt="${post.name} post">
            <div class="under_photo">
                <div class="icon-images flex-center gap-5">
                    <button class="btn-style like-button" data-username="${post.username}">
                        <img class="icon-size icon-heart" src="images/icon-heart.svg" alt="like icon">
                    </button>
                    <button class="btn-style comment-button">
                        <img class="icon-size" src="images/icon-comment.svg"  alt="comment icon">
                    </button>
                    <button class="btn-style dm-button">
                        <img class="icon-size" src="images/icon-dm.svg" alt="dm icon">
                    </button>
                </div>
                <div class="text_photo">
                    <p class="bold-text like-count">${getLikes(post.username, post.likes)} Likes</p>
                    <p><span class="bold-text">${post.username}</span> ${post.description}</p>
                      <p class="message">
                        ${comments.map(comment => `<p><span class="bold-text">You: </span> ${comment}</p>`).join('')}
                    </p>    
                    <div class="comment-container">
                        <input class="comment-field" type="text" placeholder="write a comment...">
                        <button class="btn-style  dm-button">
                        <img class="icon-size-comment" src="images/icon-dm.svg" alt="dm icon">
                        </button>
                    </div>
                  
                </div>
            </div>
        </section>
    `
    postsContainer.innerHTML += postHTML;
})

document.querySelectorAll('.like-button').forEach(button => {
    const username = button.getAttribute('data-username');
    const likeCountElement = button.closest('.post-section').querySelector('.like-count');
    const heartIcon = button.querySelector('.icon-heart');

    if (isPostLiked(username)) {
        heartIcon.src = 'images/icon-heart-filled.svg';
    }

    button.addEventListener('click', function () {
        const newLikes = toggleLikeStatus(username);
        likeCountElement.textContent = `${newLikes} Likes`;
        heartIcon.src = isPostLiked(username) ? 'images/icon-heart-filled.svg' : 'images/icon-heart.svg';
    });
})

document.querySelectorAll('.comment-button').forEach(button => {
    button.addEventListener('click', function () {
        const postSection = this.closest('.post-section');
        const commentField = postSection.querySelector('.comment-field');
        commentField.focus();
    });
})

document.querySelectorAll('.dm-button').forEach(button => {
    button.addEventListener('click', function () {
        const postSection = this.closest('.post-section');
        const commentField = postSection.querySelector('.comment-field');
        const messageElement = postSection.querySelector(".message");
        const commentText = commentField.value.trim();
        const username = postSection.querySelector('.like-button').getAttribute('data-username');

        if (commentText) {
            const comments = getStoredComments(username);
            comments.push(commentText);
            storeComments(username, comments);

            messageElement.innerHTML += `<p><span class="bold-text">You : </span> ${commentText}</p>`;

            commentField.value = '';
        } else {
            alert('Please write a comment before sending!');
        }
    });
})
