
// Blur after focus
$('.slider').focus(() =>
    setTimeout(
        () => $('.slider').blur(),
        400
    )
);


// Update redaction when slider changes
$('.slider').change(async () => {
    var newVal = $('.slider').val();
    const max = +$('.slider').attr('max')

    $('.slider').attr('value', newVal);
    $('.slider').attr('redaction-lvl', max - newVal);
});