/*
    Version 2.3.4
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
            sliderInterval = null;
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
            animateDuration: 1000,
            animationEasing: 'ease',
            pauseOnHover: false,
            updateTransit: true // Change this to false is you dont want the slider to update the transit useTransitionEnd to true
        }, useroptions);

        // Init the slider
        obj.init = function(){
            // If transit is included and useTransitionEnd == false we will change this to true (better animation performance).
            // Unless the user changed updateTransit to false
            if(options.updateTransit && $.support.transition && jQuery().transition && !$.transit.useTransitionEnd){
                $.transit.useTransitionEnd = true;
            }

            // Find the slides in the sliderdom and add the index attribute
            $(options.slidesContainer).find(options.slides).each(function(index){
                // Give each slide a data-index so we can control it later on
                $(this).attr('data-index', index);

                // A fixed width is needed for the IE left animation. Here we give each slide a width                
                if ($.support.transition && jQuery().transition){
                    $(this).css({
                        x: index*100+'%',
                        width: $(this).outerWidth()
                    });
                }
                else{
                    $(this).css({
                        left: index*100+'%',
                        width: $(this).outerWidth()
                    });
                }
            });

            // Count the total slides
            obj.totalSlides = $(options.slidesContainer).find(options.slides).length;

            // Place the slideTracker after the container if enabled in the options
            if(options.slideTracker){
                // Add the slideposition div and add the indicators
                $(options.slidesContainer).after("<div id='"+ options.slideTrackerID +"'><ul></ul></div>");
                for(var x = 0; x < obj.totalSlides;x++){
                    $('#'+ options.slideTrackerID +' ul').append('<li class="indicator" data-index="'+x+'"></li>');
                }
                $('#'+ options.slideTrackerID +' ul li[data-index="'+obj.currentSlide+'"]').addClass('active');

                // Make the slide indicators clickable
                $("#"+ options.slideTrackerID +" ul li").click(function(){
                    if(!($(this).hasClass("active")))
                        obj.nextSlide($(this).data('index'));
                });
            }

            // Start the slider interval if enabled in options
            if(options.slideOnInterval){
                setSliderInterval();
            }

            // Change the cursor with a grabbing hand that simulates the swiping on desktops
            if(options.swipe && jQuery().swipe){
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

                // Add the swipe actions to the container
                $(options.slidesContainer).swipe({
                    swipeLeft: function(){
                        obj.nextSlide();
                    },
                    swipeRight: function(){
                        obj.prevSlide();
                    }
                });
            }
            else if(!jQuery().swipe && options.swipe === true){
                console.warn("Duo the missing TouchSwipe.js swipe has been disabled.");
            }
        }();

        // Bind the function that recalculates the width of each slide on a resize.
        $(window).resize(function(){
            $(options.slidesContainer).find(options.slides).each(function(index){
                // Reset width; otherwise it will keep the same width as before
                $(this).css('width','');
                $(this).css({x: index*100+'%',width: $(this).outerWidth()});
            });
        });

        // Controller of the interval
        function setSliderInterval(){
            clearInterval(sliderInterval);
            sliderInterval = setInterval(function(){
                obj.nextSlide();
            },options.interval);
        };

        // Go to a previous slide (calls the nextslide function with the new slide number
        obj.prevSlide = function(){
            var slide = (obj.currentSlide > 0) ? obj.currentSlide -= 1 : (obj.totalSlides - 1);
            obj.nextSlide(slide);
        };

        // Go to a next slide (function is also used for the previous slide and goto slide functions).
        // If a paramater is given it will go to the given slide
        obj.nextSlide = function(slide){
            // Cache the previous slide number and set slided to false
            var prevSlide = obj.currentSlide,
                slided = false;

            if(slide === undefined)
                obj.currentSlide = (obj.currentSlide < (obj.totalSlides-1)) ? obj.currentSlide += 1 : 0 ;
            else
                obj.currentSlide = slide;

            // Create trigger point before a slide slides. Trigger wil return the prev and coming slide number
            $(element).trigger({
                type: "beforeSliding",
                prevSlide: prevSlide,
                newSlide: obj.currentSlide
            });

            // Slide animation, here we determine if we can use CSS transitions (transit.js) or have to use jQuery animate
            $(options.slidesContainer).find(options.slides).each(function(index){
                if ($.support.transition && jQuery().transition)
                    $(this).stop().transition({x: ($(this).data('index')-obj.currentSlide)*100+'%'}, options.animateDuration, options.animationEasing);
                else
                    $(this).stop().animate({left: ($(this).data('index')-obj.currentSlide)*100+'%'}, options.animateDuration, triggerSlideEnd);
            });

            // Somehow the callback from $.transition doesn't work, so we create ow custom bind here
            $(options.slidesContainer).on('oTransitionEnd webkitTransitionEnd oTransitionEnd otransitionend transitionend', triggerSlideEnd);

            // Create trigger point after a slide slides. All the slides return a TransitionEnd; to prevent a repeating trigger we keep a slided var
            function triggerSlideEnd(){
                if(!slided){
                    $(element).trigger({
                        type: "afterSliding",
                        prevSlide: prevSlide,
                        newSlide: obj.currentSlide
                    });
                    slided = true;
                }
            }

            // Show current slide bulb
            $('#'+ options.slideTrackerID +' ul li').removeClass('active');
            $('#'+ options.slideTrackerID +' ul li[data-index="'+obj.currentSlide+'"]').addClass('active');

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
    }
})(jQuery);
