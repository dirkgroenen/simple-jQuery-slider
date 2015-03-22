/*
    Version 2.6.2
    The MIT License (MIT)

    Simple jQuery Slider is just what is says it is: a simple but powerfull jQuery slider.
    Copyright (c) 2014 Dirk Groenen - Bitlabs Development

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
*/
(function($){
    var simpleSlider = function(element, useroptions){
        // Set some variables
        var obj = this,
        sliderInterval = null,
        movecontainer = null,
        instanceID = Math.floor(Math.random() * 100) + Date.now(); // Create a unique ID for this slider


        obj.currentSlide = 0;
        obj.totalSlides = 0;

        // Extend default options with user options
        useroptions = (useroptions === undefined) ? {} : useroptions;
        var options = $.extend({
            slidesContainer: element,
            slides: '.slide',
            slideTracker: true,
            slideTrackerID: 'slideposition',
            slideOnInterval: true,
            interval: 5000,
            swipe: true,
            magneticSwipe: true, 
            transition: "slide",
            animateDuration: 1000,
            animationEasing: 'ease',
            pauseOnHover: false,
            updateTransit: true, // Change this to false is you dont want the slider to update the transit useTransitionEnd to true
            useDefaultCSS: true,
            neverEnding: true
        }, useroptions);

        /*
         * Method to build and init the slider
         */
        obj.init = function(){
            // If transit is included and useTransitionEnd == false we will change this to true (better animation performance).
            // Unless the user changed updateTransit to false
            if(options.updateTransit && $.support.transition && jQuery().transition && !$.transit.useTransitionEnd){
                $.transit.useTransitionEnd = true;
            }

            var movecontainerclass = "jss-slideswrap-" + instanceID;

            // Wrap the slides in a new container which will be used to move the slides
            $(options.slidesContainer).wrapInner("<div class='" + movecontainerclass + "' style='position:absolute;width:100%;height:100%;'></div>");
            movecontainer = "." + movecontainerclass;

            if(options.neverEnding){  
                if ($.support.transition && jQuery().transition)
                    $(movecontainer).stop().css({x: '-100%'});
                else
                    $(movecontainer).stop().css({left: '-100%'});
            }

            // Count the total slides
            obj.totalSlides = $(options.slidesContainer).find(options.slides).length;

            // Check if the neverEnding options has been enabled
            // If it is; clone the first and last slide
            if(options.neverEnding){
                var $first = $(options.slidesContainer).find(options.slides).first().clone(true, true);
                var $last = $(options.slidesContainer).find(options.slides).last().clone(true, true);
                
                $(movecontainer).prepend($last);
                $(movecontainer).append($first);
            }

            var cacheWidth = 0;
          
            // Add default positioning css when enabled
            if(options.useDefaultCSS){
                $(options.slidesContainer).css({
                    position: "relative",
                    overflow: "hidden"
                });
            }

            // Find the slides in the sliderdom and add the index attribute
            $(options.slidesContainer).find(options.slides).each(function(index){
                // Give each slide a data-index so we can control it later on
                if(options.neverEnding){
                    if(index === 0)
                        $(this).attr('data-index', obj.totalSlides - 1);
                    else if(index == obj.totalSlides + 1)
                        $(this).attr('data-index', 0);
                    else
                        $(this).attr('data-index', index - 1);
                }
                else{
                    $(this).attr('data-index', index);
                }


                cacheWidth = ($(this).outerWidth() > cacheWidth) ? $(this).outerWidth() : cacheWidth;

                // Add css for slide transition
                if(options.transition == "slide"){
                    // A fixed width is needed for the IE left animation. Here we give each slide a width
                    if($.support.transition !== undefined){
                        $(this).css({
                            x: index * 100 + '%',
                            'z-index': (obj.totalSlides * 2) - index,
                            width: cacheWidth
                        });
                    }
                    else{
                        $(this).css({
                            left: index * 100 + '%',
                            'z-index': (obj.totalSlides * 2) - index,
                            width: cacheWidth
                        });
                    }
                }

                // Add css for fade transition
                if(options.transition == "fade"){
                    // A fixed width is needed for the IE left animation. Here we give each slide a width
                    var alpha = (index === 0) ? 1 : 0;
                    $(this).css({
                        left: 0,
                        top: 0,
                        'z-index': obj.totalSlides - index,
                        width: cacheWidth,
                        opacity: alpha
                    });
                }

                // Add default positioning css when enabled
                if(options.useDefaultCSS){
                    $(this).css({
                        position: "absolute",
                        float: "left",
                        height: "100%",
                        top: 0
                    });
                }
            });

            // Place the slideTracker after the container if enabled in the options
            if(options.slideTracker){
                // Add the slideposition div and add the indicators
                $(options.slidesContainer).after("<div id='"+ options.slideTrackerID +"' data-slider='" + instanceID + "'><ul></ul></div>");

                for(var x = 0; x < obj.totalSlides; x++){
                    var index = (obj.neverEnding && x == obj.totalSlides - 1) ? 0 : x;

                    $('div[data-slider="' + instanceID + '"] ul').append('<li class="indicator" data-index="' + index + '"></li>');
                }

                $('div[data-slider="' + instanceID + '"] ul li[data-index="'+obj.currentSlide+'"]').addClass('active');

                // Make the slide indicators clickable
                $("div[data-slider='" + instanceID + "'] ul li").click(function(){
                    if(!($(this).hasClass("active")))
                        obj.nextSlide($(this).data('index'));
                });
            }

            // Start the slider interval if enabled in options
            if(options.slideOnInterval){
                setSliderInterval();
            }

            // Change the cursor with a grabbing hand that simulates the swiping on desktops
            if(options.swipe || options.magneticSwipe){
                // Set grabbing mouse cursor
                $(options.slidesContainer).css('cursor','-webkit-grab');
                $(options.slidesContainer).css('cursor','-moz-grab');
                $(options.slidesContainer).css('cursor','grab');

                // Set vars for swiping
                var isDragging = false;
                var startPosition = {x: 0, y: 0};
                var percentageMove = 0;
                var slideWidth = $(options.slidesContainer).width();

                // Check which touch events to use
                var touchstartEvent = (window.navigator.msPointerEnabled) ? "MSPointerDown" : "touchstart";
                var touchmoveEvent = (window.navigator.msPointerEnabled) ? "MSPointerMove" : "touchmove";
                var touchendEvent = (window.navigator.msPointerEnabled) ? "MSPointerUp" : "touchend";

                // Bind the mousedown or touchstart event
                $(options.slidesContainer).on(touchstartEvent + " mousedown", function(e){
                    // Set isDragging on true
                    isDragging = true;
                    
                    // Save start coordinates
                    startPosition = {
                        x: (e.pageX !== undefined) ? e.pageX : e.originalEvent.touches[0].pageX,
                        y: (e.pageY !== undefined) ? e.pageY : e.originalEvent.touches[0].pageY
                    };

                    // Reset transition animation
                    if(options.magneticSwipe)
                        $(options.slidesContainer).find(options.slides).css('transition', 'none');

                    // Reset percentage move
                    percentageMove = 0;

                    // Set mouse cursor
                    $(options.slidesContainer).css('cursor','-webkit-grabbing');
                    $(options.slidesContainer).css('cursor','-moz-grabbing');
                    $(options.slidesContainer).css('cursor','grabbing');
                });

                // Bind the mousemove or touchmove event
                $(options.slidesContainer).on(touchmoveEvent + " mousemove", function(e){
                    if(isDragging){
                        // Calculate given distance in pixels to percentage
                        var x = (e.pageX !== undefined) ? e.pageX : e.originalEvent.touches[0].pageX;
                        percentageMove = ((startPosition.x - x) / slideWidth) * 100;

                        // Check if magnetic swipe is on
                        if(options.magneticSwipe){
                            // Move slides
                            obj.manualSlide(percentageMove);    
                        }
                    }
                });

                // Bind the mouseup or touchend event
                $(options.slidesContainer).on(touchendEvent + " mouseup", function(e){
                    isDragging = false;

                    // Check if we have to call the next or previous slide, or reset the slides.
                    if(percentageMove > 25 && (obj.currentSlide < (obj.totalSlides - 1) || options.neverEnding))
                        obj.nextSlide();
                    else if(percentageMove < -25 && (obj.currentSlide > 0 || options.neverEnding))
                        obj.prevSlide();    
                    else
                        obj.resetSlides();

                    // Reset mouse cursor
                    $(options.slidesContainer).css('cursor','-webkit-grab');
                    $(options.slidesContainer).css('cursor','-moz-grab');
                    $(options.slidesContainer).css('cursor','grab');
                });
            }
            
            // Add on init event
            $(element).trigger({
                type: "init",
                totalSlides: obj.totalSlides
            });
        }();

        // Bind the function that recalculates the width of each slide on a resize.
        $(window).resize(function(){
            var cacheWidth = 0;
        
            $(options.slidesContainer).find(options.slides).each(function(index){
                // Reset width; otherwise it will keep the same width as before
                $(this).css('width','');
                
                cacheWidth = ($(this).outerWidth() > cacheWidth) ? $(this).outerWidth() : cacheWidth;
                
                $(this).css({x: ($(this).data('index') - obj.currentSlideindex) * 100 + '%', width: cacheWidth});
            });
        });

        /*
         * Set the slider interval
         */
        function setSliderInterval(){
            clearInterval(sliderInterval);
            sliderInterval = setInterval(function(){
                obj.nextSlide();
            },options.interval);
        }

        /*
         * Manual offset the slider with the given percentage
         *
         * @param int percentage
         */
        obj.manualSlide = function(percentage){ 
            // Move the slides based on the calculated percentage
            if(options.transition == "slide"){
                // Remove the previous transition effect
                $(movecontainer).css("-webkit-transition", "none");
                $(movecontainer).css("-moz-transition", "none");
                $(movecontainer).css("-ms-transition", "none");
                $(movecontainer).css("transition", "none");

                var movepercantage = -((obj.currentSlide * 100) + percentage);

                if(options.neverEnding)  
                    movepercantage = -(((obj.currentSlide + 1) * 100) + percentage);

                if ($.support.transition && jQuery().transition)
                    $(movecontainer).css({x: movepercantage + '%'});
                else
                    $(movecontainer).css({left: movepercantage + '%'});
            }
        };

        /*
         * Reset slides to their given position. Used after a manualSlide action
         */
        obj.resetSlides = function(){
            if(options.transition == "slide"){       
                var movepercantage = (options.neverEnding) ? -((obj.currentSlide + 1) * 100) : -(obj.currentSlide * 100);

                if ($.support.transition && jQuery().transition)             
                    $(movecontainer).stop().transition({x: movepercantage + '%'}, options.animateDuration, options.animationEasing);
                else
                    $(movecontainer).stop().animate({left: movepercantage + '%'}, options.animateDuration);
            }
        };

        /*
         * Go to the previous slide, calls the last slide when no previous slides
         */
        obj.prevSlide = function(){
            var slide = (obj.currentSlide > 0) ? obj.currentSlide -= 1 : (obj.totalSlides - 1);
            obj.nextSlide(slide);
        };

        /*
         * Go to a next slide (function is also used for the previous slide and goto slide functions).
         * If a paramater is given it will go to the given slide  
         *
         * @param1 int slide
         */
        obj.nextSlide = function(slide){
            // Cache the previous slide number and set slided to false
            var prevSlide = obj.currentSlide,
                slided = false;

            // Auto define the next slide
            if(slide === undefined)
                obj.currentSlide = (obj.currentSlide < (obj.totalSlides-1)) ? obj.currentSlide += 1 : 0 ;    
            else
                obj.currentSlide = slide;


            // Create event object which will contain the previous end next slide number
            var beforeSlidingEvent = jQuery.Event("beforeSliding", {
                prevSlide: prevSlide,
                newSlide: obj.currentSlide
            });
            $(element).trigger(beforeSlidingEvent);

            // Stop the action when the user has prevented the default action
            // and reset the obj.currentSlide to the previous number
            if(beforeSlidingEvent.isDefaultPrevented()){
                obj.currentSlide = prevSlide;
                return false;
            }                


            // Calculate the move percantage
            var movepercantage = -(obj.currentSlide * 100);
            if(options.neverEnding){
                if(obj.currentSlide == obj.totalSlides - 1 && prevSlide === 0){
                    movepercantage = 0;
                }
                else if(obj.currentSlide === 0 && obj.totalSlides - 1 == prevSlide){
                    movepercantage = -(obj.totalSlides + 1) * 100;
                }
                else{
                    movepercantage = -((obj.currentSlide + 1) * 100);   
                }
            }

            // Move the container 
            if(options.transition == "slide"){                    
                if ($.support.transition && jQuery().transition)
                    $(movecontainer).stop().transition({x: movepercantage + '%'}, options.animateDuration, options.animationEasing);
                else
                    $(movecontainer).stop().animate({left: movepercantage + '%'}, options.animateDuration, triggerSlideEnd);
            }

            // Hide and show the correct slides
            if(options.transition == "fade"){
                $(options.slidesContainer).find(options.slides).each(function(index){
                    var alpha = (index == obj.currentSlide) ? 1 : 0;

                    if(index == obj.currentSlide){
                        $(this).show();
                    }

                    if ($.support.transition && jQuery().transition)
                        $(this).stop().transition({opacity: alpha}, options.animateDuration, triggerSlideEnd);
                    else
                        $(this).stop().animate({opacity: alpha}, options.animateDuration, triggerSlideEnd);
                });
            }

            // Somehow the callback from $.transition doesn't work, so we create ow custom bind here
            $(options.slidesContainer).on('oTransitionEnd webkitTransitionEnd oTransitionEnd otransitionend transitionend', triggerSlideEnd);

            // Create trigger point after a slide slides. All the slides return a TransitionEnd; to prevent a repeating trigger we keep a slided var
            function triggerSlideEnd(){
                if(!slided){
                    if(options.transition == "fade"){
                        $(options.slidesContainer).find(options.slides).each(function(index){
                            if($(this).data('index') == obj.currentSlide){
                                $(this).show();
                            }
                            else{
                                $(this).hide();
                            }
                        });
                    }

                    // Reset to the first slide when neverEnding has been enabled and the 'faked' last slide is active
                    if(options.transition == "slide" && options.neverEnding){
                        // Check if it's the 'last' slide
                        if(obj.currentSlide == obj.totalSlides - 1 && prevSlide === 0){
                            if ($.support.transition && jQuery().transition)
                                $(movecontainer).stop().transition({x: -(obj.totalSlides) * 100 + "%"}, 1, 'linear');
                            else
                                $(movecontainer).css({left: -(obj.totalSlides) * 100 + "%"});
                        }

                        // Check if it's the 'first' slide
                        if(obj.currentSlide === 0 && prevSlide == obj.totalSlides - 1){
                            if ($.support.transition && jQuery().transition)
                                $(movecontainer).stop().transition({x: "-100%"}, 1, 'linear');
                            else
                                $(movecontainer).css({left: "-100%"});
                        }
                    }
                    
                   
                    // Trigger event
                    var afterSlidingEvent = jQuery.Event("afterSliding", {
                        prevSlide: prevSlide,
                        newSlide: obj.currentSlide
                    });
                    $(element).trigger(afterSlidingEvent);
                    
                    slided = true;
                }
            }

            // Show current slide bulb
            $('div[data-slider="' + instanceID + '"] ul li').removeClass('active');
            $('div[data-slider="' + instanceID + '"] ul li[data-index="'+obj.currentSlide+'"]').addClass('active');

            // (Re)set the slider interval
            if(options.slideOnInterval){
                setSliderInterval();
            }
        };

        // Function for the pauseOnHover.
        //The function will clear the interval and restart it after the mouse disappears from the container
        if(options.pauseOnHover){
            $(options.slidesContainer).hover(function(){
                clearInterval(sliderInterval);
            }, function(){
                setSliderInterval();
            });
        }
    };

    // Create a plugin
    $.fn.simpleSlider = function(options){
        return this.each(function(){
            var element = $(this);

            // Return early if this element already has a plugin instance
            if (element.data('simpleslider')) return;

            // Pass options and element to the plugin constructer
            var simpleslider = new simpleSlider(this, options);

            // Store the plugin object in this element's data
            element.data('simpleslider', simpleslider);
        });
    };

})(jQuery);