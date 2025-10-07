$(document).ready(function () {
  if ($("#quotes-carousel").length) {
    loadQuotes();
  }

  if ($("#videos-carousel").length) {
    loadVideos();
  }

  $('a[href^="#"]').on("click", function (event) {
    if ($($(this).attr("href")).length) {
      event.preventDefault();
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $($(this).attr("href")).offset().top,
          },
          1000
        );
    }
  });
});

// Show or hide the loader.
function toggleLoader(show, section) {
  const $loader = section ? $(section).find(".loader") : $(".loader");

  if (show) {
    $loader.show();
  } else {
    $loader.hide();
  }
}

// CReation of the item
function createQuoteItem(quote, index) {
  return $('<div class="carousel-item">')
    .addClass(index === 0 ? "active" : "")
    .append(
      $('<div class="row mx-auto align-items-center">')
        .append(
          $(
            '<div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">'
          ).append(
            $('<img class="d-block align-self-center">')
              .attr("src", quote.pic_url)
              .attr("alt", quote.name)
          )
        )
        .append(
          $(
            '<div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">'
          ).append(
            $('<div class="quote-text">')
              .append(
                $('<p class="text-white">').text("« " + quote.text + " »")
              )
              .append(
                $('<h4 class="text-white font-weight-bold">').text(quote.name)
              )
              .append($('<span class="text-white">').text(quote.title))
          )
        )
    );
}

// Fecth quotes from URL
function loadQuotes() {
  toggleLoader(true, ".quotes");

  $("#carouselExampleControls").fadeOut(300);

  $.ajax({
    url: "https://smileschool-api.hbtn.info/quotes",
    method: "GET",
    dataType: "json",
    beforeSend: function () {
      $("#quotes-carousel").empty();
    },
  })
    .done(function (data) {
      $.each(data, function (index, quote) {
        $("#quotes-carousel").append(createQuoteItem(quote, index));
      });

      toggleLoader(false, ".quotes");
      $("#carouselExampleControls").fadeIn(300);
    })
    .fail(function () {
      $("#quotes-carousel")
        .empty()
        .append(
          $('<div class="text-white text-center p-5">').text(
            "Error while loading quotes"
          )
        );

      toggleLoader(false, ".quotes");
      $("#carouselExampleControls").fadeIn(300);
    });
}

// creation of the rating system with stars
function importStars(rating) {
  const $stars = $("<div>");
  for (let i = 0; i < 5; i++) {
    $stars.append(
      $("<img>")
        .attr("src", i < rating ? "images/star_on.png" : "images/star_off.png")
        .attr("alt", "star")
        .attr("width", "15px")
    );
  }
  return $stars;
}

// Create video card item
function createVideoCard(video) {
  return $("<div>")
    .addClass(
      "col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center"
    )
    .append(
      $("<div>")
        .addClass("card")
        .append(
          $("<img>")
            .addClass("card-img-top")
            .attr("src", video.thumb_url)
            .attr("alt", "Video thumbnail")
        )
        .append(
          $("<div>")
            .addClass("card-img-overlay text-center")
            .append(
              $("<img>")
                .addClass("align-self-center play-overlay")
                .attr("src", "images/play.png")
                .attr("alt", "Play")
                .attr("width", "64px")
            )
        )
        .append(
          $("<div>")
            .addClass("card-body")
            .append(
              $("<h5>")
                .addClass("card-title font-weight-bold")
                .text(video.title)
            )
            .append(
              $("<p>").addClass("card-text text-muted").text(video["sub-title"])
            )
            .append(
              $("<div>")
                .addClass("creator d-flex align-items-center")
                .append(
                  $("<img>")
                    .addClass("rounded-circle")
                    .attr("src", video.author_pic_url)
                    .attr("alt", "Creator of Video")
                    .attr("width", "30px")
                )
                .append(
                  $("<h6>").addClass("pl-3 m-0 main-color").text(video.author)
                )
            )
            .append(
              $("<div>")
                .addClass("info pt-3 d-flex justify-content-between")
                .append(
                  $("<div>").addClass("rating").append(importStars(video.star))
                )
                .append($("<span>").addClass("main-color").text(video.duration))
            )
        )
    );
}

//  fetch Videos from URL
function loadVideos() {
  toggleLoader(true, ".popular");

  $("#carouselExampleControls2").fadeOut(300);

  $.ajax({
    url: "https://smileschool-api.hbtn.info/popular-tutorials",
    method: "GET",
    dataType: "json",
    beforeSend: function () {
      $("#videos-carousel").empty();
    },
  })
    .done(function (data) {
      var $carouselItem = $("<div>").addClass("carousel-item active");
      var $track = $("<div>")
        .addClass("carousel-track")
        .attr("id", "videos-track");

      $.each(data, function (_index, video) {
        var $videoCard = createVideoCard(video)
          .removeClass("col-12 col-sm-6 col-md-6 col-lg-3")
          .addClass("carousel-video-item");
        $track.append($videoCard);
      });

      // Duplicate first 3 videos at the end for smooth infinite loop
      for (var i = 0; i < 3; i++) {
        var $videoCard = createVideoCard(data[i])
          .removeClass("col-12 col-sm-6 col-md-6 col-lg-3")
          .addClass("carousel-video-item carousel-clone");
        $track.append($videoCard);
      }

      $carouselItem.append($track);
      $("#videos-carousel").append($carouselItem);

      initVideoCarousel(data.length);

      toggleLoader(false, ".popular");
      $("#carouselExampleControls2").fadeIn(300);
    })
    .fail(function () {
      $("#videos-carousel")
        .empty()
        .append(
          $('<div class="text-white text-center p-5">').text(
            "Error while loading videos"
          )
        );

      toggleLoader(false, ".popular");
      $("#carouselExampleControls2").fadeIn(300);
    });
}

// Initialize custom carousel navigation for videos
function initVideoCarousel(totalVideos) {
  var $track = $("#videos-track");
  var $items = $track.find(".carousel-video-item");

  if ($items.length === 0) return;

  var currentIndex = 0;

  var getItemWidth = function () {
    var item = $items[0];
    var rect = item.getBoundingClientRect();
    var style = window.getComputedStyle(item);
    var marginRight = parseFloat(style.marginRight);
    return rect.width + marginRight;
  };

  var updateCarousel = function (animate) {
    var itemWidth = getItemWidth();
    var offset = currentIndex * itemWidth;

    if (animate === false) {
      $track.css("transition", "none");
      $track.css("transform", "translateX(-" + offset + "px)");
      // Force reflow
      $track[0].offsetHeight;
      $track.css("transition", "transform 0.4s ease-in-out");
    } else {
      $track.css("transform", "translateX(-" + offset + "px)");
    }
  };

  $("#carouselExampleControls2 .carousel-control-prev")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      currentIndex--;

      if (currentIndex < 0) {
        currentIndex = totalVideos - 1;
        updateCarousel(false);
        return;
      }

      updateCarousel(true);
    });

  $("#carouselExampleControls2 .carousel-control-next")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      currentIndex++;
      updateCarousel(true);

      if (currentIndex >= totalVideos) {
        setTimeout(function () {
          currentIndex = 0;
          updateCarousel(false);
        }, 400);
      }
    });

  updateCarousel(false);

  $(window).on("resize", function () {
    updateCarousel(false);
  });
}
