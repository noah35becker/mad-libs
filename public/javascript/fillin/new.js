
$('form.template').submit(async function(event){
    event.preventDefault();

    const content = [];
    const template_id = +$(this).attr('template-id');
    let quit;

    $('.mutable input').each(function(){
        if ($(this).val().trim())
            content.push($(this).val().trim());
        else{
            $('.fillin-submit-error-msg').text('Fill in every field before submitting!');
            quit = true;
            return;
        }
    });

    if (!quit){
        const response = await fetch('/api/fillin', {
            method: 'post',
            body: JSON.stringify({content, template_id}),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok){
            const responseJson = await response.json();
            location.assign('/fillin/' + responseJson.fillin.id);
        }else
            alert(response.statusText);
    }
});