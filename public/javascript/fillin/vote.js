
// FUNCTIONS

async function checkVoted(){
    const response = await fetch(`/api/vote/check?fillinId=${$('.template').attr('fillin-id')}`);
    const responseJson = await response.json();

    const currentUserVoted = responseJson.message;

    if (currentUserVoted)
        $('.votes').attr('current-user-voted', '');
    else
        $('.votes').removeAttr('current-user-voted');

    $('.vote-count').text(responseJson.vote_count);
}


async function updateVote(){
    const currentUserVoted = $('.votes').attr('current-user-voted') === '';
    
    await fetch(`/api/vote`, {
        method: currentUserVoted ? 'delete' : 'post',
        body: JSON.stringify({
            fillin_id: $('.template').attr('fillin-id')
        }),
        headers: {'Content-Type': 'application/json'}
    });

    checkVoted();
}



// RUN ON PAGE LOAD
checkVoted();



// EVENT LISTENER
$('.votes a').click('i', updateVote);