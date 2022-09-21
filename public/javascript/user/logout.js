
// Logout
$('.logout-nav').click(async () => {
    const response = await fetch(location.href.split(RegExp('(?<!\/)\/(?!\/)'))[0] + '/api/user/logout',{
        method: 'post'
    });

    if (response.ok)
        location.replace('/');
    else
        alert(response.statusText);
});