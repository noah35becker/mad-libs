
// Logout
$('.logout-nav').click(async () => {
    const response = await fetch(location.href.split(RegExp('(?<!\/)\/(?!\/)'))[0] + '/api/user/logout',{
        method: 'post'
    });

    if (response.ok)
        location.assign('/');
    else
        alert(response.statusText);
});