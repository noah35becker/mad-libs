

$('.w3-dropdown-hover>a').click(function(){
    const dropdown = $(this)
        .siblings('.w3-dropdown-content');
    
    switch (dropdown.attr('style')){
        case 'display: block;':
            dropdown.css('display', 'none');
            break;
        case 'display: none;':
        default:
            dropdown.css('display', 'block');
    }

    
 });