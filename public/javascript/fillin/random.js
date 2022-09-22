
$('.view-random-fillin').click(async function(){
    const response = await fetch('/api/fillin/random-id');
    if (response.ok){
        const responseJson = await response.json();
        location.assign(`/fillin/${responseJson.rand_id}`);
    }
});