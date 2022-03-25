$(document).ready(function () {
  var second = 0;

  function convert(val) {
    return val > 9 ? val : "0" + val;
  }
  var timer = setInterval(function () {
    $("#seconds").text(convert(++second % 60));
    $("#minutes").text(convert(parseInt(second / 60, 10)));
  }, 1000);

  function clearTimer() {
    clearInterval(timer);
  }
  
  $(document).on("click", "#reload", function () {
    location.reload();
  });
  //display simplified or traditional characters
  var traditonal;
  var lesson = $("#exercise_content").attr("class");

  function displayTradSimp() {
    if (localStorage.getItem("Simplifed") == "true") {
      traditional = false;
      $(".traditional").hide();
    } else {
      traditional = true;
      $(".simplified").hide();
    }
  }
  let dictionary = {};
  var totalSections = 0;
  var score = 0;
  var question = 0;
  var currentQuestion = 0;

  // total number of frequency in the lesson 
  var totalFreq = alphaDict[lesson].length;


  var allFreq = [];
  // Get the list of frequency in the lesson 
  for (const [index, frequency] of Object.entries(alphaDict[lesson])) {
    allFreq.push(frequency);
  }

  // shuffle the frequency array 
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]
      ];
    }

    return array;
  }

  shuffle(allFreq);
 // console.log(allFreq.length);

  if (allFreq.length > 10) {
    allFreq = allFreq.slice(0, 10);
  }
//  console.log(allFreq);

  //for (const [index, frequency] of Object.entries(alphaDict[lesson])) {

  for (let freq = 0; freq < allFreq.length; freq++) {
    var randomSent = Math.floor(Math.random() * sentEx[allFreq[freq]].length);

    // Removes the spaces
    const noSpacSimp = sentEx[allFreq[freq]][randomSent]["SimpSentence"].replace(/\s/g, "");
    const noSpacTrad = sentEx[allFreq[freq]][randomSent]["TradSentence"].replace(/\s/g, "");


    // Create an array which separate the punctuations
    var noPunSimp = noSpacSimp.split(/(?=[,?。，!-])|(?<=[,?。，!-])/g).map(function (sentence) {
      return sentence;
    });

    var noPunTrad = noSpacTrad.split(/(?=[,?。，!-])|(?<=[,?，。!-])/g).map(function (sentence) {
      return sentence;
    });

    // Create sentence sections 
    var SimpSec = [];
    var TradSec = [];

    for (let j = 0; j < noPunSimp.length; j++) {
      if (noPunSimp[j].length == 1) {
        SimpSec.push(noPunSimp[j]);
        TradSec.push(noPunTrad[j]);
      } else if (noPunSimp[j].length < 10) {
        var byThreeSimp = noPunSimp[j].match(/.{1,2}/g);
        var byThreeTrad = noPunTrad[j].match(/.{1,2}/g);
        SimpSec.push(byThreeSimp);
        TradSec.push(byThreeTrad);
      } else if (noPunSimp[j].length >=10) {
        var byFifthSimp = noPunSimp[j].match(/.{1,3}/g);
        var byFifthTrad = noPunTrad[j].match(/.{1,3}/g);
        SimpSec.push(byFifthSimp);
        TradSec.push(byFifthTrad);
      }
    }

    var sectionsSimp = []
    var sectionsTrad = []

    for (let k = 0; k < SimpSec.length; k++) {
      for (let l = 0; l < SimpSec[k].length; l++) {
        sectionsSimp.push(SimpSec[k][l]);
        sectionsTrad.push(TradSec[k][l]);
        totalSections++;
      }
      // subtract the punctuation
    }

    
   

    let sentDict = {};
    sentDict["SimpSentence"] = sectionsSimp;
    sentDict["TradSentence"] = sectionsTrad;
    sentDict["English"] = sentEx[allFreq[freq]][randomSent]["English"];

    dictionary[allFreq[freq]] = sentDict;

  }
  //console.log("this is dictionary")
  //console.log(dictionary)
  const duplicateDict = JSON.parse(JSON.stringify(dictionary));
//console.log( "this is dupdictionary")
//console.log(duplicateDict)



  var quiz_len = allFreq.length;
  //subtract the punctuation
totalSections = totalSections - quiz_len;
  shuffleSections();

  function shuffleSections() {
    for (let [freq, sentences] of Object.entries(duplicateDict)) {
      for (var i = sentences["TradSentence"].length - 2; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = sentences["TradSentence"][i];
        sentences["TradSentence"][i] = sentences["TradSentence"][j];
        sentences["TradSentence"][j] = temp;

        var temp2 = sentences["SimpSentence"][i];
        sentences["SimpSentence"][i] = sentences["SimpSentence"][j];
        sentences["SimpSentence"][j] = temp2;
      }
    }
  }

  
  //console.log( "this is dupdictionary")
//console.log(duplicateDict)

  $("#next").hide();
  createDragDrop();
  displayTradSimp();

  function createDragDrop() {

    for (const [frequency, sentences] of Object.entries(duplicateDict)) {

      var choices = `<div class="questions" id="${question}">`;

      //English sentence
      choices += `<h5 class="text-center sentInfo" style="color:#7e42a8">${sentences["English"]}</h5>`;

      //display check or x mark for user correctness
      //choices += `<div class="correctness text-center mb-3"></div>`;

      //boxes to drag choices
      choices += `
  <div class="mb-0 mb-lg-3 answer-container">
      <div class="row row-width mx-auto justify-content-center answer-container">
  `;

 

      for (const [index, section] of Object.entries(sentences["SimpSentence"])) {
        if (index == sentences["SimpSentence"].length-1){ 
      //  if ((section  === "。") || (section  === "?")){
        // console.log(index + " " + section )
        // console.log(sentences["SimpSentence"].length-1)
        choices += `
        <div class="col-3 col-sm-2 col-lg-1 text-center answers mb-2" id="q${index}-container">
        <div class> 
            <p class="mb-0 drop_box index-font-size" style="height: 22px !important"></p>
            <div class=" drop_box border font_kai char-font-size border-dark border-1 rounded mx-1" style="background-color:#c08ef3 !important; color:black!important; border-color:#8b62b5 !important;">${section}</div>
            </div>
        </div>
        `;
       } else {
        choices += `
        <div class="col-3 col-sm-2 col-lg-1 text-center answers mb-2" id="q${index}-container">
        <div class= "box-number"> 
            <p class="mb-0 drop_box index-font-size" style="height: 22px !important">${
            parseInt(index) + 1
            }</p>
            <div class="drop_container drop_box border border-dark border-1 rounded mx-1" style="border-color: #dac7e7!important;"></div>
            </div>
        </div>
       
        `;   

       }
        
      }

      choices += `</div>`;
   
      //draggable choices
      choices += ` <br></br>
    <div class="mb-0 mb-lg-3" id="content-container">
        <div class="row row-width mx-auto justify-content-center border border-dark border-2 rounded"id="character-box" style="border-color:#dac7e7 !important;">
    `;
      for (let index = 0; index < sentences["SimpSentence"].length; index++) {
        if (index != sentences["SimpSentence"].length-1){
          //console.log(sentences["SimpSentence"][index])
        choices += ` 
        <div class="col-3 col-sm-2 col-lg-1 choices my-1 rounded "> 
            <div class="drop_container drop_box rounded mx-auto" style="background-color: #ede3f3; border-radius: 0.25rem!important; border-color: #4c2766!important;" }>
                <div class="drop_box draggable_item">
                    <p class="simplified font_kai mb-0 btn btn-dark char-font-size border-1  w-100 h-100" style="background-color:#c08ef3 !important; color:black!important; border-color:#8b62b5 ;">${sentences["SimpSentence"][index]}</p>
                    <p class="traditional font_kai mb-0 btn btn-dark char-font-size border-1 w-100 h-100" style="background-color:#c08ef3 !important; color:black!important; border-color:#8b62b5 ;">${sentences["TradSentence"][index]}</p>
                </div>
            </div> 
        </div>`;
        }
      }

      choices += `</div></div></div>`;
      $("#exercise_content").append(choices);
      $(".count").html(
        `<h2 class="count" style="font-size: 1.6rem !important;">Question: ${currentQuestion+1}/${quiz_len}</h2>`
      )

      question++;

    }

    $(".questions").hide();
    $(`#${currentQuestion}`).show();
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
        .position({
          of: $(this),
          my: "center",
          at: "center"
        });
    },
  });


  $("#content-container").on(
    "click",
    ".answers > .drop_container > .draggable_item",
    function () {
      var draggableitem = $(this);
      $(".choices > .drop_container").each(function () {
        if ($(this).find(".draggable_item").length == 0) {
          draggableitem.appendTo($(this));
          return false;
        }
      });
    }
  );

  $("#next").click(function () {
    $(".questions").hide();
    currentQuestion += 1;

    $(".draggable_item").css({
      opacity: 1,
      "pointer-events": "auto",
    });

    if (currentQuestion < quiz_len) {
      $(`#${currentQuestion}`).show();
    }

    $("#check").show();
    $(".count").html(
      `<h2 class="count" style="font-size: 1.6rem !important;">Question: ${currentQuestion+1}/${quiz_len}</h2>`
    )
    $("#next").hide();


    if (currentQuestion == quiz_len) {

      $("#check").replaceWith('<button type="button" class="btn btn-primary btn-lg" id="reload" style="margin-top: 0px !important; margin-left: 10px">Redo</button>');
      $("#exercise_content").html(
        `<h1 class= "text-center" style= "color:#9841d8 !important"> You scored ${score > 100 ? 100 : Math.ceil(score)}% .</h1>
         <p class="text-center">Completion: <span id="datetime"></span></p>`
      )

      // State the time of completion
      var date = new Date();
      document.getElementById("datetime").innerHTML = date.toLocaleDateString() + " " + date.toLocaleTimeString();

      $(".count").html(
        `<h2 class="count" style="font-size: 1.6rem !important;">Question: ${currentQuestion}/${quiz_len}</h2>`
      )

      // Stop the timer 
      var minutes = document.getElementById("minutes").innerHTML;
      $("#minutes").replaceWith(` ${minutes}`);

      var seconds = document.getElementById("seconds").innerHTML;
      $("#seconds").replaceWith(`${seconds}`);
       
      clearTimer();
    }


  });

  $("#check").click(function () {
    $(".draggable_item").css({
      opacity: 0.6,
      "pointer-events": "none",
    });

    $("#check").hide();
    $("#next").show();

    var isCorrect = true;
    var frequency = Object.keys(duplicateDict)[currentQuestion];
    $(`#${currentQuestion} .answer-container .answers`).each(function (index) {
      
      if (
        ($(this).find(".simplified").html() !=
          dictionary[frequency]["SimpSentence"][index]) ||
        ($(this).find(".traditional").html() !=
          dictionary[frequency]["TradSentence"][index])
      ) {
        isCorrect = false;
        $(this).find(".box-number").append(
          '<p style="color:red; font-size:1.5em; height: 22px !important; margin: auto;">&#10008;</p>'
        )
      } else {
        $(this).find(".box-number").append(
          '<p style="color:blue; font-size:1.5em; height: 22px !important; margin: auto;">&#10004;</p>'
        )
        score = score + (100 / totalSections);
      }
      

    });

    $("#score").text(`Score: ${score > 100 ? 100 : Math.round(score)}%`);
    
    
  });




});