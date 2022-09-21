
// Logout
$('.logout-nav').click(async () => {
    const response = await fetch('/api/user/logout',{
        method: 'post'
    });

    if (response.ok)
        location.assign('/');
    else
        alert(response.statusText);
});