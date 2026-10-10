# Sprint Planning

## User Stories
1. **As a resident**, I want to see the current water level and a color-coded status indicator so that I know immediately if I need to evacuate.
2. **As a barangay official**, I want to see analytics (average, trend, and status counts) so that I can report accurate data to the city disaster risk office.
3. **As a resident**, I want to read a plain-language advisory in both English and Filipino so that I can easily understand the recommended actions.

## Acceptance Criteria
* **Story 1:** The app displays the water level in cm. The text is green if <100cm, orange if 100-149cm, and red if >=150cm.
* **Story 2:** The `/api/summary` endpoint returns calculated averages and a trend (rising, falling, steady) based on the last 10 readings.
* **Story 3:** Clicking "Generate advisory" returns a 3-sentence maximum advisory in both languages. A fallback message appears if the AI fails.

## Sprint Backlog
- [x] Setup repository and project structure
- [ ] Write PLAN.md
- [ ] Build Express server and REST API endpoints (Part B)
- [ ] Write IoT Simulator script (Part C)
- [ ] Build responsive HTML/CSS/JS frontend (Part D)
- [ ] Implement data analytics logic (Part E)
- [ ] Integrate Gemini API for advisories (Part F)
- [ ] Write REFLECTION.md and README.md (Part H & Submission)
- [ ] Deploy to Render (Part G)

## SDLC Model
This lab follows the **Agile (Scrum)** model, operating as a single rapid sprint focused on delivering a functional MVP (Minimum Viable Product) iteratively.