import './style.css'
import { categories } from './data/questions.js'
import { renderCourierGame, checkCourierAnswer } from './games/courier.js'
import { renderMemoryGame, handleMemoryClick, initMemoryGame } from './games/memory.js'
import { renderMathGame, generateMathProblem } from './games/math.js'

// Global state
const state = {
  view: 'dashboard',
  nature: {
    category: null,
    currentQuestionIndex: 0,
    score: 0,
    shuffledQuestions: [],
    startTime: null,
    timerInterval: null
  },
  courier: {
    score: 0,
    streak: 0,
    problem: { question: '', answer: 0, type: '' },
    message: 'Witaj, Panie Kurierze!',
    messageType: ''
  },
  memory: {
    cards: [],
    flipped: [],
    matched: [],
    moves: 0,
    isProcessing: false
  },
  math: {
    score: 0,
    streak: 0,
    problem: { a: 0, b: 0, op: '', answer: 0 },
    message: 'Rozwiąż zadanie!',
    messageType: ''
  }
};

// DOM Elements
const screens = {
  dashboard: document.getElementById('screen-dashboard'),
  categories: document.getElementById('screen-categories'),
  quiz: document.getElementById('screen-quiz'),
  result: document.getElementById('screen-result'),
  game: document.getElementById('screen-game')
};

const gameContainer = document.getElementById('game-container');
const categoryList = document.getElementById('category-list');
const questionText = document.getElementById('question-text');
const optionsList = document.getElementById('options-list');
const progressBar = document.getElementById('progress-bar');
const statsText = document.getElementById('quiz-stats');
const feedback = document.getElementById('feedback');
const feedbackEmoji = document.getElementById('feedback-emoji');
const feedbackText = document.getElementById('feedback-text');
const btnNext = document.getElementById('btn-next');
const timerText = document.getElementById('quiz-timer');
const correctCountText = document.getElementById('quiz-correct-count');

// Expose functions to window for template handlers
window.switchView = (viewName) => {
  state.view = viewName;
  render();
};

window.checkCourierAnswer = () => {
  checkCourierAnswer(state, render);
};

window.handleMemoryClick = (id) => {
  handleMemoryClick(id, state, render);
};

window.handleResetMemory = () => {
  initMemoryGame(state);
  render();
};

// Init
function init() {
  document.getElementById('btn-restart').addEventListener('click', startNatureQuiz);
  document.getElementById('btn-home').addEventListener('click', () => window.switchView('dashboard'));
  btnNext.addEventListener('click', nextNatureQuestion);

  render();
}

function render() {
  // Hide all screens
  Object.values(screens).forEach(s => {
    s.classList.remove('active');
  });

  // Clear nature quiz intervals if not in quiz
  if (state.view !== 'quiz' && state.nature.timerInterval) {
    clearInterval(state.nature.timerInterval);
    state.nature.timerInterval = null;
  }

  // Show active screen and render content
  switch (state.view) {
    case 'dashboard':
      screens.dashboard.classList.add('active');
      break;
    case 'nature':
      screens.categories.classList.add('active');
      renderNatureCategories();
      break;
    case 'quiz':
      screens.quiz.classList.add('active');
      renderNatureQuestion();
      break;
    case 'nature-result':
      screens.result.classList.add('active');
      showNatureResults();
      break;
    case 'courier':
      screens.game.classList.add('active');
      renderCourierGame(gameContainer, false, state, render);
      break;
    case 'memory':
      screens.game.classList.add('active');
      renderMemoryGame(gameContainer, false, state, render);
      break;
    case 'math':
      screens.game.classList.add('active');
      renderMathGame(gameContainer, false, state, render);
      break;
  }
}

// Nature Quiz Functions
function renderNatureCategories() {
  categoryList.innerHTML = '';
  categories.forEach(cat => {
    const card = document.createElement('div');
    card.className = `category-card ${cat.id}`;
    card.innerHTML = `
      <span class="category-icon">${cat.icon}</span>
      <h3 class="category-title">${cat.title}</h3>
      <p>${cat.questions.length} pytań</p>
    `;
    card.addEventListener('click', () => {
      state.nature.category = cat;
      startNatureQuiz();
    });
    categoryList.appendChild(card);
  });
}

function startNatureQuiz() {
  state.nature.currentQuestionIndex = 0;
  state.nature.score = 0;
  state.nature.shuffledQuestions = [...state.nature.category.questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);

  startNatureTimer();
  updateNatureStats();
  window.switchView('quiz');
}

function startNatureTimer() {
  if (state.nature.timerInterval) clearInterval(state.nature.timerInterval);
  state.nature.startTime = Date.now();
  updateNatureTimerDisplay();
  state.nature.timerInterval = setInterval(updateNatureTimerDisplay, 1000);
}

function updateNatureTimerDisplay() {
  const elapsedSeconds = Math.floor((Date.now() - state.nature.startTime) / 1000);
  timerText.innerText = `⏱️ ${formatTime(elapsedSeconds)}`;
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateNatureStats() {
  correctCountText.innerText = `✅ ${state.nature.score}`;
}

function renderNatureQuestion() {
  const question = state.nature.shuffledQuestions[state.nature.currentQuestionIndex];
  const total = state.nature.shuffledQuestions.length;
  const current = state.nature.currentQuestionIndex + 1;

  questionText.innerText = question.question;
  statsText.innerText = `Pytanie ${current}/${total}`;
  progressBar.style.width = `${(current / total) * 100}%`;
  btnNext.classList.add('hidden');

  optionsList.innerHTML = '';
  question.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = opt;
    btn.addEventListener('click', () => handleNatureAnswer(idx));
    optionsList.appendChild(btn);
  });
}

function handleNatureAnswer(selectedIndex) {
  const question = state.nature.shuffledQuestions[state.nature.currentQuestionIndex];
  const isCorrect = selectedIndex === question.correct;

  const buttons = optionsList.querySelectorAll('.option-btn');
  buttons.forEach((btn, idx) => {
    btn.style.pointerEvents = 'none';
    if (idx === question.correct) btn.classList.add('correct');
    if (idx === selectedIndex && !isCorrect) btn.classList.add('wrong');
  });

  if (isCorrect) {
    state.nature.score++;
    updateNatureStats();
    showNatureFeedback('✅', 'Wspaniale!');
  } else {
    showNatureFeedback('❌', 'Ups! Prawie...');
  }

  btnNext.classList.remove('hidden');
}

function showNatureFeedback(emoji, text) {
  feedbackEmoji.innerText = emoji;
  feedbackText.innerText = text;
  feedback.style.display = 'flex';
  setTimeout(() => {
    feedback.style.display = 'none';
  }, 1000);
}

function nextNatureQuestion() {
  state.nature.currentQuestionIndex++;
  if (state.nature.currentQuestionIndex < state.nature.shuffledQuestions.length) {
    render();
  } else {
    window.switchView('nature-result');
  }
}

function showNatureResults() {
  const elapsedSeconds = Math.floor((Date.now() - state.nature.startTime) / 1000);
  const total = state.nature.shuffledQuestions.length;
  const score = state.nature.score;

  document.getElementById('result-score').innerText = `Twój wynik: ${score}/${total}`;
  document.getElementById('result-time').innerText = `Czas: ${formatTime(elapsedSeconds)}`;

  let msg = '';
  let emoji = '';
  if (score === total) { msg = 'Perfekcyjnie! 🌟'; emoji = '🏆'; }
  else if (score >= total * 0.7) { msg = 'Świetnie Ci poszło! 👏'; emoji = '🌟'; }
  else { msg = 'Dobra robota! 💪'; emoji = '👍'; }

  document.getElementById('result-message').innerText = msg;
  document.getElementById('result-emoji').innerText = emoji;
}

init();
