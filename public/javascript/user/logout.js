
// Logout
$('.logout-nav').click(async () => {
    const response = await fetch(location.pathname.split('/')[0] + '/api/user/logout',{
        method: 'post'
    });

    if (response.ok)
        location.assign('/');
    else
        alert(response.statusText);
});