// Initialize page: load carousels and setup smooth scrolling
$(function () {
  $("#quotes-carousel").length && loadQuotes();
  $("#videos-carousel").length && loadVideos();
  $("#latest-videos-carousel").length && loadLatestVideos();
  $(".results .row").length && $(".search").length && loadCourses();

  $('a[href^="#"]').on("click", function (e) {
    var $target = $($(this).attr("href"));
    $target.length &&
      (e.preventDefault(),
      $("html, body")
        .stop()
        .animate({ scrollTop: $target.offset().top }, 1000));
  });
});

// Toggle loader visibility
function toggleLoader(show, section) {
  (section ? $(section).find(".loader") : $(".loader")).toggle(show);
}

// Fetch JSON data from API
function fetchData(url) {
  return $.get(url);
}

// Create quote carousel item
function createQuoteItem(quote, index) {
  return $(`<div class="carousel-item ${!index ? "active" : ""}">
    <div class="row mx-auto align-items-center">
      <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
        <img class="d-block align-self-center" src="${quote.pic_url}" alt="${
    quote.name
  }">
      </div>
      <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
        <div class="quote-text">
          <p class="text-white">« ${quote.text} »</p>
          <h4 class="text-white font-weight-bold">${quote.name}</h4>
          <span class="text-white">${quote.title}</span>
        </div>
      </div>
    </div>
  </div>`);
}

// Load quotes from API
function loadQuotes() {
  toggleLoader(true, ".quotes");
  $("#carouselExampleControls").fadeOut(300);
  fetchData("https://smileschool-api.hbtn.info/quotes")
    .done((data) => {
      var $carousel = $("#quotes-carousel").empty();
      $.each(data, (i, q) => $carousel.append(createQuoteItem(q, i)));
      toggleLoader(false, ".quotes");
      $("#carouselExampleControls").fadeIn(300);
    })
    .fail(() => {
      $("#quotes-carousel")
        .empty()
        .append(
          $(
            '<div class="text-white text-center p-5">Error while loading quotes</div>'
          )
        );
      toggleLoader(false, ".quotes");
      $("#carouselExampleControls").fadeIn(300);
    });
}

// Generate star rating (0-5 stars)
function importStars(rating) {
  return $(
    "<div>" +
      Array.from(
        { length: 5 },
        (_, i) =>
          `<img src="${
            i < rating ? "images/star_on.png" : "images/star_off.png"
          }" alt="star" width="15px">`
      ).join("") +
      "</div>"
  );
}

// Create video card
function createVideoCard(video) {
  return $(`<div class="col-12 col-sm-6 col-md-6 col-lg-3 d-flex justify-content-center justify-content-md-end justify-content-lg-center">
    <div class="card">
      <img class="card-img-top" src="${video.thumb_url}" alt="Video thumbnail">
      <div class="card-img-overlay text-center">
        <img class="align-self-center play-overlay" src="images/play.png" alt="Play" width="64px">
      </div>
      <div class="card-body">
        <h5 class="card-title font-weight-bold">${video.title}</h5>
        <p class="card-text text-muted">${video["sub-title"]}</p>
        <div class="creator d-flex align-items-center">
          <img class="rounded-circle" src="${
            video.author_pic_url
          }" alt="Creator of Video" width="30px">
          <h6 class="pl-3 m-0 main-color">${video.author}</h6>
        </div>
        <div class="info pt-3 d-flex justify-content-between">
          <div class="rating">${importStars(video.star).html()}</div>
          <span class="main-color">${video.duration}</span>
        </div>
      </div>
    </div>
  </div>`);
}

// Load video carousel with infinite loop
function loadVideoCarousel(config) {
  toggleLoader(true, config.section);
  $(config.carouselId).fadeOut(300);
  fetchData(config.url)
    .done((data) => {
      var $track = $(`<div class="carousel-track" id="${config.trackId}">`);
      $.each(data, (_, v) =>
        $track.append(
          createVideoCard(v)
            .removeClass("col-12 col-sm-6 col-md-6 col-lg-3")
            .addClass("carousel-video-item")
        )
      );
      for (var i = 0; i < 3; i++)
        $track.append(
          createVideoCard(data[i])
            .removeClass("col-12 col-sm-6 col-md-6 col-lg-3")
            .addClass("carousel-video-item carousel-clone")
        );
      $(config.carouselContainerId)
        .empty()
        .append($('<div class="carousel-item active">').append($track));
      initVideoCarouselGeneric(config.trackId, config.carouselId, data.length);
      toggleLoader(false, config.section);
      $(config.carouselId).fadeIn(300);
    })
    .fail(() => {
      $(config.carouselContainerId)
        .empty()
        .append(
          $(
            `<div class="text-white text-center p-5">${config.errorMessage}</div>`
          )
        );
      toggleLoader(false, config.section);
      $(config.carouselId).fadeIn(300);
    });
}

// Initialize carousel navigation
function initVideoCarouselGeneric(trackId, carouselId, totalVideos) {
  var $track = $("#" + trackId),
    $items = $track.find(".carousel-video-item"),
    currentIndex = 0;
  if (!$items.length) return;

  var getItemWidth = () =>
    $items[0].getBoundingClientRect().width +
    parseFloat(window.getComputedStyle($items[0]).marginRight);
  var updateCarousel = (animate) => {
    var offset = currentIndex * getItemWidth();
    if (!animate) {
      $track.css({
        transition: "none",
        transform: "translateX(-" + offset + "px)",
      });
      $track[0].offsetHeight;
      $track.css("transition", "transform 0.4s ease-in-out");
    } else $track.css("transform", "translateX(-" + offset + "px)");
  };

  $(carouselId + " .carousel-control-prev")
    .off("click")
    .on("click", (e) => {
      e.preventDefault();
      currentIndex--;
      if (currentIndex < 0) {
        currentIndex = totalVideos - 1;
        updateCarousel(false);
        return;
      }
      updateCarousel(true);
    });

  $(carouselId + " .carousel-control-next")
    .off("click")
    .on("click", (e) => {
      e.preventDefault();
      currentIndex++;
      updateCarousel(true);
      currentIndex >= totalVideos &&
        setTimeout(() => {
          currentIndex = 0;
          updateCarousel(false);
        }, 400);
    });

  updateCarousel(false);
  $(window).on("resize", () => updateCarousel(false));
}

// Load popular tutorials carousel
function loadVideos() {
  loadVideoCarousel({
    url: "https://smileschool-api.hbtn.info/popular-tutorials",
    section: ".popular",
    carouselId: "#carouselExampleControls2",
    carouselContainerId: "#videos-carousel",
    trackId: "videos-track",
    errorMessage: "Error while loading videos",
  });
}

// Load latest videos carousel
function loadLatestVideos() {
  loadVideoCarousel({
    url: "https://smileschool-api.hbtn.info/latest-videos",
    section: ".popular",
    carouselId: "#carouselExampleControls3",
    carouselContainerId: "#latest-videos-carousel",
    trackId: "latest-videos-track",
    errorMessage: "Error while loading videos",
  });
}

// Load courses with filters
function loadCourses(q = "", topic = "", sort = "") {
  toggleLoader(true, ".results");
  fetchData(
    "https://smileschool-api.hbtn.info/courses?q=" +
      encodeURIComponent(q) +
      "&topic=" +
      encodeURIComponent(topic) +
      "&sort=" +
      encodeURIComponent(sort)
  )
    .done((data) => {
      populateDropdowns(data.topics, data.sorts, data.topic, data.sort);
      displayCourses(data.courses);
      $(".search-text-area").val(data.q);
      $(".video-count").text(
        data.courses.length + " video" + (data.courses.length > 1 ? "s" : "")
      );
      toggleLoader(false, ".results");
    })
    .fail(() => {
      $(".results .row")
        .empty()
        .append($('<div class="text-center p-5">Error loading courses</div>'));
      toggleLoader(false, ".results");
    });
}

// Track current filter values globally
var currentFilters = { topic: "", sort: "" };

// Populate dropdowns dynamically
function populateDropdowns(topics, sorts, selectedTopic, selectedSort) {
  var capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  var formatSort = (s) => s.split("_").map(capitalize).join(" ");

  currentFilters.topic = selectedTopic;
  currentFilters.sort = selectedSort;

  $(".box2 .dropdown-menu")
    .empty()
    .append(
      topics.map(
        (t) => `<a class="dropdown-item" data-value="${t}">${capitalize(t)}</a>`
      )
    );
  $(".box3 .dropdown-menu")
    .empty()
    .append(
      sorts.map(
        (s) => `<a class="dropdown-item" data-value="${s}">${formatSort(s)}</a>`
      )
    );

  $(".box2 .dropdown-toggle span").text(capitalize(selectedTopic));
  $(".box3 .dropdown-toggle span").text(formatSort(selectedSort));

  $(".box2 .dropdown-item")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      currentFilters.topic = $(this).attr("data-value");
      $(".box2 .dropdown-toggle span").text($(this).text());
      loadCourses(
        $(".search-text-area").val(),
        currentFilters.topic,
        currentFilters.sort
      );
    });

  $(".box3 .dropdown-item")
    .off("click")
    .on("click", function (e) {
      e.preventDefault();
      currentFilters.sort = $(this).attr("data-value");
      $(".box3 .dropdown-toggle span").text($(this).text());
      loadCourses(
        $(".search-text-area").val(),
        currentFilters.topic,
        currentFilters.sort
      );
    });

  $(".search-text-area")
    .off("input")
    .on("input", function () {
      loadCourses($(this).val(), currentFilters.topic, currentFilters.sort);
    });
}

// Display courses
function displayCourses(courses) {
  var $container = $(".results .row").empty();
  $.each(courses, (_, c) =>
    $container.append(createVideoCard(c).removeClass("carousel-video-item"))
  );
}
