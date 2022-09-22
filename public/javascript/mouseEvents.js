
    var red = 0;


/*parse whether colors are in optimal state for change 
    Number.Prototype.between = function(100, 222) {
    let min = Math.min.apply(Math, [100, 222]),
      max = Math.max.apply(Math, [100, 222]);
      return this >= min && this <= max; 
  };

    red.between();
*/

$('.body').on('mousemove', (e) => {
    if(red <=250){
        red++;
        console.log("RGBs now variable");
    }; else if (red >=251){
        red--;
    }
    }); 

// e.mousemove.screenX;
*/
