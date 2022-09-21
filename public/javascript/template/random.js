
$('.view-random-template').click(async function(){
    const response = await fetch('/api/template/random-id');
    if (response.ok){
        const responseJson = await response.json();
        location.assign(`/template/${responseJson.rand_id}`);
    }
});