
// GLOBAL VARIABLES
var redactionOrder;
const previewBody = $('.preview-window .template-body');
const previewTitle = $('.preview-window .title');



// FUNCTIONS

// Edit/preview toggle
$('.edit-preview-toggle').on('change', 'input', async function(){
    if ($(this).val() === 'edit'){
        $('.edit-window').css('display', 'block');
        $('.preview-window').css('display', 'none');
        $('.submit-error-msg').css('display', 'block');
    } else {
        $('.slider')
            .val(0)
            .attr('value', 0)
            .attr('redaction-lvl', $('.slider').attr('max'));

        await updatePreview();

        $('.edit-window').css('display', 'none');
        $('.preview-window').css('display', 'block');
    }
});


// Update preview
async function updatePreview(){
    var reqBody = {
        title: $('.edit-window input').val().trim(),
        content: $('.edit-window textArea').val().trim()
            .replaceAll(/(?:\r\n|\r|\n)/g, ' ')
    };
    if (redactionOrder){
        reqBody.redaction_order = redactionOrder
    }

    const response = await fetch(`../api/template/preview?redactionLvl=${$('.slider').attr('redaction-lvl')}`, {
        method: 'post',
        body: JSON.stringify(reqBody),
        headers: {'Content-Type': 'application/json'}
    });

    const preview = await response.json();

    previewBody.empty();
    previewTitle.text('');
    $('.submit-error-msg').css('display', 'none');

    if (response.ok){
        $('.submit-error-msg').text('');

        if (!redactionOrder)
            redactionOrder = preview.redaction_order;

        previewTitle.text(preview.title);

        for (const elem of preview.content){
            if (elem.isStatic){
                if (!elem.word.trim())
                    previewBody.append('&nbsp; ');
                else if (elem.staticIndex === null)
                    previewBody.append(`<span>${elem.word}</span>`);
                else
                    previewBody.append(`<span class="static">${elem.word}</span>`);
            } else if (elem.isRedacted)
                previewBody.append(`<span class="redacted">${elem.redactedString.replace(/./g, '_')}</span>`);
            else
                previewBody.append(`<span class="mutable" mutable-index="${elem.mutableIndex}"><input type="text" placeholder="${elem.label}" /></span>`);
        }
    } else {
        previewBody.append(`<p class="error-msg">${preview.message}</p>`);
        $('.submit-error-msg').text(preview.message);
    }
    
}


// Redaction slider change
$('.slider').change(updatePreview);


// New template submission
$('.template-maker').submit(async function(event){
    event.preventDefault();
    
    const title = $('.edit-window input').val().trim();
    const content = $('.edit-window textArea').val().trim()
        .replaceAll(/(?:\r\n|\r|\n)/g, ' ');

    const response = await fetch('../api/template/', {
        method: 'post',
        body: JSON.stringify({title, content}),
        headers: {'Content-Type': 'application/json'}
    });

    if (response.ok){
        $('.submit-error-msg').text(''); // DELETE LATER
        alert('submitted!'); // UPDATE LATER with a redirect to the new template page
    }
    else{
        const responseJson = await response.json();
        $('.submit-error-msg').text(responseJson.message === 'Validation error' ? 'This title is already taken' : responseJson.message);
    }
});