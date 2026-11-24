const list = document.querySelector("#meetings");
const statusEl = document.querySelector("#status");
const refreshButton = document.querySelector("#refresh");
document.querySelector("#year").textContent = new Date().getFullYear();

function safeDate(value) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}
function escapeHTML(value="") {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function renderMeetings(items) {
  if (!items.length) {
    list.innerHTML = '<div class="empty">No agenda items were returned by the public feed. You can browse the official Agenda Center below.</div>';
    return;
  }
  list.innerHTML = items.map(item => {
    const date = safeDate(item.date);
    const month = date ? date.toLocaleDateString("en-US", {month:"short"}) : "INFO";
    const day = date ? date.toLocaleDateString("en-US", {day:"2-digit"}) : "—";
    const dateText = date ? date.toLocaleDateString("en-US", {month:"long",day:"numeric",year:"numeric"}) : "Date not provided";
    const href = /^https?:\/\//i.test(item.link || "") ? item.link : "https://www.danville.ca.gov/AgendaCenter";
    return `<article class="meeting-card">
      <div class="date-box"><span class="month">${month}</span><span class="day">${day}</span></div>
      <div><h3 class="meeting-title">${escapeHTML(item.title || "Danville public meeting")}</h3><div class="meeting-date">${dateText}</div></div>
      <a class="meeting-link" href="${escapeHTML(href)}" target="_blank" rel="noreferrer">View source ↗</a>
    </article>`;
  }).join("");
}
async function loadMeetings() {
  refreshButton.disabled = true;
  refreshButton.textContent = "Loading…";
  statusEl.textContent = "Checking the Town of Danville’s public agenda feed…";
  try {
    const response = await fetch("/api/meetings", {headers: {"Accept":"application/json"}});
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "The public feed is temporarily unavailable.");
    renderMeetings(data.items || []);
    const updated = new Date(data.fetchedAt || Date.now()).toLocaleTimeString("en-US", {hour:"numeric",minute:"2-digit"});
    statusEl.textContent = `Showing ${data.items.length} feed item${data.items.length === 1 ? "" : "s"} · checked at ${updated}.`;
  } catch (error) {
    list.innerHTML = `<div class="empty">${escapeHTML(error.message)}<br><br><a href="https://www.danville.ca.gov/AgendaCenter" target="_blank" rel="noreferrer">Open the official Agenda Center ↗</a></div>`;
    statusEl.textContent = "Live feed could not be loaded.";
  } finally {
    refreshButton.disabled = false;
    refreshButton.textContent = "↻ Refresh";
  }
}
refreshButton.addEventListener("click", loadMeetings);
loadMeetings();
