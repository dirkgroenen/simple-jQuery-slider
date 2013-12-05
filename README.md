Simple jQuery/CSS3 slider
=========================

A simple slider that does what a simple slider has to do: slide slides!

Installation
------------

Copy slider.js and transit.js to your website and include them in your <head></head>
```code
<script type="text/javascript" src="/transit.js"></script>
<script type="text/javascript" src="/slider.js"></script>
```

Add a div to your site containing the .slide divs
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

Create and initilize the slider object and parse the div that contains the slides
```code
$(document).ready(function(){	
	var slider = new workshopSlider(".slider");
	slider.init();
});
```

Now you can control the slider using the following functions
```code
slider.nextSlide(); // Go to the next slide
slider.prevSlide(); // Go to the previous slide
slider.nextSlide(slidenumber); // Go to the given slide
```