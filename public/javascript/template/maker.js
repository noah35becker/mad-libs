
// GLOBAL VARIABLES
var redactionOrder;
const previewBody = $('.preview-window .template-body')



// FUNCTIONS

// Edit/preview toggle
$('.edit-preview-toggle').on('change', 'input', async function(){
    if ($(this).val() === 'edit'){
        $('.edit-window').css('display', 'block');
        $('.preview-window').css('display', 'none');
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
    previewBody.empty();
    
    var reqBody = {
        title: $('.edit-window input').val().trim(),
        content: $('.edit-window textArea').val().trim()
            .replaceAll(/(?:\r\n|\r|\n)/g, ' ')
    };
    if (redactionOrder){
        reqBody.redaction_order = redactionOrder
    }

    const preview = await fetch(`/api/template/preview?redactionLvl=${$('.slider').attr('redaction-lvl')}`, {
        method: 'post',
        body: JSON.stringify(reqBody),
        headers: {'Content-Type': 'application/json'}
    });
    if (!redactionOrder)
        redactionOrder = preview.redaction_order;

    for (const elem of preview.content){
        if (elem.isStatic){
            if (!elem.word.trim())
                previewBody.append('&nbsp;');
            else if (elem.staticIndex === null)
                previewBody.append(`<span>${elem.word}</span>`);
            else
                previewBody.append(`<span class="static">${elem.word}</span>`);
        } else if (elem.isRedacted)
            previewBody.append(`<span class="redacted">${elem.redactedString.replace(/./g, '_')}</span>`);
        else
            previewBody.append(`<span class="mutable" mutable-index="${elem.mutableIndex}"><input type="text" placeholder="${elem.label}" /></span>`);
    }
}


// Redaction slider change
$('.slider').change(updatePreview);


// New template submission
$('.template-maker').submit(function(event){
    event.preventDefault();
    // FILL THIS IN FULLY LATER
});