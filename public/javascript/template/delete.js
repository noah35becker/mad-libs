
// FUNCTION
async function deleteTemplateBtnHandler(templateId){
    const response = await fetch(`/api/template/${templateId}`, {
        method: 'delete'
    });

    if (response.ok)
        location.reload();
    else
        alert(response.statusText);
}


// EVENT LISTENER
$('.template-meta').on('click', '.delete-btn', function(){
    deleteTemplateBtnHandler(+$(this).closest('.template-meta').attr('template-id'));
});