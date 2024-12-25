// blog.js
$(document).ready(function() {
    const blogId = document.querySelector('[data-blog-id]').dataset.blogId;
    let isLiked = false;
    let likeCount = 0;
  
    // Like functionality
    $("#like-btn").click(function() {
      isLiked = !isLiked;
      $(this).toggleClass('liked');
      likeCount = isLiked ? likeCount + 1 : likeCount - 1;
      $("#like-count").text(`${likeCount} likes`);
  
      $.ajax({
        url: `/api/blog/${blogId}/like`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .catch(error => console.error('Error updating like:', error));
    });
  
    // Comment submission
    $("#comment-form").submit(function(e) {
      e.preventDefault();
      const content = $("#comment-content").val().trim();
      
      if (!content) return;
  
      $.ajax({
        url: `/api/blog/${blogId}/comment`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ content })
      })
      .then(response => {
        addCommentToList({
          author: response.author,
          content: content,
          date: new Date().toLocaleString(),
          _id: response.commentId
        });
        $("#comment-content").val('');
      })
      .catch(error => {
        console.error('Error posting comment:', error);
        alert('Error posting comment. Please try again.');
      });
    });
  
    // Add comment to DOM
    function addCommentToList(comment) {
      const commentHTML = `
        <div class="comment" data-comment-id="${comment._id}">
          <div class="comment-header">
            <span class="comment-author">${comment.author}</span>
            <span class="comment-date">${comment.date}</span>
          </div>
          <div class="comment-content">
            ${comment.content}
          </div>
          <div class="comment-actions">
            <button onclick="replyToComment('${comment._id}')">
              <i class="fa fa-reply"></i> Reply
            </button>
            <button onclick="likeComment('${comment._id}')">
              <i class="fa fa-thumbs-up"></i> Like
            </button>
          </div>
        </div>
      `;
      $("#comments-container").prepend(commentHTML);
    }
  
    // Load existing comments
    function loadComments() {
      $.ajax({
        url: `/api/blog/${blogId}/comments`,
        method: 'GET'
      })
      .then(comments => {
        comments.forEach(comment => addCommentToList(comment));
      })
      .catch(error => console.error('Error loading comments:', error));
    }
  
    // Initialize
    loadComments();
  });
  
  // Global functions for comment actions
  function replyToComment(commentId) {
    const comment = document.querySelector(`[data-comment-id="${commentId}"]`);
    const existingForm = comment.querySelector('.reply-form');
    
    if (existingForm) {
      existingForm.remove();
      return;
    }
  
    const replyForm = `
      <form class="reply-form mt-3">
        <div class="input-group">
          <textarea class="form-control" placeholder="Write your reply..." rows="2"></textarea>
          <button class="btn btn-primary" type="submit">Reply</button>
        </div>
      </form>
    `;
    
    comment.insertAdjacentHTML('beforeend', replyForm);
  }
  
  function likeComment(commentId) {
    const button = event.currentTarget;
    button.classList.toggle('text-primary');
    
    $.ajax({
      url: `/api/comment/${commentId}/like`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .catch(error => console.error('Error liking comment:', error));
  }
  $(document).ready(function () {
    console.log("Document ready!");

    $("#ai").on("click", function () {
      console.log("Button clicked!");
      const content = $(".content").text();
      console.log("Content:", content);

      // Use Fetch API to handle streaming response
      fetch("/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content }),
      })
        .then((response) => {
          const decoder = new TextDecoder();
          const reader = response.body.getReader();

          let result = "";

          // Continuously read content from the server as it streams in
          const processChunk = ({ value, done }) => {
            if (done) {
              console.log("Streaming completed.");
              return;
            }

            const chunk = decoder.decode(value, { stream: true });
            result += chunk;

            console.log("Received chunk:", chunk);

            // Clean up the HTML content
            const cleanedText = result
              .replace(/```html/g, "")
              .replace(/```/g, "")
              .trim();

            // Update the HTML element dynamically with the received text
            $("#ai-response").html(cleanedText);

            reader.read().then(processChunk);
          };

          reader.read().then(processChunk);
        })
        .catch((error) => {
          console.error("Error while streaming content:", error);
        });
    });
  });