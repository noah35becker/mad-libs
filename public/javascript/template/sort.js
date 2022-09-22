
function fillinSortingSpace(){
    $('.template-sorting select').on('input', function(){
        var url = new URL(location.href);

        url.searchParams.delete('sortBy');
        url.searchParams.append('sortBy', $(this).val());

        location.replace(url);
    });
}fillinSortingSpace();