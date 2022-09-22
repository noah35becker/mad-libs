
function fillinSortingSpace(){
    $('.fillin-sorting select').on('input', function(){
        var url = new URL(location.href);

        url.searchParams.delete('sortFillinsBy');
        url.searchParams.append('sortFillinsBy', $(this).val());

        location.replace(url);
    });
}fillinSortingSpace();