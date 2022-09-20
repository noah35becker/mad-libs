
// Open login modal
$('.nav-login').click(() =>
    $('#login-modal').css('display', 'block')
);

// Close login modal
$('.close-modal').click(() =>
    $('#login-modal').css('display', 'none')
);


// Login
$('.login-form').submit(async event => {
    event.preventDefault();

    const email = $('.login-form input[name="email"]').val().trim();
    const password = $('.login-form input[name="password"]').val();

    const response = await fetch('api/user/login',{
        method: 'post',
        body: JSON.stringify({
            email,
            password
        }),
        headers: {'Content-type': 'application/json'}
    });

    if (response.ok)
        location.replace('/');
    else if (response.status === 404 || response.status === 400){
        const responseJson = await response.json();
        $('.login-form .error-msg').text(responseJson.message);
    } else
        alert(response.statusText);
});