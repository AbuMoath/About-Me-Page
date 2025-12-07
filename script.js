/*
Massively by HTML5 UP
Adapted for Khaled Qamhan Portfolio
*/

(function() {

"use strict";

var$body = document.querySelector('body');

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

})();
