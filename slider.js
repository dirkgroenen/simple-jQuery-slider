// Slider object
function simpleSlider(slidesdom){
	var obj = this,sliderInterval;
	obj.currentSlide = 0;
	obj.totalSlides = 0;
	
	// Init the slider
	obj.init = function(){
		// Find the slides in the sliderdom and add the index attribute
		$(slidesdom).find('.slide').each(function(index){
			$(this).attr('data-index', index);
			$(this).css({x: index*100+'%'});
		});
		
		// Count total slides
		obj.totalSlides = $(slidesdom).find('.slide').length;
		
		// Add the slideposition div and add the indicators
		$(slidesdom).append("<div id='slideposition'><ul></ul></div>");
		for(var x = 0; x < obj.totalSlides;x++){
			$(slidesdom).find('#slideposition ul').append('<li class="indicator" data-index="'+x+'"></li>');
		}
		$(slidesdom).find('#slideposition ul li[data-index="'+obj.currentSlide+'"]').addClass('active');
			
		// Make the slide indicators clickable
		$(slidesdom).find("#slideposition ul li").click(function(){
			obj.nextSlide($(this).data('index'));
		});
		
		// Start the slider interval
		setSliderInterval();
	}
	
	function setSliderInterval(){
		clearInterval(sliderInterval);
		sliderInterval = setInterval(function(){
			obj.nextSlide();
		},5000);
	}	
	
	// Go to a previous slide (calls the nextslide function with a currentslide number minus one
	obj.prevSlide = function(){
		var slide = (obj.currentSlide > 0) ? obj.currentSlide -= 1 : obj.totalSlides-1;
		obj.nextSlide(slide);
	}
	
	// Go to a next slide (function is also used for the previous slide and slide indicator).
	// If a paramater is given it will go to the given slide
	obj.nextSlide = function(slide){
		if(slide == undefined){
			obj.currentSlide = (obj.currentSlide < (obj.totalSlides-1)) ? obj.currentSlide += 1 : 0 ;
		}
		else{
			obj.currentSlide = slide;
		}
	
		// Check which fact is the current and show it
		$(slidesdom).find('.slide').each(function(index){
			$(this).transition({x: ($(this).data('index')-obj.currentSlide)*100+'%'},1000);
		});
		
		// Show current slide bulb
		$(slidesdom).find('#slideposition ul li').removeClass('active');
		$(slidesdom).find('#slideposition ul li[data-index="'+obj.currentSlide+'"]').addClass('active');
		
		// (Re)set the slider interval
		setSliderInterval();
	}
}