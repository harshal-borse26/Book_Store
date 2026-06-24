import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    page: {
      type: Number,
      default: null,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const highlightSchema = new mongoose.Schema(
  {
    page: {
      type: Number,
      default: null,
    },
    quote: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const sessionSchema = new mongoose.Schema(
  {
    pagesRead: {
      type: Number,
      required: true,
      min: 1,
    },
    timeSpentMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const readingJourneySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["want_to_read", "reading", "paused", "completed"],
      default: "want_to_read",
    },

    currentPage: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalPages: {
      type: Number,
      default: 0,
      min: 0,
    },

    dailyGoal: {
      type: Number,
      default: 20,
      min: 1,
    },

    startedAt: {
      type: Date,
      default: null,
    },

    lastReadAt: {
      type: Date,
      default: null,
    },

    completedAt: {
      type: Date,
      default: null,
    },

    notes: [noteSchema],
    highlights: [highlightSchema],
    sessions: [sessionSchema],
  },
  {
    timestamps: true,
  }
);

readingJourneySchema.index({ user: 1, book: 1 }, { unique: true });

const ReadingJourney = mongoose.model(
  "ReadingJourney",
  readingJourneySchema
);

export default ReadingJourney;