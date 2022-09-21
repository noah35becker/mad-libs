
// FUNCTIONS

// Edit/preview toggle
$('.edit-preview-toggle').on('change', 'input', async function(){
    if ($(this).val() === 'edit'){
        $('.edit-window').css('display', 'block');
        $('.preview-window').css('display', 'none');
        $('.submit-error-msg').css('display', 'block');
        $('.template-maker-submit-btn').css('display', 'inline-block');
    } else {
        $('.slider')
            .val(0)
            .attr('value', 0)
            .attr('redaction-lvl', $('.slider').attr('max'))
            .trigger('input');

        $('.template-maker-submit-btn').css('display', 'none');
        $('.edit-window').css('display', 'none');
        $('.preview-window').css('display', 'block');
    }
});


// New template submission
$('.template-maker').submit(async function(event){
    event.preventDefault();

    if ($('.preview-window').css('display') === 'none'){
        const title = $('.edit-window input').val().trim();
        const content = $('.edit-window textArea').val().trim()
            .replaceAll(/(?:\r\n|\r|\n)/g, ' ');

        const response = await fetch('/api/template/', {
            method: 'post',
            body: JSON.stringify({title, content}),
            headers: {'Content-Type': 'application/json'}
        });
        const responseJson = await response.json();

        if (response.ok)
            location.assign('/template/' + responseJson.template.id);
        else    
            $('.submit-error-msg').text(responseJson.message === 'Validation error' ? 'This title is already taken' : responseJson.message);
        
    }
});