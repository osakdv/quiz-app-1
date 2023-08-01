const body = document.querySelector("body");
const preloader = document.querySelector(".pre-loader");
const questionDiv = document.querySelector(".quiz-question");
const optionsContainer = document.querySelector(".quiz-question-options");
const optA = document.querySelector(".optA")
const optB = document.querySelector(".optB")
const optC = document.querySelector(".optC")
const optD = document.querySelector(".optD")

// TODO: Radomize the options

let questionIndex = 0;

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
    console.log(fetchedQuizDate.results)

    if (!fetchedQuizDate) {
      return;
    } else {
      dataLoaded = true;
    }
  } catch (error) {
    console.error(`Error fetching data: ${error}`);
  }
};

quizData()

// quiz questions
const correctQuestion = "rq-12"
const quizQuestionDom = (data) => {
    questionDiv.innerText = data[questionIndex].question
    optA.innerText = data[questionIndex].incorrect_answers[0]
    optB.innerText = data[questionIndex].incorrect_answers[1]
    optC.innerText = data[questionIndex].correct_answer
    optD.innerText = data[questionIndex].incorrect_answers[0]

    optC.classList.add(correctQuestion)
}

const loadQuestions = setInterval(() => {
    if(fetchedQuizDate) {
        clearInterval(loadQuestions)
        quizQuestionDom(fetchedQuizDate.results)
    }
}, 1000);

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
