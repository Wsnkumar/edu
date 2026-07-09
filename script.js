let currentQuestion = "";

/* -----------------------------
   Fetch Viva Question
-------------------------------- */

async function getQuestion() {

  try {

    const response =
      await fetch(
        "http://localhost:5000/question"
      );

    const data =
      await response.json();

    currentQuestion =
      data.question;

    document.getElementById("question")
      .innerText = currentQuestion;

    speakQuestion(currentQuestion);

  } catch (error) {

    console.log(error);

    alert("Error fetching question");
  }
}

/* -----------------------------
   Text To Speech
-------------------------------- */

function speakQuestion(question) {

  const speech =
    new SpeechSynthesisUtterance(question);

  speechSynthesis.speak(speech);
}

/* -----------------------------
   Speech Recognition
-------------------------------- */

function startVoice() {

  const recognition =
    new webkitSpeechRecognition();

  recognition.lang = "en-US";

  recognition.onresult = function(event) {

    const transcript =
      event.results[0][0].transcript;

    document.getElementById("answer")
      .value = transcript;
  };

  recognition.start();
}

/* -----------------------------
   Submit Answer
-------------------------------- */

async function submitAnswer() {

  try {

    const answer =
      document.getElementById("answer")
      .value;

    if (!answer) {

      alert("Please enter answer");

      return;
    }

    const response =
      await fetch(
        "http://localhost:5000/evaluate",

        {

          method: "POST",

          headers: {
            "Content-Type":
            "application/json"
          },

          body: JSON.stringify({

            question: currentQuestion,

            answer: answer
          })
        }
      );

    const data =
      await response.json();

    document.getElementById("result")
      .innerText = data.result;

  } catch (error) {

    console.log(error);

    alert("Error evaluating answer");
  }
}