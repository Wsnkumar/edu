require("dotenv").config();

console.log(process.env.GEMINI_API_KEY);

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

/* -----------------------------
   Generate Question
-------------------------------- */

app.get("/question", async (req, res) => {

  try {

    const response = await axios.post(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`,

      {

        contents: [

          {
            parts: [

              {
                text:
                `
Generate ONLY ONE viva question for CSE students.

Rules:
- Only question
- No answer
- No explanation
`
              }

            ]
          }

        ]

      }

    );

    const question =
      response.data.candidates[0]
      .content.parts[0].text;

    res.json({
      question
    });

  }

  catch (error) {

    console.log(
      error.response?.data ||
      error.message
    );

    res.status(500).json({
      question: "Google API Error"
    });

  }

});

/* -----------------------------
   Evaluate Answer
-------------------------------- */

app.post("/evaluate", async (req, res) => {

  try {

    const {
      question,
      answer
    } = req.body;

    const response = await axios.post(

      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${API_KEY}`,

      {

        contents: [

          {
            parts: [

              {
                text:
                `
You are a viva examiner.

Question:
${question}

Student Answer:
${answer}

Evaluate the answer.

Give:
1. Score out of 10
2. Feedback
`
              }

            ]
          }

        ]

      }

    );

    const result =
      response.data.candidates[0]
      .content.parts[0].text;

    res.json({
      result
    });

  }

  catch (error) {

    console.log(
      error.response?.data ||
      error.message
    );

    res.status(500).json({
      result: "Evaluation Error"
    });

  }

});

/* -----------------------------
   Start Server
-------------------------------- */

app.listen(5000, () => {

  console.log(
    "Server running on port 5000"
  );

});