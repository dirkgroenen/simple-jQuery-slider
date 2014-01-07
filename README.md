Simple jQuery/CSS3 slider
=========================

A simple slider that does what a simple slider has to do: slide slides!

Installation
------------

Include jQuery, simpleSlider.js, touchSwipe.js (optional if you want touch support) and transit.js in your `head`. The slider will automatically change transit's `useTransitionEnd` property to `true`. You can disable this by setting `updateTransit: false` in your options.
```code
<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

<script type="text/javascript" src="transit.js"></script>
<script type="text/javascript" src="touchSwipe.js"></script>
<script type="text/javascript" src="simpleSlider.min.js"></script>
```

Add a div to your site containing the slides. The standard name for these divs are `.slider` and `.slide`, but these can be changed in the options object
```code
<div class='slider'>
	<div class='slide'>
		<div class='slidecontent'>
			<h1>Solar Dolar Wolar Woot</h1>
			<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere cursus euismod.Aenean ut tortor leoing elit. Etiam posuere cursus euismod.Aenean ut tortor leo.</h2>
		</div>
	</div>
	<div class='slide' >
		<div class='slidecontent'>
			<h1>Solar Dolar Wolar Woot</h1>
			<h2>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam posuere cursus euismod.Aenean ut tortor leo.</h2>
		</div>
	</div>
</div>
```

Create and initilize the slider object
```code
$(document).ready(function(){
	var slider = new simpleSlider();
	slider.init();
});
```

Custom options
--------------
You can also control the options of the simpleSlider. Just parse an object with the options into the simpleSlider().
```code
$(document).ready(function(){
	// Default options
	var options = {
		slidesContainer: '.slider', // The div that contains the slides
		slides: '.slide', // The name of a slide in the slidesContainer
		swipe: true,	// Add possibility to Swipe > note that you have to include touchSwipe for this
		slideTracker: true, // Add a UL with list items to track the current slide
		slideTrackerID: 'slideposition', // The name of the UL that tracks the slides
		slideOnInterval: true, // Slide on interval
		interval: 5000, // Interval to slide on if slideOnInterval is enabled
		animateDuration: 1500, // Duration of an animation
		animationEasing: 'easeInOut', // Accepts: linear ease in out in-out snap easeOutCubic easeInOutCubic easeInCirc easeOutCirc easeInOutCirc easeInExpo easeOutExpo easeInOutExpo easeInQuad easeOutQuad easeInOutQuad easeInQuart easeOutQuart easeInOutQuart easeInQuint easeOutQuint easeInOutQuint easeInSine easeOutSine easeInOutSine easeInBack easeOutBack easeInOutBack
		pauseOnHover: false // Pause when user hovers the slide container
	};

	var slider = new simpleSlider(options);
	slider.init();
});
```

Control the slider
--------------
Now you can control the slider using the following functions
```code
slider.nextSlide(); // Go to the next slide
slider.prevSlide(); // Go to the previous slide
slider.nextSlide(slidenumber); // Go to the given slide
```

If enabled the slider automatically creates a list with list-items that you can use to control the slider.

Examples
--------
Simple-jQuery-Slider is used in the following websites. You can check them out if you want to see the slider in aciton!

[Demo Site #2](http://ondernemenanno2014.nl/)

Supported browser
-----------------
SimpleSlide works in Chrome, Firefox, Safari and Internet Explorer 7+.
