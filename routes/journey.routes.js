import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addHighlight,
  addNote,
  addSession,
  deleteHighlight,
  deleteJourney,
  deleteNote,
  deleteSession,
  getJourneyByBook,
  getJourneySummary,
  getMyJourneys,
  updateHighlight,
  updateNote,
  upsertJourney,
} from "../controller/readingJourney.controller.js";

const router = express.Router();

router.get("/summary", protectRoute, getJourneySummary);
router.get("/", protectRoute, getMyJourneys);
router.get("/:bookId", protectRoute, getJourneyByBook);

router.post("/:bookId", protectRoute, upsertJourney);
router.put("/:bookId", protectRoute, upsertJourney);
router.delete("/:bookId", protectRoute, deleteJourney);

router.post("/:bookId/notes", protectRoute, addNote);
router.put("/:bookId/notes/:noteId", protectRoute, updateNote);
router.delete("/:bookId/notes/:noteId", protectRoute, deleteNote);

router.post("/:bookId/highlights", protectRoute, addHighlight);
router.put("/:bookId/highlights/:highlightId", protectRoute, updateHighlight);
router.delete("/:bookId/highlights/:highlightId", protectRoute, deleteHighlight);

router.post("/:bookId/sessions", protectRoute, addSession);
router.delete("/:bookId/sessions/:sessionId", protectRoute, deleteSession);

export default router;