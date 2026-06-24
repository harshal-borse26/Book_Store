import Book from "../model/book.model.js";
import ReadingJourney from "../model/readingJourney.model.js";

const BOOK_FIELDS =
  "title author price imageUrl language desc averageRating totalReviews stock";

const computeProgress = (currentPage = 0, totalPages = 0) => {
  const current = Number(currentPage || 0);
  const total = Number(totalPages || 0);

  if (!total || total <= 0) return 0;

  return Math.max(0, Math.min(100, Math.round((current / total) * 100)));
};

const enrichJourney = (journey) => {
  if (!journey) return null;

  const data = journey.toObject ? journey.toObject() : journey;

  return {
    ...data,
    progress: computeProgress(data.currentPage, data.totalPages),
    notesCount: data.notes?.length || 0,
    highlightsCount: data.highlights?.length || 0,
    sessionsCount: data.sessions?.length || 0,
    pagesReadFromSessions: (data.sessions || []).reduce(
      (sum, session) => sum + Number(session.pagesRead || 0),
      0,
    ),
    minutesSpent: (data.sessions || []).reduce(
      (sum, session) => sum + Number(session.timeSpentMinutes || 0),
      0,
    ),
  };
};

const findJourney = async (userId, bookId) => {
  return ReadingJourney.findOne({ user: userId, book: bookId }).populate(
    "book",
    BOOK_FIELDS,
  );
};

export const getJourneySummary = async (req, res) => {
  try {
    const journeys = await ReadingJourney.find({
      user: req.user._id,
    }).select("status notes highlights currentPage totalPages sessions");

    const summary = {
      wantToRead: journeys.filter((j) => j.status === "want_to_read").length,
      reading: journeys.filter((j) => j.status === "reading").length,
      paused: journeys.filter((j) => j.status === "paused").length,
      completed: journeys.filter((j) => j.status === "completed").length,
      totalNotes: journeys.reduce(
        (sum, j) => sum + (j.notes?.length || 0),
        0,
      ),
      totalHighlights: journeys.reduce(
        (sum, j) => sum + (j.highlights?.length || 0),
        0,
      ),
      totalPagesRead: journeys.reduce(
        (sum, j) => sum + Number(j.currentPage || 0),
        0,
      ),
      averageProgress:
        journeys.length > 0
          ? Math.round(
              journeys.reduce(
                (sum, j) => sum + computeProgress(j.currentPage, j.totalPages),
                0,
              ) / journeys.length,
            )
          : 0,
    };

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getMyJourneys = async (req, res) => {
  try {
    const journeys = await ReadingJourney.find({
      user: req.user._id,
    })
      .populate("book", BOOK_FIELDS)
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      journeys: journeys.map(enrichJourney),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const getJourneyByBook = async (req, res) => {
  try {
    const journey = await findJourney(req.user._id, req.params.bookId);

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    res.status(200).json({
      success: true,
      journey: enrichJourney(journey),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const upsertJourney = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status, currentPage, totalPages, dailyGoal } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    let journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      journey = new ReadingJourney({
        user: req.user._id,
        book: bookId,
      });
    }

    if (status) {
      journey.status = status;
    }

    if (currentPage !== undefined) {
      journey.currentPage = Math.max(0, Number(currentPage) || 0);
    }

    if (totalPages !== undefined) {
      journey.totalPages = Math.max(0, Number(totalPages) || 0);
    }

    if (dailyGoal !== undefined) {
      journey.dailyGoal = Math.max(1, Number(dailyGoal) || 1);
    }

    if (journey.status !== "want_to_read" || Number(journey.currentPage) > 0) {
      journey.startedAt = journey.startedAt || new Date();
      journey.lastReadAt = new Date();
    }

    if (
      journey.status === "completed" ||
      (journey.totalPages > 0 && journey.currentPage >= journey.totalPages)
    ) {
      journey.status = "completed";
      journey.completedAt = journey.completedAt || new Date();
    } else if (journey.status !== "completed") {
      journey.completedAt = null;
    }

    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(200).json({
      success: true,
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteJourney = async (req, res) => {
  try {
    const journey = await ReadingJourney.findOneAndDelete({
      user: req.user._id,
      book: req.params.bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Journey deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const addNote = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Note text is required",
      });
    }

    const journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    journey.notes.push({
      page: page !== undefined && page !== "" ? Number(page) : null,
      text: text.trim(),
    });

    journey.lastReadAt = new Date();
    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(201).json({
      success: true,
      message: "Note added",
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateNote = async (req, res) => {
  try {
    const { bookId, noteId } = req.params;
    const { page, text } = req.body;

    const journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    const note = journey.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    if (text !== undefined) {
      note.text = text.trim();
    }

    if (page !== undefined) {
      note.page = page !== "" ? Number(page) : null;
    }

    journey.lastReadAt = new Date();
    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(200).json({
      success: true,
      message: "Note updated",
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const { bookId, noteId } = req.params;

    const journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    const note = journey.notes.id(noteId);
    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.deleteOne();
    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(200).json({
      success: true,
      message: "Note deleted",
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const addHighlight = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page, quote } = req.body;

    if (!quote || !quote.trim()) {
      return res.status(400).json({
        success: false,
        message: "Highlight text is required",
      });
    }

    const journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    journey.highlights.push({
      page: page !== undefined && page !== "" ? Number(page) : null,
      quote: quote.trim(),
    });

    journey.lastReadAt = new Date();
    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(201).json({
      success: true,
      message: "Highlight added",
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const updateHighlight = async (req, res) => {
  try {
    const { bookId, highlightId } = req.params;
    const { page, quote } = req.body;

    const journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    const highlight = journey.highlights.id(highlightId);
    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    if (quote !== undefined) {
      highlight.quote = quote.trim();
    }

    if (page !== undefined) {
      highlight.page = page !== "" ? Number(page) : null;
    }

    journey.lastReadAt = new Date();
    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(200).json({
      success: true,
      message: "Highlight updated",
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteHighlight = async (req, res) => {
  try {
    const { bookId, highlightId } = req.params;

    const journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    const highlight = journey.highlights.id(highlightId);
    if (!highlight) {
      return res.status(404).json({
        success: false,
        message: "Highlight not found",
      });
    }

    highlight.deleteOne();
    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(200).json({
      success: true,
      message: "Highlight deleted",
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const addSession = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { pagesRead, timeSpentMinutes, note } = req.body;

    const pages = Number(pagesRead || 0);

    if (pages <= 0) {
      return res.status(400).json({
        success: false,
        message: "Pages read is required",
      });
    }

    const journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    journey.sessions.push({
      pagesRead: pages,
      timeSpentMinutes: Math.max(0, Number(timeSpentMinutes || 0)),
      note: note || "",
    });

    journey.currentPage = Math.min(
      journey.totalPages > 0 ? journey.totalPages : Number.MAX_SAFE_INTEGER,
      Number(journey.currentPage || 0) + pages,
    );

    journey.lastReadAt = new Date();

    if (journey.totalPages > 0 && journey.currentPage >= journey.totalPages) {
      journey.status = "completed";
      journey.completedAt = journey.completedAt || new Date();
    } else if (journey.status === "want_to_read") {
      journey.status = "reading";
      journey.startedAt = journey.startedAt || new Date();
    }

    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(201).json({
      success: true,
      message: "Reading session added",
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteSession = async (req, res) => {
  try {
    const { bookId, sessionId } = req.params;

    const journey = await ReadingJourney.findOne({
      user: req.user._id,
      book: bookId,
    });

    if (!journey) {
      return res.status(404).json({
        success: false,
        message: "Journey not found",
      });
    }

    const session = journey.sessions.id(sessionId);
    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    session.deleteOne();
    await journey.save();

    const populated = await ReadingJourney.findById(journey._id).populate(
      "book",
      BOOK_FIELDS,
    );

    res.status(200).json({
      success: true,
      message: "Session deleted",
      journey: enrichJourney(populated),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};