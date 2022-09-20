
// FUNCTIONS

async function checkVoted(){
    const apiCheck = await fetch(`/api/vote/check&fillinId=${1}`); //fix this later to grab fillinId from current URL
    const currentUserVoted = apiCheck.message;

    if (currentUserVoted)
        $('.votes').attr('current-user-voted', '');
    else
        $('.votes').removeAttr('current-user-voted');

    $('.vote-count').text(apiCheck.vote_count);
}


async function updateVote(){
    const currentUserVoted = $('.votes').attr('current-user-voted');
    
    await fetch(`/api/vote`, {
        method: currentUserVoted ? 'delete' : 'post',
        body: JSON.stringify({
            fillin_id: 1 //fix this later to grab from current URL
        }),
        headers: {'Content-Type': 'application/json'}
    });

    checkVoted();
}



// RUN ON PAGE LOAD
checkVoted();



// EVENT LISTENER
$('.votes a').click('i', updateVote);