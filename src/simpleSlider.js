/*
    Version 2.0
    Simple jQuery Slider is just what is says it is: a simple but powerfull jQuery slider.
    Copyright (C) 2013 - Dirk Groenen [Bitlabs Development]

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var simpleSlider = function(useroptions){
    // Set some variables
    var obj = this,
        sliderInterval = null;
    obj.currentSlide = 0;
    obj.totalSlides = 0;

    // Extend default options with user options
    useroptions = (useroptions === undefined) ? {} : useroptions;
    var options = $.extend({
        slidesContainer: '.slider',
        slides: '.slide',
        slideTracker: true,
        slideTrackerID: 'slideposition',
        slideOnInterval: true,
        interval: 5000,
        swipe: true,
        animateDuration: 1000,
        animationEasing: 'ease',
        pauseOnHover: false
    }, useroptions);

    // Init the slider
    obj.init = function(){
        // Find the slides in the sliderdom and add the index attribute
        $(options.slidesContainer).find(options.slides).each(function(index){
            // Give each slide a data-index so we can control it later on
            $(this).attr('data-index', index);

             // A fixed width is needed for the IE left animation. Here we give each slide a width
            $(this).css({
                x: index*100+'%',
                width: $(this).outerWidth()
            });
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
    };

    // Bind the function that recalculates the width of each slide on a resize.
    $(window).resize(function(){
        $(options.slidesContainer).find(options.slides).each(function(index){
            // Reset width to auto; otherwise it will keep the same width as before
            $(this).css('width','auto');
            $(this).css({x: index*100+'%',width: $(this).outerWidth()});
        });
    });

    // Controller of the interval
    var setSliderInterval = function(){
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
        if(slide === undefined)
            obj.currentSlide = (obj.currentSlide < (obj.totalSlides-1)) ? obj.currentSlide += 1 : 0 ;
        else
            obj.currentSlide = slide;

        // Slide animation, here we determine if we can use CSS transitions (transit.js) or have to use jQuery animate
        $(options.slidesContainer).find(options.slides).each(function(index){
            if ($.support.transition && jQuery().transition)
                $(this).stop().transition({x: ($(this).data('index')-obj.currentSlide)*100+'%'}, options.animateDuration, options.animationEasing);
            else
                $(this).stop().animate({left: ($(this).data('index')-obj.currentSlide)*100+'%'}, options.animateDuration);
        });

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
}
