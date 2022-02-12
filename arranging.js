$(document).ready(function () {
  var formDict = {
    0: "我",
    1: "打算",
    2: "在",
    3: "一年",
    4: "之内",
    5: "读完",
    6: "十本书。",
  };

  var choices = Object.values(formDict);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  shuffleArray(choices);

  // choice box
  choices.forEach((item) => {
    let choice = `
    <div class="col-6 col-sm-4 col-lg-1 choices my-1">
      <div class="drop_container drop_box border border-dark border-1 rounded mx-auto" style="background-color: darkgrey">
        <p class="mb-0 btn btn-dark drop_box draggable_item d-flex align-items-center justify-content-center char-font-size">${item}</p>
      </div> 
    </div>
    `;

    $("#character-box").append(choice);
  });

  // Fill in boxes
  for (let i = 0; i < Object.keys(formDict).length + 1; i++) {
    if (i + 1 < Object.keys(formDict).length + 1) {
      let col = `
      <div class="col-6 col-sm-4 col-lg-1 text-center answers mb-2 " id="q${i}-container">
        <p class="mb-0 drop_box index-font-size " style="height: 22px !important">${
          i + 1
        }</p>
        <div class="drop_container drop_box border border-dark border-1 rounded "></div>
      </div>
      `;

      $("#content").append(col);
    }
  }

  $(".draggable_item").draggable({
    revert: "invalid",
    stack: ".draggable_item",
  });

  $(".drop_container").droppable({
    accept: function () {
      if ($(this).find(".draggable_item").length == 0) return true;
    },
    drop: function (event, ui) {
      ui.draggable
        .appendTo($(this))
        .position({ of: $(this), my: "center", at: "center" });
    },
  });

  //auto move item from answer box back to choices list
  $("#content-container").on(
    "click",
    ".answers > .drop_container > .draggable_item",
    function () {
      var draggableitem = $(this);
      $(".choices > .drop_container").each(function () {
        if ($(this).find(".draggable_item").length == 0) {
          draggableitem.appendTo($(this));
          return false; // return false to break out of each function
        }
      });
    }
  );

  var sec = 0;

  function convert(val) {
    return val > 9 ? val : "0" + val;
  }

  var timer = setInterval(function () {
    $("#seconds").text(convert(++sec % 60));
    $("#minutes").text(convert(parseInt(sec / 60, 10)));
  }, 1000);

  $(document).on("click", "#reload", function () {
    location.reload();
  });

  var score = 0;

  $("#check").click(function () {
    clearInterval(timer);
    $("#check").replaceWith(
      '<button type="button" class="btn btn-primary btn-lg" id="reload">Redo</button>'
    );

    $(".draggable_item").css({
      opacity: 0.6,
      "pointer-events": "none",
    });

    let isCorrect = true;
    // Check if it is unscrambled correctly
    $(".answers").each(function (index) {
      let curr = $(this).find(".draggable_item").html();
      if (curr !== formDict[index]) {
        isCorrect = false;
      }
    });

    // If it is unscrammbled correct, show the checkmark and add 10 points to the score, else show the x mark.
    if (isCorrect === false) {
      $(`#answer`).append(
        '<p style="color:red; font-size:1.5em; height: 22px !important">&#10008;</p>'
      );
    } else {
      $(`#answer`).append(
        '<p style="color:blue; font-size:1.5em; height: 22px !important">&#10004;</p>'
      );
      $(`.sentInfo`).append(
        "<p> Chinese sentence: 我打算在一年之內讀完十本書。</p>"
      );

      score += 10;
    }

    $("#score").text(`Score: ${score > 100 ? 100 : Math.ceil(score)}`);
  });
});
