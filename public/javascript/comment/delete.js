
var fireCount = 0;

$('.delete-comment-btn').click(async function(){
    if (++fireCount === 1){ // prevent multiple events from firing
        const commentId = $(this).closest('.comment').attr('comment-id');

        const response = await fetch(`/api/comment/${commentId}`, {
            method: 'delete'
        });

        if (response.ok)
            location.reload();
        else
            alert(response.statusText);
    }
});