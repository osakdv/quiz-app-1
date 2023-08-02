const body = document.querySelector("body");
const preloader = document.querySelector(".pre-loader");
const questionDiv = document.querySelector(".quiz-question");
const optionsContainer = document.querySelector(".quiz-question-options");
const optA = document.querySelector(".optA");
const optB = document.querySelector(".optB");
const optC = document.querySelector(".optC");
const optD = document.querySelector(".optD");
const optContainerA = document.querySelector(".opt-container-a");
const optContainerB = document.querySelector(".opt-container-b");
const optContainerC = document.querySelector(".opt-container-c");
const optContainerD = document.querySelector(".opt-container-d");
const prevQuestionBtn = document.querySelector(".prev-question");
const nextQuestionBtn = document.querySelector(".next-question");
const numberOfQuestions = document.querySelector(".number-of-questions");
const quizTimerDiv = document.querySelector(".quiz-timer");

// TODO: Radomize the options using css flex

let quizScore = 0;

// get quiz questions
let dataLoaded = false;
let fetchedQuizDate;
let quizData = async () => {
  const API_URL =
    "https://opentdb.com/api.php?amount=20&category=9&difficulty=medium&type=multiple";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Network response not ok");
    }

    fetchedQuizDate = await response.json();
    console.log(fetchedQuizDate.results);

    if (!fetchedQuizDate) {
      return;
    } else {
      dataLoaded = true;
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
};

quizData();

/* 
Preloader function
add dots to text every 3s and remove once it gotten to 3
*/
preloader.innerText = "loading quiz";
let dotsLoad = "";
let contentLoadTime = 0;

let loader = setInterval(() => {
  preloader.innerText = `loading quiz${dotsLoad}`;
  dotsLoad += ".";
  //   contentLoadTime++;

  if (dotsLoad.length > 3) dotsLoad = "";

  if (dataLoaded === true) {
    clearInterval(loader);
    body.classList.add("preloader-hide");
  }
}, 1000);

// quiz questions
let questionIndex = 0;
let timer = 0;
const correctQuestion = "rq-12";
const quizQuestionDom = (data) => {
  questionDiv.innerText = data[questionIndex].question;
  optA.innerText = data[questionIndex].incorrect_answers[0];
  optB.innerText = data[questionIndex].incorrect_answers[1];
  optC.innerText = data[questionIndex].correct_answer;
  optD.innerText = data[questionIndex].incorrect_answers[0];

  optC.classList.add(correctQuestion);

  //   number of questions and position
  numberOfQuestions.innerText = `${questionIndex + 1}/${data.length}`;

  //adding a click listeners to every options
  const optionClicked = (e) => {
    console.log("Option");
    console.log(e.target.classList);
    // check for if selected option is correct not and record score
    if (e.target.textContent === data[questionIndex].correct_answer) {
      quizScore++;
      //   console.log(quizScore);
    }

    const selectedClassSwitch = (opt1, opt2, opt3, opt4, className) => {
      opt1.classList.toggle(className);
      opt2.classList.remove(className);
      opt3.classList.remove(className);
      opt4.classList.remove(className);
    };

    if (e.target.classList == "optA") {
      selectedClassSwitch(
        optContainerA,
        optContainerB,
        optContainerC,
        optContainerD,
        "option-clicked"
      );
    } else if (e.target.classList == "optB") {
      selectedClassSwitch(
        optContainerB,
        optContainerA,
        optContainerC,
        optContainerD,
        "option-clicked"
      );
    } else if (e.target.classList == "optC") {
      selectedClassSwitch(
        optContainerC,
        optContainerA,
        optContainerB,
        optContainerD,
        "option-clicked"
      );
    } else if (e.target.classList == "optD") {
      selectedClassSwitch(
        optContainerD,
        optContainerA,
        optContainerB,
        optContainerC,
        "option-clicked"
      );
    }
  };

  optContainerA.addEventListener("click", optionClicked);
  optContainerB.addEventListener("click", optionClicked);
  optContainerC.addEventListener("click", optionClicked);
  optContainerD.addEventListener("click", optionClicked);
};

// quiz timer
let sec = 0;
// TODO: Use this to stop timer should user submit before time elaspes
let reduceAllocatedTime;

const quizTimer = () => {
  reduceAllocatedTime = setInterval(() => {
    sec++;
    if (sec >= 60) {
      timer--;
      sec = 0;
      quizTimerDiv.innerText = `${timer} mins`;
    }

    if (timer <= 0) {
      clearInterval(reduceAllocatedTime);
      //   TODO: End quiz and show score
    }
  }, 1000);
};

const loadQuestions = setInterval(() => {
  if (fetchedQuizDate) {
    clearInterval(loadQuestions);
    quizQuestionDom(fetchedQuizDate.results);

    //   timer
    timer = fetchedQuizDate.results.length * 2;
    quizTimerDiv.innerText = `${timer}mins`;
    quizTimer();
  }
}, 1000);

// TODO: Record user click on options

// next and previous question functionality
const nextPrevQuestionHandler = (direction) => {
  if (!dataLoaded) return;

  if (direction == "next") {
    if (questionIndex <= fetchedQuizDate.results.length) {
      questionIndex++;
      quizQuestionDom(fetchedQuizDate.results);
    } else {
      return;
    }
  } else if (direction == "previous") {
    console.log(questionIndex);
    if (questionIndex <= 0) {
      return;
    } else {
      questionIndex--;
      quizQuestionDom(fetchedQuizDate.results);
    }
  }
};

prevQuestionBtn.addEventListener("click", () =>
  nextPrevQuestionHandler("previous")
);
nextQuestionBtn.addEventListener("click", () =>
  nextPrevQuestionHandler("next")
);
