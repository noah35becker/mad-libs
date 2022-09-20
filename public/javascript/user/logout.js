
// Logout
$('.logout-nav').click(async () => {
    const response = await fetch('api/user/logout',{
        method: 'post'
    });

    if (response.ok)
        location.replace('/');
    else
        alert(response.statusText);
});