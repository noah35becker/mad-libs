
// GLOBAL VARIABLES
const templateBody = $('.template-body');
const templateTitle = $('.template-title:not(.template-title-static)'); //maker only
const submitErrMsg = $('.maker-submit-error-msg'); // maker only
var redactionOrder;



// Blur after focus
$('.slider').focus(function(){
    setTimeout(
        () => $(this).blur(),
        400
    )
});


// Update redaction when slider changes
$('.slider').on('input', function(){
    var newVal = $(this).val();
    const max = +$(this).attr('max');

    $(this).attr('value', newVal);
    $(this).attr('redaction-lvl', max - newVal);

    updatePreview();
});



// Update preview
async function updatePreview(){
    const currentInputs = [];
    $('.mutable input').each(function(){
        currentInputs.push($(this).val() || '');
    });

    let apiUrl = '/api/template/preview?';
    let reqBody;

    if ($('form.template').attr('template-id'))
        apiUrl += 'templateId=' + $('form.template').attr('template-id') + '&'; // when viewing a preexisting template
    else{
        reqBody = { // when using the template maker
            title: $('.edit-window input').val().trim(),
            content: $('.edit-window textArea').val().trim()
                .replaceAll(/(?:\r\n|\r|\n)/g, ' ')
        };

        if (redactionOrder)
            reqBody.redaction_order = redactionOrder;
    }

    apiUrl += 'redactionLvl=' + $('.slider').attr('redaction-lvl');
    const response = await fetch(apiUrl, {
        method: 'post',
        body: reqBody ? JSON.stringify(reqBody) : '',
        headers: {'Content-Type': 'application/json'}
    });

    const preview = await response.json();

    templateBody.empty();
    templateTitle.text(''); // maker only
    submitErrMsg.css('display', 'none'); // maker only

    if (response.ok){
        submitErrMsg.text('');
        $('.redaction-slider').css('display', 'flex'); // maker only

        if (!redactionOrder)
            redactionOrder = preview.redaction_order; // maker only

        templateTitle.text(preview.title); // maker only

        for (const elem of preview.content){
            if (elem.isStatic){
                if (!elem.word.trim())
                    templateBody.append('&nbsp; ');
                else if (elem.staticIndex === null)
                    templateBody.append(`&hairsp;${elem.word}&hairsp;`);
                else
                    templateBody.append(`<span class="static">${elem.word}</span>`);
            } else if (elem.isRedacted)
                templateBody.append(`<span class="redacted">${elem.redactedString.replace(/./g, '_')}</span>`);
            else{
                templateBody.append(`<span class="mutable" mutable-index="${elem.mutableIndex}"><input type="text" placeholder="${elem.label}" /></span>`);
                if (currentInputs[elem.mutableIndex])
                    $(`.mutable[mutable-index="${elem.mutableIndex}"] input`).val(currentInputs[elem.mutableIndex]);
            }
        }
    } else { // maker only
        templateBody.append(`<p class="error-msg">${preview.message}</p>`);
        $('.maker-submit-error-msg').text(preview.message);
        $('.redaction-slider').css('display', 'none');
    }
}



// RUN ON PAGE LOAD
if ($('form.template').attr('template-id'))
    updatePreview();