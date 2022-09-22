var root = $('.root');
var rootStyle = getComputedStyle(root);

var updatedColor = rgb(redColor, greenColor, blueColor);
var mutableColor = rootStyles.getPropertyValue('--mutable-color');
var redColor = 255;
var greenColor = 169;
var blueColor = 169; 


$('.body').on('mousemove', (e) => {
    if(0 >= redColor <=250){
        redColor++;
    }; else if (0 >= redColor >=251){
        redColor--;
    }

    }); 

    root.style.setProperty('--mutable-color', updatedColor);

    // 