/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

$(document).ready(function () {
	'use strict';

	// navbarDropdown
	if ($(window).width() < 992) {
		$('.navigation .dropdown-toggle').on('click', function () {
			$(this).siblings('.dropdown-menu').animate({
				height: 'toggle'
			}, 300);
		});
	}

	$(window).on('scroll', function () {
		//.Scroll to top show/hide
		if ($('#scroll-to-top').length) {
			var scrollToTop = $('#scroll-to-top'),
				scroll = $(window).scrollTop();
			if (scroll >= 200) {
				scrollToTop.fadeIn(200);
			} else {
				scrollToTop.fadeOut(100);
			}
		}
		// Condense the navbar once the page scrolls past the hero
		$('.navigation').toggleClass('scrolled', $(window).scrollTop() > 40);
	});
	// scroll-to-top
	if ($('#scroll-to-top').length) {
		$('#scroll-to-top').on('click', function () {
			$('body,html').animate({
				scrollTop: 0
			}, 600);
			return false;
		});
	}

	// Shuffle js filter and masonry
	var containerEl = document.querySelector('.shuffle-wrapper');
	if (containerEl) {
		var Shuffle = window.Shuffle;
		var myShuffle = new Shuffle(document.querySelector('.shuffle-wrapper'), {
			itemSelector: '.shuffle-item',
			buffer: 1
		});

		jQuery('input[name="shuffle-filter"]').on('change', function (evt) {
			var input = evt.currentTarget;
			if (input.checked) {
				myShuffle.filter(input.value);
			}
		});
	}

	$('.portfolio-single-slider').slick({
		infinite: true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 2000
	});

	$('.clients-logo').slick({
		infinite: true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 2000
	});

	$('.testimonial-slider').slick({
		slidesToShow: 1,
		infinite: true,
		arrows: false,
		autoplay: true,
		autoplaySpeed: 2000
	});


	// CountDown JS
	var countDownEl = $('.count-down');
	if (countDownEl) {
		$('.count-down').syotimer({
			year: 2021,
			month: 5,
			day: 9,
			hour: 20,
			minute: 30
		});
	}

	// Magnific Popup Image
	$('.portfolio-popup').magnificPopup({
		type: 'image',
		removalDelay: 160, //delay removal by X to allow out-animation
		callbacks: {
			beforeOpen: function () {
				// just a hack that adds mfp-anim class to markup
				this.st.image.markup = this.st.image.markup.replace('mfp-figure', 'mfp-figure mfp-with-anim');
				this.st.mainClass = this.st.el.attr('data-effect');
			}
		},
		closeOnContentClick: true,
		midClick: true,
		fixedContentPos: true,
		fixedBgPos: true
	});

	//  Count Up
	function counter() {
		var oTop;
		if ($('.count').length !== 0) {
			oTop = $('.count').offset().top - window.innerHeight;
		}
		if ($(window).scrollTop() > oTop) {
			$('.count').each(function () {
				var $this = $(this),
					countTo = $this.attr('data-count');
				$({
					countNum: $this.text()
				}).animate({
					countNum: countTo
				}, {
					duration: 1000,
					easing: 'swing',
					step: function () {
						$this.text(Math.floor(this.countNum));
					},
					complete: function () {
						$this.text(this.countNum);
					}
				});
			});
		}
	}
	$(window).on('scroll', function () {
		counter();
	});

	// Sync the navbar's condensed state on initial load (e.g. restored scroll position)
	$('.navigation').toggleClass('scrolled', $(window).scrollTop() > 40);

	// Scroll-reveal: fade/slide sections and staggered groups into view once
	if ('IntersectionObserver' in window) {
		var revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
		// On mobile, trigger as soon as a section's top crosses ~75% down the
		// viewport (i.e. after scrolling roughly a quarter-screen into it),
		// regardless of how tall the section is. Desktop keeps the original,
		// slightly later, area-based trigger.
		var isMobileReveal = $(window).width() < 768;
		var revealOptions = isMobileReveal
			? { threshold: 0, rootMargin: '0px 0px -25% 0px' }
			: { threshold: 0.15, rootMargin: '0px 0px -8% 0px' };
		var revealObserver = new IntersectionObserver(function (entries, observer) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('is-visible');
					observer.unobserve(entry.target);
				}
			});
		}, revealOptions);
		revealEls.forEach(function (el) {
			revealObserver.observe(el);
		});
	} else {
		$('.reveal, .reveal-stagger').addClass('is-visible');
	}

	// Live search/filter for the tool catalog on services.html
	var $toolSearch = $('#tool-search');
	if ($toolSearch.length) {
		var $categories = $('.category');
		var $noResults = $('#tool-search-no-results');
		var $listingHeadings = $('.listing-heading');
		$toolSearch.on('input', function () {
			var query = $(this).val().trim().toLowerCase();
			var anyVisible = false;
			$categories.each(function () {
				var $category = $(this);
				var $items = $category.find('.tool-list li, .flyer-list li');
				var categoryHasMatch = false;
				if (!$items.length) {
					return;
				}
				$items.each(function () {
					var matches = query === '' || $(this).text().toLowerCase().indexOf(query) !== -1;
					$(this).toggle(matches);
					if (matches) {
						categoryHasMatch = true;
					}
				});
				$category.toggle(categoryHasMatch);
				if (categoryHasMatch) {
					anyVisible = true;
				}
			});
			if ($noResults.length) {
				$noResults.toggle(query !== '' && !anyVisible);
			}
			// Hide the big "Service Listing" / "Tool Rental Listing" banners while
			// searching so results aren't pushed below the fold on mobile.
			$listingHeadings.toggle(query === '');
		});

		// Category chips: clear any active search first, then scroll to that section,
		// so a filtered-out section is never jumped to while still hidden.
		$('.category-chips a').on('click', function (e) {
			e.preventDefault();
			var targetId = $(this).attr('href');
			if ($toolSearch.val() !== '') {
				$toolSearch.val('').trigger('input');
			}
			var $target = $(targetId);
			if ($target.length) {
				var navHeight = $('.navigation').outerHeight() || 0;
				$('html, body').animate({
					scrollTop: $target.offset().top - navHeight - 16
				}, 400);
			}
		});
	}

});