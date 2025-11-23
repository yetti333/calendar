const smenaA = [0,0,2,2,2,2,2,0,0,1,1,1,1,3,3,3,0,0,0,0,1,1,1,3,3,3,3,0]; //28x, 1-11-2025
const smenaB = [1,1,3,3,3,3,0,0,0,2,2,2,2,2,0,0,1,1,1,1,3,3,3,0,0,0,0,1];
const smenaC = [3,3,0,0,0,0,1,1,1,3,3,3,3,0,0,0,2,2,2,2,2,0,0,1,1,1,1,3];
const smenaD = [0,0,1,1,1,1,3,3,3,0,0,0,0,1,1,1,3,3,3,3,0,0,0,2,2,2,2,2];
let currentYear = new Date().getFullYear(); //datum kalendáře
let currentMonth = new Date().getMonth(); // 0 = leden, 11 = prosinec
const actualDate = new Date(); //reálné datum
const actualDay = actualDate.getDate();
const actualMonth = actualDate.getMonth();
const actualYear = actualDate.getFullYear();
const vibr = 7;

function renderCalendar(year, month) {
  const calendar = document.getElementById('calendar');
  const monthYear = document.getElementById('month-year');
  const prevButton = document.getElementById('prev-month'); 
  //let startSmen = 0;
 
  calendar.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

  // Zobrazit název měsíce a rok
  monthYear.textContent = firstDay.toLocaleString('cs-CZ', {
    month: 'long',
    year: 'numeric'
  });
  
// Zakázat tlačítko předchozí měsíc pro listopad 2025
 if (year === 2025 && month === 10) {
    prevButton.disabled = true;
    prevButton.style.pointerEvents = 'none';
  } else {
    prevButton.disabled = false;
    prevButton.style.pointerEvents = 'auto';
  }



  // Prázdné buňky před začátkem měsíce
  for (let i = 0; i < startDay; i++) {
    calendar.innerHTML += `<div></div>`;
  }

  // Dny v měsíci
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    let shiftDayIndex = 0;
    let shiftDayStart = 0;
    let classes = '';
    
    if (day === actualDay && currentMonth === actualMonth && currentYear === actualYear) classes += ' dnes';
    
    shiftDayStart = daysBetween(new Date(year, month, 1));
    shiftDayIndex = (shiftDayStart + day - 1) % 28;
    if (smenaD[shiftDayIndex] === 0) classes += ' volno';
    if (smenaD[shiftDayIndex] === 1) classes += ' ranni';
    if (smenaD[shiftDayIndex] === 2) classes += ' odpoledni';
    if (smenaD[shiftDayIndex] === 3) classes += ' nocni';
    
    calendar.innerHTML += `<div class="${classes.trim()}">${day}</div>`;
  }

  // Zvýraznění dne po kliknutí
  const dayCells = calendar.querySelectorAll('div');
  let selectedDay = null;
  dayCells.forEach(cell => {
    if (cell.textContent.trim() !== '') {
      cell.addEventListener('click', () => {
        // Zruš předchozí výběr
        dayCells.forEach(c => c.classList.remove('selected'));
        // Přidej zvýraznění na kliknutý den
        cell.classList.add('selected');
        selectedDay = parseInt(cell.textContent);
        if (navigator.vibrate) navigator.vibrate(vibr);
        console.log("den ", selectedDay);
      });
    }
  });
}

// Tlačítko: předchozí měsíc
document.getElementById('prev-month').addEventListener('click', () => {
  if (currentYear === 2025 && currentMonth === 10) {
    return;
  }
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  if (navigator.vibrate) navigator.vibrate(vibr);
  animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
});

// Tlačítko: další měsíc
document.getElementById('next-month').addEventListener('click', () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  if (navigator.vibrate) navigator.vibrate(vibr);
  animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
});

// Tlačítko DNES
document.getElementById('go-today').addEventListener('click', () => {
  if (currentMonth != actualMonth) {
    currentMonth = actualMonth;
    currentYear = actualYear;
    if (navigator.vibrate) navigator.vibrate(vibr);
    animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
  } else {
    if (navigator.vibrate) navigator.vibrate(vibr);
  }
  
});

// Animace kalendáře
function animateCalendarUpdate(callback) {
  const calendar = document.getElementById('calendar');

  calendar.classList.add('fade-out');

  setTimeout(() => {
    callback(); // vykresli nový měsíc
    calendar.classList.remove('fade-out');
    calendar.classList.add('fade-in');

    setTimeout(() => {
      cchEndX = 0;
      calendar.classList.remove('fade-in');
    }, 300);
  }, 300);
}

// Posun přejetím
let touchStartX = 0;
let tou
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
    //if (navigator.vibrate) navigator.vibrate(vibr);
    // swipe vlevo → další měsíc
    currentMonth++;
    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }
    animateCalendarUpdate(() => renderCalendar(currentYear, currentMonth));
  }

  if (touchEndX > touchStartX + threshold) {
    //if (navigator.vibrate) navigator.vibrate(vibr);
    // swipe vpravo → předchozí měsíc
    if (currentYear === 2025 && currentMonth === 10) {
    return;
  }
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

// Zrušení předchozího výběru dne
document.addEventListener('click', (e) => {
  const calendar = document.getElementById('calendar');
  const clickedInsideCalendarCell = e.target.closest('#calendar div');

  if (!clickedInsideCalendarCell) {
    const selected = calendar.querySelector('.selected');
    if (selected) selected.classList.remove('selected');
  }
});

// Funkce pro výpočet dnů mezi dvěma daty
function daysBetween(day1) {
  const day2 = new Date(2025, 10, 1); // listopad je 10, začíná se od 0
  const between = Math.abs(Math.floor((day1 - day2) / (1000 * 60 * 60 * 24)));
  console.log(between);
  return between;
}


