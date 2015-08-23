var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points) {

    for (var i = 0; i < points.length; i++){

        var revealPoint = function() {
            points[i].style.opacity = 1;
            points[i].style.transform = "scaleX(1) translateY(0)";
            points[i].style.msTransform = "scaleX(1) translateY(0)";
            points[i].style.WebkitTransform = "scaleX(1) translateY(0)";   
        };

        revealPoint();
        
        };

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