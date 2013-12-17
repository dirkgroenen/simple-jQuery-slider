function simpleSlider(useroptions){
	var obj = this,sliderInterval;
	obj.currentSlide = 0;
	obj.totalSlides = 0;
	
	useroptions = (useroptions == undefined) ? {} : useroptions;
	var options = $.extend({
		slidesContainer: '.slider',
		slides: '.slide',
		swipe: false,
		slideTracker: true,
		slideTrackerID: 'slideposition',
		slideOnInterval: true,
		interval: 5000,
		swipe: true,
		animateDuration: 1000
	}, useroptions);
	
	console.log(options);
	
	// Init the slider
	obj.init = function(){
		// Find the slides in the sliderdom and add the index attribute
		$(options.slidesContainer).find(options.slides).each(function(index){
			$(this).attr('data-index', index);
			$(this).css({x: index*100+'%'});
		});
		
		// Count total slides
		obj.totalSlides = $(options.slidesContainer).find(options.slides).length;
		
		if(options.slideTracker){
			// Add the slideposition div and add the indicators
			$(options.slidesContainer).append("<div id='"+ options.slideTrackerID +"'><ul></ul></div>");
			for(var x = 0; x < obj.totalSlides;x++){
				$(options.slidesContainer).find('#'+ options.slideTrackerID +' ul').append('<li class="indicator" data-index="'+x+'"></li>');
			}
			$(options.slidesContainer).find('#'+ options.slideTrackerID +' ul li[data-index="'+obj.currentSlide+'"]').addClass('active');
				
			// Make the slide indicators clickable
			$(options.slidesContainer).find("#"+ options.slideTrackerID +" ul li").click(function(){
				obj.nextSlide($(this).data('index'));
			});
		}
		
		// Start the slider interval
		if(options.slideOnInterval){
			setSliderInterval();
		}
		
		// Add grabbing hand
		if(options.swipe){
			$(options.slidesContainer).css('cursor','-webkit-grab');
			$(options.slidesContainer).css('cursor','-moz-grab');
			$(options.slidesContainer).css('cursor','grab');
			
			$(options.slidesContainer).mousedown(function(){
				$(options.slidesContainer).css('cursor','-webkit-grabbing');
				$(options.slidesContainer).css('cursor','-moz-grabbing');
				$(options.slidesContainer).css('cursor','grabbing');
			});
			
			$(options.slidesContainer).mouseup(function(){
				$(options.slidesContainer).css('cursor','-webkit-grab');
				$(options.slidesContainer).css('cursor','-moz-grab');
				$(options.slidesContainer).css('cursor','grab');
			});
			
			$(options.slidesContainer +" "+ options.slides).swipe({
				swipeLeft: function(event, direction, distance, duration, fingerCount){
					obj.nextSlide();
				},
				swipeRight: function(event, direction, distance, duration, fingerCount){
					obj.prevSlide();
				}
			});
		}
	}
	
	function setSliderInterval(){
		clearInterval(sliderInterval);
		sliderInterval = setInterval(function(){
			obj.nextSlide();
		},options.interval);
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
		$(options.slidesContainer).find(options.slides).each(function(index){
			$(this).transition({x: ($(this).data('index')-obj.currentSlide)*100+'%'}, options.animateDuration);
		});
		
		// Show current slide bulb
		$(options.slidesContainer).find('#'+ options.slideTrackerID +' ul li').removeClass('active');
		$(options.slidesContainer).find('#'+ options.slideTrackerID +' ul li[data-index="'+obj.currentSlide+'"]').addClass('active');
		
		// (Re)set the slider interval
		if(options.slideOnInterval){
			setSliderInterval();
		}
	}
}