const calendar = document.getElementById('calendar');
const monthYear = document.getElementById('month-year');

const now = new Date();
const year = now.getFullYear();
const month = now.getMonth(); // 0 = leden

const firstDay = new Date(year, month, 1);
const lastDay = new Date(year, month + 1, 0);
const startDay = firstDay.getDay(); // 0 = neděle

const monthNames = ['Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen', 'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'];
monthYear.textContent = `${monthNames[month]} ${year}`;

// Vyplníme prázdná místa před prvním dnem
for (let i = 0; i < (startDay === 0 ? 6 : startDay - 1); i++) {
  calendar.innerHTML += `<div></div>`;
}

// Vygenerujeme dny
for (let day = 1; day <= lastDay.getDate(); day++) {
  calendar.innerHTML += `<div>${day}</div>`;
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => console.log('SW registered:', reg.scope))
      .catch(err => console.error('SW registration failed:', err));
  });
}