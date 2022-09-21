
// Blur after focus
$('.slider').focus(function(){
    setTimeout(
        () => $(this).blur(),
        400
    )
});


// Update redaction when slider changes
$('.slider').on('input', function(){
    var newVal = $(this).val();
    const max = +$(this).attr('max');

    $(this).attr('value', newVal);
    $(this).attr('redaction-lvl', max - newVal);
});