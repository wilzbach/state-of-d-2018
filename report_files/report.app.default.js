$.extend($.easing, {
  easeOutCubic: function(x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
  },
  easeInCubic: function(x, t, b, c, d) {
    return c * (t /= d) * t * t + b;
  }
});

$(function() {

	// Init classes
	utils = new Report.Utils();
	bar = new Report.Bar();

	//init infographics
	bar.initBar(".InfographicBar");
	bar.initRating(".InfographicBarRating");
	
	//init events
	bar.bindEvents();
	utils.bindEvents();

	//set background color
	utils.setContainerColor(utils.getCssValue("backgroundColor", "background-color"), utils.getCssValue("secondaryColor", "color"));

	//get element reports
	$elem = $("#report-questions");

	//define marginTop 
	windowHeight = $(window).height();
	$elem.css({
        marginTop: windowHeight / 2 - 50,
        marginBottom: windowHeight / 2 + 60
    });

	//init scroll
	scroll = new Report.Scroll($elem, {
        onFocus: function(elem) {
        	if($(".image img",elem).length > 0) { $(".image img",elem).lazyload(); }
            if($(".attachment img",elem).length > 0) { $(".attachment img",elem).lazyload(); }
        }
	});
	scroll.refresh(true);
	scroll.bindEvents();
	scroll.start();
	scroll.scrollTo(0);

	//resize window
	$(window).resize(function() {
		utils.resize();
	});

	//hide loading icon
	jQuery(document).ready(function($) {
		$('#loader').hide();
	});
	
});
