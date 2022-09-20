
// FUNCTION
async function updatePasswordFormHandler(event){
    event.preventDefault();

    const old_password = $('#old-password').val();
    const new_password = $('#new-password').val();

    if (old_password && new_password){
        const response = await fetch('/api/user/update-password', {
            method: 'put',
            body: JSON.stringify({
                old_password,
                new_password
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if (response.ok)
            location.replace('/dashboard');
        else if (response.status === 400){
            const responseJson = await response.json();
            $('.error-msg').text(responseJson.message);
        } else
            alert(response.statusText);
    }
}


// EVENT LISTENER
$('#update-password-form').on('submit', updatePasswordFormHandler);