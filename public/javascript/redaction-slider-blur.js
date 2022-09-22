$('.slider').focus(() =>
    setTimeout(
        () => $('.slider').blur(),
        400
    )
);