$(document).ready(function () {
  if ($("#quotes-carousel").length) {
    loadQuotes();
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

// Show circle loader
function toggleLoader(show, section) {
  section = section || ".quotes";
  $(section).find(".loader").toggle(show);
}

// CRation of the item
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
  toggleLoader(true);

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

      toggleLoader(false);
      $("#carouselExampleControls").fadeIn(300);
    })
    .fail(function (xhr, status, error) {
      console.error("Loading Error", error);

      $("#quotes-carousel")
        .empty()
        .append(
          $('<div class="text-white text-center p-5">').text(
            "Erreur lors du chargement des citations"
          )
        );

      toggleLoader(false);
      $("#carouselExampleControls").fadeIn(300);
    });
}
