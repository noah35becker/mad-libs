
// FUNCTION
async function deleteAccountFormHandler(event){
    event.preventDefault();

    const password = $('#password').val();

    if (password){
        const response = await fetch('/api/user/', {
            method: 'delete',
            body: JSON.stringify({
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok)
            location.replace('/');
        else if (response.status === 400){
            const responseJson = await response.json();
            $('.error-msg').text(responseJson.message);
        }else
            alert(response.statusText);
    }
}


// EVENT LISTENER
$('#delete-account-form').on('submit', deleteAccountFormHandler);