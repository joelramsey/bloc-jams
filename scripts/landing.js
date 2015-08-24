var pointsArray = document.getElementsByClassName('point');

function myForEach(array, pointFunction){
    for (var i = 0; i < array.length; i++){
        pointFunction(i);
    }
};

var animatePoints = function(points) {

        var revealPoint = function(index) {
            points[index].style.opacity = 1;
            points[index].style.transform = "scaleX(1) translateY(0)";
            points[index].style.msTransform = "scaleX(1) translateY(0)";
            points[index].style.WebkitTransform = "scaleX(1) translateY(0)";   
        };

        myForEach(points, revealPoint);
};

window.onload = function() {

    //checking to see if this is an oversized screen which would negate the scroll event listener
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    }
    window.addEventListener('scroll', function(event){
    
        if (pointsArray[0].getBoundingClientRect().top <= 500) {

            animatePoints(pointsArray);
        }
   });
};