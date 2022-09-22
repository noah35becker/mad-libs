
function populateFillinContent(){
    const content = JSON.parse($('.template').attr('fillin-content'));

    content.forEach((elem, index) => {
        $(`.template-body span[mutable-index="${index}"]`).text(elem);
    });
}

// RUN LOAD
populateFillinContent();