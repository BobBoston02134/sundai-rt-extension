const OMDB_API_KEY = 'ea2adc0c'; // <-- Put your OMDB key here

chrome.storage.local.get(['movieQuery'], async (result) => {
  const query = result.movieQuery;
  if (!query) {
    document.getElementById('content').innerHTML = '<div class="error">Highlight a movie name and right-click!</div>';
    return;
  }

  try {
    const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`);
    const data = await res.json();

    if (data.Response === 'False') {
      document.getElementById('content').innerHTML = `<div class="error">Couldn't find "${query}"</div>`;
      return;
    }

    const rt = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
    const rtScore = rt ? parseInt(rt.Value) : null;

    document.getElementById('content').innerHTML = `
      <div class="title">${data.Title} (${data.Year})</div>
      <div class="scores">
        ${rtScore !== null ? `
          <div class="score">
            <div class="score-num ${rtScore >= 60 ? 'fresh' : 'rotten'}">${rtScore}%</div>
            <div class="label">Tomatometer</div>
          </div>
        ` : '<div class="score"><div class="label">No RT score</div></div>'}
        <div class="score">
          <div class="score-num">${data.imdbRating}/10</div>
          <div class="label">IMDb</div>
        </div>
      </div>
      <div class="plot">${data.Plot}</div>
    `;
  } catch (err) {
    document.getElementById('content').innerHTML = '<div class="error">Something went wrong</div>';
  }
});