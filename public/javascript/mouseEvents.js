//vanilla js 
const bgChange = document.querySelector(".body")

var mutableColor: {
    mut_red: 255,
    mut_green: 0,
    mut_blue: 0,
}

var cardinalColor: {
    car_red: 255,
    car_green: 255,
    car_blue: 255,
}

bgChange.addEventListener('mousemove', (e) => {
    var updated_mut_red = mutableColor.mut_red - e.mouseEvent.screenX/10;
    var change_x = updated_mut_red - mutableColor.mut_red;
    if(updated_mut_red >=255 && mutableColor.mut_green >=0){
        mutableColor.mut_red = updated_mut_red;
        mutableColor.mut_green = mutableColor.mut_green + change_x;
        mutableColor.mut_blue = mutableColor.mut_green;
    }; else if(updated_mut_red <=0 && mutableColor.mut_green >=255){
        mutableColor.mut_red = mutableColor + change_x;
        mutableColor.mut_green = mutableColor.mut_green - change_x;
        mutableColor.mut_blue = mutableColor.mut_green;
    } 
}); 

bgChange.addEventListener('mousemove', , (e) => {
    var updated_car_red = cardinalColor.car_red - e.mouseEvent.screenY/10;
    var change_y = updated_car_red - cardinalColor.car_red;
    if(updated_car_red >=255 && cardinalColor.car_green >=0){
    }; else if(updated_mut_red <=0 && mutableColor.mut_green >=255){
    }
}
    );

