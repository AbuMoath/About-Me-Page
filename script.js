/*
Massively by HTML5 UP
Adapted for Khaled Qamhan Portfolio
*/

(function() {

"use strict";

var $body = document.querySelector('body');

// Play initial animations on page load.
window.addEventListener('load', function() {
window.setTimeout(function() {
$body.classList.remove('is-preload');
}, 100);
});

// Scrolly links
var $scrolly = document.querySelectorAll('.scrolly');

if ($scrolly.length > 0) {
$scrolly.forEach(function(element) {
element.addEventListener('click', function(e) {
var href = element.getAttribute('href');

if (href.charAt(0) == '#' && href.length > 1) {
var $target = document.querySelector(href);

if ($target) {
var pos = $target.offsetTop;
e.preventDefault();
window.scrollTo({
top: pos,
behavior: 'smooth'
});
}
}
});
});
}

// Nav
var $nav = document.querySelector('#nav'),
$nav_a = $nav ? $nav.querySelectorAll('a') : [];

// Link scroll
$nav_a.forEach(function(element) {
element.addEventListener('click', function(e) {
var href = this.getAttribute('href');

if (href.charAt(0) == '#' && href.length > 1 && document.querySelector(href)) {
var $target = document.querySelector(href);
e.preventDefault();

// Deactivate all links
$nav_a.forEach(function(link) {
link.parentElement.classList.remove('active');
});

// Activate link
element.parentElement.classList.add('active');

// Scroll
window.scrollTo({
top: $target.offsetTop,
behavior: 'smooth'
});
}
});
});

// Scroll tracking for nav
var sections = document.querySelectorAll('#main > .post, #main > .posts');

if (sections.length > 0 && $nav) {
window.addEventListener('scroll', function() {
var scrollPos = window.pageYOffset || document.documentElement.scrollTop;

sections.forEach(function(section) {
var top = section.offsetTop - 150;
var bottom = top + section.offsetHeight;

if (scrollPos >= top && scrollPos < bottom) {
var id = section.getAttribute('id');

if (id) {
$nav_a.forEach(function(link) {
link.parentElement.classList.remove('active');

if (link.getAttribute('href') == '#' + id) {
link.parentElement.classList.add('active');
}
});
}
}
});
});
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
var href = this.getAttribute('href');
if (href.charAt(0) == '#' && href.length > 1) {
var target = document.querySelector(href);
if (target) {
e.preventDefault();
window.scrollTo({
top: target.offsetTop,
behavior: 'smooth'
});
}
}
});
});

// Replay intro animation on click
var $intro = document.querySelector('#intro');
var clickCount = 0;
if ($intro) {
$intro.addEventListener('click', function() {
clickCount++;

if (clickCount > 3) {
alert('I think you need to stop now (:');
return;
}

// Remove animations
$intro.style.animation = 'none';
var introElements = $intro.querySelectorAll('h1, p, .button');
introElements.forEach(function(el) {
el.style.animation = 'none';
});
var introBefore = window.getComputedStyle($intro, '::before');
$intro.classList.add('replay-animation');
    
// Force reflow
void $intro.offsetWidth;
    
// Re-add animations
setTimeout(function() {
$intro.style.animation = '';
introElements.forEach(function(el) {
el.style.animation = '';
});
$intro.classList.remove('replay-animation');
}, 10);
});
}

// Scroll animations for all elements
function revealOnScroll() {
    var reveals = document.querySelectorAll('.post, .posts article, #footer section, #header');
    
    reveals.forEach(function(element) {
        var windowHeight = window.innerHeight;
        var elementTop = element.getBoundingClientRect().top;
        var elementVisible = 100;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('reveal-active');
        }
    });
}

// Intro scroll effect - fade out text as you scroll down, show continue button
function introScrollEffect() {
    var $intro = document.querySelector('#intro');
    var $continueBtn = document.querySelector('#continue-button');
    var $introArrow = document.querySelector('.intro-arrow');
    var scrollPos = window.pageYOffset || document.documentElement.scrollTop;
    var windowHeight = window.innerHeight;
    
    // Show continue button when scrolled down, hide arrow and text
    if ($continueBtn && $introArrow && $intro) {
        var introHeading = $intro.querySelector('h1');
        var introParagraph = $intro.querySelector('p');
        
        if (scrollPos > 100) {
            $continueBtn.classList.add('show');
            $introArrow.classList.add('hide');
            if (introHeading) introHeading.classList.add('hide');
            if (introParagraph) introParagraph.classList.add('hide');
        } else {
            $continueBtn.classList.remove('show');
            $introArrow.classList.remove('hide');
            if (introHeading) introHeading.classList.remove('hide');
            if (introParagraph) introParagraph.classList.remove('hide');
        }
    }
}

// Smooth scroll when clicking intro arrow
var $introArrow = document.querySelector('#intro-scroll-btn');
if ($introArrow) {
    $introArrow.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: window.innerHeight * 0.3,
            behavior: 'smooth'
        });
    });
}

window.addEventListener('scroll', function() {
    revealOnScroll();
    introScrollEffect();
});
window.addEventListener('load', revealOnScroll);

})();
