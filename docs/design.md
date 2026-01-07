# Backend Design & Architecture

## Core Roles:
* **Backend Role:** It is responsible for fetching, cleaning, and permanently storing video metadata. It acts as a non-blocking proxy to YouTube.
* **Frontend Role:** It receives bulk data and handles all business logic (ranking, filtering, shortening, swapping).

---

## Initial Structure Plan


* **Input:** `{ "topics": ["Long Division", "Geometry",...] }`
* **Backend Action:**
    1.  Calls YouTube Search API for each topic.
    2.  Calls YouTube Videos API for details.
    3.  Returns UNFILTERED list to the Frontend.
* **Frontend Action:**
    1.  Receives 20 videos (just the metadata) for each topic.
    2.  Ranks each video by views likes and duration per topic.
    3.  Selects the #1 video for the playlist.
    4.  Keeps the other 18 in memory for "swapping."
    5.  Displays the playlist with the top results. 

---

## Structure to switch to in the future
*Goal: Reduce the amount of API calls and other efficeny issues over time*

### 1. Database Schema (PostgreSQL)
*Data is stored indefinitely. *

#### Table: `SearchTerms` (The Entry Point)
* `id` (PK)
* `term` (String, unique, UPPER) - *e.g., "LONG DIVISION"*
* `created_at` (Timestamp)

#### Table: `Videos` (The Library)
* `id` (PK, String) - *YouTube ID*
* `title`, `duration`, `view_count`,`like_count`, `thumbnail_url`
* *This table grows forever, becoming a massive library of unique videos.*

#### Table: `SearchResults` (The Connection)
* `search_term_id` (FK)
* `video_id` (FK)
* *Note: Links topics to videos. One video can be linked to many topics.*

### 2. The "Smart Fetch" Logic (Backend)
When a user searches for a list of topics:

2.  **The Check:** For each topic, check `SearchTerms`.
    * **Found:** Retrieve all linked videos from `Videos` table.
    * **Not Found:**
        * Call YouTube Search (get 50 results).
        * Call YouTube Details (get stats).
        * **Save Everything:** Insert new videos into `Videos` (ignore duplicates), insert term into `SearchTerms`, link them in `SearchResults`.
        * Return the new data.
3.  **The Response:** Send a massive JSON object containing *all* candidate videos for the requested topics to the client.

### 3. Client-Side Logic (Frontend)
* **Ranking:** The browser runs the algorithm to pick the "best" video from the 50 candidates provided for each topic.
* **Shortening:** If the user clicks "Shorten," the Frontend instantly swaps the current video with a shorter candidate from the cached list it already holds in memory.
* **Performance:** Zero network latency for the user during customization.

