Simple jQuery/CSS3 slider
=========================

A simple slider that does what a simple slider has to do: slide slides!

Installation
------------

Include jQuery, slider.js, touchSwipe.js (optional if you want touch support) and transit.js in your head
```code
<script src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script src="http://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

<script type="text/javascript" src="transit.js"></script>
<script type="text/javascript" src="touchSwipe.js"></script>
<script type="text/javascript" src="slider.js"></script>
```

Add a div to your site containing the slides. The standard name for these divs are .slider and .slide, but these can be changed in the options object
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

You can also control the options of the simpleSlider. Just parse an object with the options into the simpleSlider().
```code
$(document).ready(function(){	
	// Default options
	var options = {
		slidesContainer: '.slider',
		slides: '.slide',
		swipe: false,
		slideTracker: true,
		slideTrackerID: 'slideposition',
		slideOnInterval: true,
		interval: 5000,
		swipe: true,
		animateDuration: 1000
	};
	
	var slider = new simpleSlider(options);
	slider.init();
});
```

Now you can control the slider using the following functions
```code
slider.nextSlide(); // Go to the next slide
slider.prevSlide(); // Go to the previous slide
slider.nextSlide(slidenumber); // Go to the given slide
```

If enabled the slider automatically creates a list with list-items that you can use to control the slider.