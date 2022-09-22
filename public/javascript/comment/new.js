
$('.add-comment-btn').click(function(event){
    event.preventDefault();

    $(this)
        .removeClass('add-comment-btn')
        .addClass('save-comment-btn')
        .attr('type', 'submit')
        .html('<i class="fa-solid fa-cloud-arrow-up"></i>&nbsp;&nbsp;Post comment');
    
    $('#new-comment-text')
        .css('display', 'block')
        .focus();


    $('.save-comment-btn').click(async function(event){
        event.preventDefault();
        
        const content = $('#new-comment-text').val().trim();
        const fillin_id = $('form.template').attr('fillin-id');
    
        const response = await fetch('/api/comment', {
            method: 'post',
            body: JSON.stringify({content, fillin_id}),
            headers: {'Content-Type': 'application/json'}
        });
    
        if (response.ok)
            location.reload();
        else
            alert(response.statusText);
    })
})