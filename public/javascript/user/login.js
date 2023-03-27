
// Open login modal
$('.nav-login').click(() =>
    $('#login-modal').css('display', 'block')
);

// Auto-fire 'open login modal' if needed
if (+(new URL(location.href).searchParams.get('showLogin')))
    $('.nav-login').click();

// Close login modal
$('.close-modal').click(() => {
    $('#login-modal').css('display', 'none');
    
    $('.login-form').get(0).reset();
    $('.login-error-msg').text('');

    $('.signup-form').get(0).reset();
    $('.signup-error-msg').text('');
});



// Login
$('.login-form').submit(async event => {
    event.preventDefault();

    const email = $('input[name="login-email"]').val().trim();
    const password = $('input[name="login-password"]').val();

    if (email && password){
        const response = await fetch('/api/user/login',{
            method: 'post',
            body: JSON.stringify({
                email,
                password
            }),
            headers: {'Content-type': 'application/json'}
        });

        if (response.ok)
            location.assign('/dashboard');
        else if (response.status === 404 || response.status === 400){
            const responseJson = await response.json();
            $('.login-error-msg').text(responseJson.message);
        } else
            alert(response.statusText);
    }
});


// Sign up
$('.signup-form').submit(async event => {
    event.preventDefault();

    const username = $('input[name="signup-username"]').val().trim();
    const email = $('input[name="signup-email"]').val().trim();
    const password = $('input[name="signup-password"]').val();

    if (username && email && password){
        const response = await fetch('/api/user/',{
            method: 'post',
            body: JSON.stringify({
                username,
                email,
                password
            }),
            headers: {'Content-type': 'application/json'}
        });

        if (response.ok)
            location.assign('/dashboard');
        else if (response.status === 400 || response.status === 409){
            const responseJson = await response.json();
            $('.signup-error-msg').text(responseJson.message);
        } else
            alert(response.statusText);
    }
});