import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import "../styles/ReadingJourney.css";

const initialForm = {
  status: "want_to_read",
  currentPage: "",
  totalPages: "",
  dailyGoal: "20",
};

function ReadingJourney() {
  const [searchParams] = useSearchParams();
  const initialBookId = searchParams.get("bookId") || "";

  const [loading, setLoading] = useState(true);
  const [loadingBook, setLoadingBook] = useState(false);
  const [saving, setSaving] = useState(false);

  const [journeys, setJourneys] = useState([]);
  const [summary, setSummary] = useState({
    wantToRead: 0,
    reading: 0,
    paused: 0,
    completed: 0,
    totalNotes: 0,
    totalHighlights: 0,
    totalPagesRead: 0,
    averageProgress: 0,
  });

  const [selectedBookId, setSelectedBookId] = useState(initialBookId);
  const [previewBook, setPreviewBook] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [form, setForm] = useState(initialForm);
  const [noteForm, setNoteForm] = useState({ page: "", text: "" });
  const [highlightForm, setHighlightForm] = useState({
    page: "",
    quote: "",
  });
  const [sessionForm, setSessionForm] = useState({
    pagesRead: "",
    minutes: "",
    note: "",
  });

  const statusMeta = {
    want_to_read: { label: "Want To Read", className: "want_to_read" },
    reading: { label: "Reading", className: "reading" },
    paused: { label: "Paused", className: "paused" },
    completed: { label: "Completed", className: "completed" },
  };

  const fetchCoreData = async ({ silent = false } = {}) => {
    try {
      if (!silent) setLoading(true);

      const token = localStorage.getItem("token");

      const [summaryRes, journeysRes] = await Promise.all([
        api.get("/journeys/summary", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/journeys", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setSummary(summaryRes.data.summary || summary);
      setJourneys(journeysRes.data.journeys || []);
    } catch (error) {
      console.error(error);
      toast.error("Could not load reading journey");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchPreviewBook = async (bookId) => {
    try {
      if (!bookId) {
        setPreviewBook(null);
        return;
      }

      setLoadingBook(true);
      const response = await api.get(`/books/${bookId}`);
      setPreviewBook(response.data.book || null);
    } catch (error) {
      console.error(error);
      setPreviewBook(null);
    } finally {
      setLoadingBook(false);
    }
  };

  useEffect(() => {
    fetchCoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selectedJourney = journeys.find(
      (item) => item.book?._id === selectedBookId,
    );

    if (selectedJourney) {
      setForm({
        status: selectedJourney.status || "want_to_read",
        currentPage: selectedJourney.currentPage ?? "",
        totalPages: selectedJourney.totalPages ?? "",
        dailyGoal: selectedJourney.dailyGoal ?? "20",
      });
      setPreviewBook(null);
    } else {
      setForm(initialForm);
      fetchPreviewBook(selectedBookId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBookId, journeys]);

  useEffect(() => {
    if (!selectedBookId && journeys.length > 0) {
      setSelectedBookId(journeys[0].book._id);
    }
  }, [journeys, selectedBookId]);

  const selectedJourney = useMemo(() => {
    return journeys.find((item) => item.book?._id === selectedBookId) || null;
  }, [journeys, selectedBookId]);

  const activeBook = selectedJourney?.book || previewBook || null;

  const filteredJourneys = useMemo(() => {
    return journeys.filter((journey) => {
      const matchesSearch =
        journey.book?.title?.toLowerCase().includes(search.toLowerCase()) ||
        journey.book?.author?.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "all" ? true : journey.status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [journeys, search, filter]);

  const currentPageValue = Number(
    form.currentPage || selectedJourney?.currentPage || 0,
  );
  const totalPagesValue = Number(
    form.totalPages || selectedJourney?.totalPages || 0,
  );

  const progress =
    totalPagesValue > 0
      ? Math.min(100, Math.round((currentPageValue / totalPagesValue) * 100))
      : selectedJourney?.progress || 0;

  const journeyId = selectedJourney?.book?._id || previewBook?._id || selectedBookId;

  const refresh = async () => {
    await fetchCoreData({ silent: true });
  };

  const saveJourney = async (overrides = {}) => {
    try {
      if (!journeyId) {
        toast.error("Select a book first");
        return;
      }

      setSaving(true);

      const token = localStorage.getItem("token");

      const payload = {
        status: overrides.status || form.status,
        currentPage:
          overrides.currentPage !== undefined
            ? overrides.currentPage
            : form.currentPage,
        totalPages:
          overrides.totalPages !== undefined
            ? overrides.totalPages
            : form.totalPages,
        dailyGoal:
          overrides.dailyGoal !== undefined
            ? overrides.dailyGoal
            : form.dailyGoal,
      };

      const method = selectedJourney ? "put" : "post";

      const response = await api[method](
        `/journeys/${journeyId}`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(response.data.message || "Journey saved");
      await refresh();
      setSelectedBookId(journeyId);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save journey");
    } finally {
      setSaving(false);
    }
  };

  const markCompleted = async () => {
    await saveJourney({
      status: "completed",
      currentPage: totalPagesValue || form.currentPage || selectedJourney?.currentPage || 0,
    });
  };

  const deleteJourney = async () => {
    const confirmDelete = window.confirm("Delete this reading journey?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      await api.delete(`/journeys/${journeyId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Journey deleted");
      setSelectedBookId("");
      setPreviewBook(null);
      await refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete journey");
    }
  };

  const addNote = async () => {
    try {
      if (!selectedJourney) {
        toast.error("Save the journey first");
        return;
      }

      if (!noteForm.text.trim()) {
        toast.error("Write a note first");
        return;
      }

      const token = localStorage.getItem("token");

      await api.post(
        `/journeys/${journeyId}/notes`,
        noteForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setNoteForm({ page: "", text: "" });
      toast.success("Note added");
      await refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add note");
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/journeys/${journeyId}/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Note deleted");
      await refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete note");
    }
  };

  const addHighlight = async () => {
    try {
      if (!selectedJourney) {
        toast.error("Save the journey first");
        return;
      }

      if (!highlightForm.quote.trim()) {
        toast.error("Write a highlight first");
        return;
      }

      const token = localStorage.getItem("token");

      await api.post(
        `/journeys/${journeyId}/highlights`,
        highlightForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setHighlightForm({ page: "", quote: "" });
      toast.success("Highlight added");
      await refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not add highlight");
    }
  };

  const deleteHighlight = async (highlightId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/journeys/${journeyId}/highlights/${highlightId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Highlight deleted");
      await refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete highlight");
    }
  };

  const addSession = async () => {
    try {
      if (!selectedJourney) {
        toast.error("Save the journey first");
        return;
      }

      if (!sessionForm.pagesRead || Number(sessionForm.pagesRead) <= 0) {
        toast.error("Enter pages read");
        return;
      }

      const token = localStorage.getItem("token");

      await api.post(
        `/journeys/${journeyId}/sessions`,
        sessionForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSessionForm({ pagesRead: "", minutes: "", note: "" });
      toast.success("Session saved");
      await refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save session");
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/journeys/${journeyId}/sessions/${sessionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Session deleted");
      await refresh();
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete session");
    }
  };

  if (loading) {
    return <Loader />;
  }

  const selectedMeta = statusMeta[selectedJourney?.status || form.status] || statusMeta.want_to_read;

  return (
    <div className="container journey-page">
      <section className="journey-hero">
        <div>
          <span className="journey-hero-badge">Reading Journey</span>
          <h1>Track pages, notes, highlights and progress</h1>
          <p>
            Save what you read, where you stopped, and the important ideas you want to revisit later.
          </p>
        </div>
      </section>

      <div className="journey-stats-grid">
        <div className="journey-stat-card">
          <span>Want To Read</span>
          <strong>{summary.wantToRead}</strong>
        </div>

        <div className="journey-stat-card">
          <span>Reading</span>
          <strong>{summary.reading}</strong>
        </div>

        <div className="journey-stat-card">
          <span>Completed</span>
          <strong>{summary.completed}</strong>
        </div>

        <div className="journey-stat-card">
          <span>Notes</span>
          <strong>{summary.totalNotes}</strong>
        </div>

        <div className="journey-stat-card">
          <span>Highlights</span>
          <strong>{summary.totalHighlights}</strong>
        </div>

        <div className="journey-stat-card">
          <span>Pages Read</span>
          <strong>{summary.totalPagesRead}</strong>
        </div>

        <div className="journey-stat-card">
          <span>Average Progress</span>
          <strong>{summary.averageProgress}%</strong>
        </div>

        <div className="journey-stat-card">
          <span>Current Book</span>
          <strong>{selectedJourney ? "Tracked" : "New"}</strong>
        </div>
      </div>

      <div className="journey-layout">
        <aside className="journey-sidebar-card">
          <div className="journey-sidebar-head">
            <h3>Your books</h3>

            <input
              className="journey-search"
              type="text"
              placeholder="Search title or author"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <select
              className="journey-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="want_to_read">Want To Read</option>
              <option value="reading">Reading</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="journey-list">
            {filteredJourneys.length === 0 ? (
              <div className="journey-sidebar-empty">
                No journeys found
              </div>
            ) : (
              filteredJourneys.map((journey) => {
                const book = journey.book;
                const meta = statusMeta[journey.status] || statusMeta.want_to_read;

                return (
                  <button
                    key={journey._id}
                    type="button"
                    className={`journey-list-item ${
                      selectedBookId === book._id ? "active" : ""
                    }`}
                    onClick={() => setSelectedBookId(book._id)}
                  >
                    <div className="journey-list-cover">
                      <img src={book.imageUrl} alt={book.title} />
                    </div>

                    <div className="journey-list-meta">
                      <span className={`journey-mini-status ${meta.className}`}>
                        {meta.label}
                      </span>

                      <h4>{book.title}</h4>
                      <p>{book.author}</p>

                      <div className="journey-mini-progress">
                        <div
                          className="journey-mini-progress-fill"
                          style={{ width: `${journey.progress || 0}%` }}
                        />
                      </div>

                      <small>{journey.progress || 0}% complete</small>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <main className="journey-main">
          {activeBook ? (
            <>
              <section className="journey-spotlight">
                <div className="journey-spotlight-cover">
                  <img
                    src={activeBook.imageUrl}
                    alt={activeBook.title}
                  />
                </div>

                <div className="journey-spotlight-content">
                  <span className={`journey-status-pill ${selectedMeta.className}`}>
                    {selectedMeta.label}
                  </span>

                  <h2>{activeBook.title}</h2>
                  <p>by {activeBook.author}</p>

                  <div className="journey-progress-track">
                    <div
                      className="journey-progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="journey-progress-meta">
                    <span>
                      Page {currentPageValue || 0} / {totalPagesValue || 0}
                    </span>
                    <span>{progress}% complete</span>
                    <span>
                      Goal {Number(form.dailyGoal || 20)} pages/day
                    </span>
                  </div>

                  <div className="journey-book-note">
                    Track where you stopped, save notes, and keep highlights in one place.
                  </div>
                </div>
              </section>

              <section className="journey-form-card">
                <div className="journey-card-head">
                  <div>
                    <span className="section-kicker">Update Journey</span>
                    <h3>Reading progress</h3>
                  </div>
                </div>

                <div className="journey-form-grid">
                  <div className="journey-field">
                    <label>Status</label>
                    <select
                      className="journey-input"
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                    >
                      <option value="want_to_read">Want To Read</option>
                      <option value="reading">Reading</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div className="journey-field">
                    <label>Current Page</label>
                    <input
                      className="journey-input"
                      type="number"
                      min="0"
                      value={form.currentPage}
                      onChange={(e) =>
                        setForm({ ...form, currentPage: e.target.value })
                      }
                    />
                  </div>

                  <div className="journey-field">
                    <label>Total Pages</label>
                    <input
                      className="journey-input"
                      type="number"
                      min="0"
                      value={form.totalPages}
                      onChange={(e) =>
                        setForm({ ...form, totalPages: e.target.value })
                      }
                    />
                  </div>

                  <div className="journey-field">
                    <label>Daily Goal</label>
                    <input
                      className="journey-input"
                      type="number"
                      min="1"
                      value={form.dailyGoal}
                      onChange={(e) =>
                        setForm({ ...form, dailyGoal: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="journey-actions">
                  <button
                    type="button"
                    className="journey-primary-btn"
                    onClick={() => saveJourney()}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : selectedJourney ? "Save Changes" : "Start Journey"}
                  </button>

                  <button
                    type="button"
                    className="journey-secondary-btn"
                    onClick={markCompleted}
                    disabled={saving}
                  >
                    Mark Completed
                  </button>

                  {selectedJourney && (
                    <button
                      type="button"
                      className="journey-danger-btn"
                      onClick={deleteJourney}
                    >
                      Delete Journey
                    </button>
                  )}
                </div>
              </section>

              {selectedJourney ? (
                <>
                  <section className="journey-section-card">
                    <div className="journey-card-head">
                      <div>
                        <span className="section-kicker">Notes</span>
                        <h3>Page specific notes</h3>
                      </div>
                    </div>

                    <div className="journey-inline-form">
                      <input
                        className="journey-input journey-note-page"
                        type="number"
                        min="0"
                        placeholder="Page"
                        value={noteForm.page}
                        onChange={(e) =>
                          setNoteForm({ ...noteForm, page: e.target.value })
                        }
                      />

                      <textarea
                        className="journey-textarea"
                        placeholder="Write a note about this page or chapter..."
                        value={noteForm.text}
                        onChange={(e) =>
                          setNoteForm({ ...noteForm, text: e.target.value })
                        }
                      />

                      <button
                        type="button"
                        className="journey-primary-btn"
                        onClick={addNote}
                      >
                        Add Note
                      </button>
                    </div>

                    <div className="journey-list-stack">
                      {selectedJourney.notes?.length === 0 ? (
                        <div className="journey-empty-inline">No notes yet.</div>
                      ) : (
                        selectedJourney.notes.map((note) => (
                          <article key={note._id} className="journey-item-card">
                            <div className="journey-item-top">
                              <strong>
                                {note.page !== null && note.page !== undefined
                                  ? `Page ${note.page}`
                                  : "No page"}
                              </strong>

                              <button
                                type="button"
                                className="journey-delete-link"
                                onClick={() => deleteNote(note._id)}
                              >
                                Delete
                              </button>
                            </div>

                            <p>{note.text}</p>
                          </article>
                        ))
                      )}
                    </div>
                  </section>

                  <section className="journey-section-card">
                    <div className="journey-card-head">
                      <div>
                        <span className="section-kicker">Highlights</span>
                        <h3>Saved quotes</h3>
                      </div>
                    </div>

                    <div className="journey-inline-form">
                      <input
                        className="journey-input journey-note-page"
                        type="number"
                        min="0"
                        placeholder="Page"
                        value={highlightForm.page}
                        onChange={(e) =>
                          setHighlightForm({
                            ...highlightForm,
                            page: e.target.value,
                          })
                        }
                      />

                      <textarea
                        className="journey-textarea"
                        placeholder="Add your favourite quote or line..."
                        value={highlightForm.quote}
                        onChange={(e) =>
                          setHighlightForm({
                            ...highlightForm,
                            quote: e.target.value,
                          })
                        }
                      />

                      <button
                        type="button"
                        className="journey-primary-btn"
                        onClick={addHighlight}
                      >
                        Add Highlight
                      </button>
                    </div>

                    <div className="journey-list-stack">
                      {selectedJourney.highlights?.length === 0 ? (
                        <div className="journey-empty-inline">
                          No highlights yet.
                        </div>
                      ) : (
                        selectedJourney.highlights.map((highlight) => (
                          <article key={highlight._id} className="journey-item-card">
                            <div className="journey-item-top">
                              <strong>
                                {highlight.page !== null &&
                                highlight.page !== undefined
                                  ? `Page ${highlight.page}`
                                  : "No page"}
                              </strong>

                              <button
                                type="button"
                                className="journey-delete-link"
                                onClick={() => deleteHighlight(highlight._id)}
                              >
                                Delete
                              </button>
                            </div>

                            <p>{highlight.quote}</p>
                          </article>
                        ))
                      )}
                    </div>
                  </section>

                  <section className="journey-section-card">
                    <div className="journey-card-head">
                      <div>
                        <span className="section-kicker">Sessions</span>
                        <h3>Reading log</h3>
                      </div>
                    </div>

                    <div className="journey-inline-form">
                      <div className="journey-form-grid session-grid">
                        <div className="journey-field">
                          <label>Pages Read</label>
                          <input
                            className="journey-input"
                            type="number"
                            min="1"
                            value={sessionForm.pagesRead}
                            onChange={(e) =>
                              setSessionForm({
                                ...sessionForm,
                                pagesRead: e.target.value,
                              })
                            }
                          />
                        </div>

                        <div className="journey-field">
                          <label>Time Spent (minutes)</label>
                          <input
                            className="journey-input"
                            type="number"
                            min="0"
                            value={sessionForm.minutes}
                            onChange={(e) =>
                              setSessionForm({
                                ...sessionForm,
                                minutes: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>

                      <textarea
                        className="journey-textarea"
                        placeholder="Optional session note..."
                        value={sessionForm.note}
                        onChange={(e) =>
                          setSessionForm({
                            ...sessionForm,
                            note: e.target.value,
                          })
                        }
                      />

                      <button
                        type="button"
                        className="journey-primary-btn"
                        onClick={addSession}
                      >
                        Log Session
                      </button>
                    </div>

                    <div className="journey-list-stack">
                      {selectedJourney.sessions?.length === 0 ? (
                        <div className="journey-empty-inline">
                          No sessions logged yet.
                        </div>
                      ) : (
                        selectedJourney.sessions.map((session) => (
                          <article key={session._id} className="journey-item-card">
                            <div className="journey-item-top">
                              <strong>
                                {session.pagesRead} pages •{" "}
                                {session.timeSpentMinutes || 0} min
                              </strong>

                              <button
                                type="button"
                                className="journey-delete-link"
                                onClick={() => deleteSession(session._id)}
                              >
                                Delete
                              </button>
                            </div>

                            <p>{session.note || "No note added for this session."}</p>
                          </article>
                        ))
                      )}
                    </div>
                  </section>
                </>
              ) : (
                <div className="journey-lock">
                  Save this book first to unlock notes, highlights and sessions.
                </div>
              )}
            </>
          ) : (
            <div className="journey-empty">
              <h2>Select a book to start tracking</h2>
              <p>
                Pick one from the left side or open a book from its details page.
              </p>
              <Link to="/books" className="journey-empty-btn">
                Browse Books
              </Link>

              {loadingBook && (
                <div className="journey-loading-book">
                  Loading book...
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ReadingJourney;