
// FUNCTION
async function deleteFillinBtnHandler(fillinId){
    const response = await fetch(`/api/fillin/${fillinId}`, {
        method: 'delete'
    });

    if (response.ok)
        location.reload();
    else
        alert(response.statusText);
}


// EVENT LISTENER
$('.fillin-meta-long').on('click', '.delete-btn', function(){
    deleteFillinBtnHandler(+$(this).closest('.fillin-meta-long').attr('fillin-id'));
});