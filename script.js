let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0 = leden, 11 = prosinec
const actualDate = new Date();
const actualDay = actualDate.getDate();
const actualMonth = actualDate.getMonth();
const actualYear = actualDate.getFullYear()

function renderCalendar(year, month) {
  const calendar = document.getElementById('calendar');
  const monthYear = document.getElementById('month-year');
  

  calendar.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  // Zobrazit název měsíce a rok
  monthYear.textContent = firstDay.toLocaleString('cs-CZ', {
    month: 'long',
    year: 'numeric'
  });

  // Prázdné buňky před začátkem měsíce
  for (let i = 0; i < startDay; i++) {
    calendar.innerHTML += `<div></div>`;
  }

  // Dny v měsíci
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    let classes = '';

    if (day === actualDay && currentMonth === actualMonth && currentYear === actualYear) classes += ' dnes';
      
    //console.log(actualDay);
    calendar.innerHTML += `<div class="${classes.trim()}">${day}</div>`;
  }
}

// Tlačítko: předchozí měsíc
document.getElementById('prev-month').addEventListener('click', () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
});

// Tlačítko: další měsíc
document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
});

// Tlačítko DNES
document.getElementById('go-today').addEventListener('click', () => {
  currentMonth = actualMonth;
  currentYear = actualYear;
  animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
});

function animateCalendarUpdate(callback) {
  const calendar = document.getElementById('calendar');

  calendar.classList.add('fade-out');

  setTimeout(() => {
    callback(); // vykresli nový měsíc
    calendar.classList.remove('fade-out');
    calendar.classList.add('fade-in');

    setTimeout(() => {
      calendar.classList.remove('fade-in');
    }, 300);
  }, 300);
}

let touchStartX = 0;
let touchEndX = 0;

const calendarContainer = document.querySelector('.calendar-container');

calendarContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

calendarContainer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipeGesture();
});

function handleSwipeGesture() {
  const threshold = 50; // minimální vzdálenost pro gesto

  if (touchEndX < touchStartX - threshold) {
    // swipe vlevo → další měsíc
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
  }

  if (touchEndX > touchStartX + threshold) {
    // swipe vpravo → předchozí měsíc
    currentMonth--;
    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }
    animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
  }
}

// Inicializace
animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));