import Book from "../model/book.model.js";
import dotenv from "dotenv"
dotenv.config();


export const getBookInsights = async (req, res) => {
  const bookId = req.params.bookId;

  if (!bookId) {
    return res
      .status(400)
      .json({ success: false, message: "Book ID is required" });
  }

  try {
    const book = await Book.findById(bookId).lean();
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    const prompt = `
You are an expert literary assistant.
Given the book data: ${JSON.stringify(book)}

Return a JSON object with only the following keys:
{
  "summary": "A 2–4 sentence concise summary of the book",
  "themes": ["Theme1", "Theme2", "Theme3"],
  "similarBooks": [
    { "title": "Similar Book Title 1", "author": "Author 1" },
    { "title": "Similar Book Title 2", "author": "Author 2" },
    { "title": "Similar Book Title 3", "author": "Author 3" }
  ]
}

Output must be valid JSON. No commentary, no markdown, no extra text.
`;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.AI_KEY}`,
        },
        body: JSON.stringify({
          model: "openai/gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400,
          temperature: 0.5,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const rawText =
      data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";

    let parsedOutput;
    try {
      parsedOutput = JSON.parse(rawText);
    } catch {
      parsedOutput = { raw: rawText }; 
    }

    return res.status(200).json({ success: true, data: parsedOutput });
  } catch (err) {
    console.error("AI Insights Error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate book insights",
      error : err.message,
    });
  }
}