
var btn = $('#backToTopButton');
var navbar = $('#header');


$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
    navbar.addClass('translucent');
  } else {
    btn.removeClass('show');
    navbar.removeClass('translucent');
  }
});
$(window).scroll(function() {
  if ($(window).scrollTop() > 300) {
    btn.addClass('show');
  } else {
    btn.removeClass('show');
  }
});


btn.on('click', function(e) {
  e.preventDefault();
  $('html, body').animate({scrollTop:0}, '300');
});


function scrollFunction(elementId) {
    const element = document.getElementById(elementId);
    element.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
  }






function toggleMenu(){
  var x = document.getElementById("navbar");
  if (x.classList.contains('active')) {
    x.classList.remove('active');
  } else {
    x.classList.add('active');
  }
}

function underLine(element,elementId){
  console.log(element);
  const x = element.querySelector(elementId);
  x.classList.add('underline-right-hover');
}

function removeUnderLine(element,elementId){
  const x = element.querySelector(elementId);
  x.classList.remove('underline-right-hover');
}


$('#closeI').on('click', function(){toggleMenu()});

$('#menuIcon').on('click', function(){toggleMenu()});

