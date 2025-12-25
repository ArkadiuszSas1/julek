import './style.css'
import { renderMathGame, generateMathProblem } from './games/math'
import { renderMemoryGame, initMemoryGame, handleMemoryClick } from './games/memory'
import { renderCourierGame, generateCourierProblem, checkCourierAnswer } from './games/courier'

const state = {
  currentView: 'dashboard',
  math: {
    score: 0,
    streak: 0,
    problem: { a: 0, b: 0, op: '+', answer: 0 },
    message: '',
    messageType: ''
  },
  memory: {
    cards: [],
    flipped: [],
    matched: [],
    moves: 0,
    isProcessing: false
  },
  courier: {
    score: 0,
    streak: 0,
    problem: { question: '', answer: 0, unit: '', type: '' },
    message: '',
    messageType: ''
  }
}

function render(isNewView = false) {
  const app = document.querySelector('#app')

  if (state.currentView === 'dashboard') {
    renderDashboard(app, isNewView)
  } else if (state.currentView === 'math') {
    renderMathGame(app, isNewView, state, render)
  } else if (state.currentView === 'memory') {
    renderMemoryGame(app, isNewView, state, render)
  } else if (state.currentView === 'courier') {
    renderCourierGame(app, isNewView, state, render)
  }
}

function renderDashboard(container, isNewView) {
  container.innerHTML = `
    <div class="dashboard ${isNewView ? 'view-enter' : ''}">
      <header class="welcome-section">
        <h1>Cześć Julek! 🚀</h1>
        <p>Co dzisiaj będziemy trenować? Wybierz swoją przygodę!</p>
      </header>

      <div class="apps-grid">
        <div class="glass-card" onclick="window.switchView('courier')">
          <div class="card-icon">🚚</div>
          <div class="card-title">Kurier Julek</div>
          <p class="card-desc">Rozwoź paczki i pomagaj mieszkańcom! Trenuj miary, wagi, czas i pieniądze.</p>
          <button class="btn btn-primary">Graj teraz</button>
        </div>

        <div class="glass-card" onclick="window.switchView('math')">
          <div class="card-icon">➕</div>
          <div class="card-title">Mistrz Matematyki</div>
          <p class="card-desc">Trenuj dodawanie, odejmowanie i tabliczkę mnożenia. Zostań matematycznym geniuszem!</p>
          <button class="btn btn-primary">Graj teraz</button>
        </div>

        <div class="glass-card" onclick="window.switchView('memory')">
          <div class="card-icon">🧩</div>
          <div class="card-title">Kraina Pamięci</div>
          <p class="card-desc">Trenuj swoją koncentrację i pamięć, odkrywając pary takich samych obrazków!</p>
          <button class="btn btn-primary">Graj teraz</button>
        </div>
      </div>
    </div>
  `
}

// Global exposure for onclick handlers
window.switchView = (view) => {
  if (view === 'memory') initMemoryGame(state)
  if (view === 'courier') {
    state.courier.message = ''
    state.courier.messageType = ''
  }
  state.currentView = view
  render(true)
}

window.handleMemoryClick = (id) => handleMemoryClick(id, state, render)
window.handleResetMemory = () => {
  initMemoryGame(state)
  render()
}
window.checkCourierAnswer = () => checkCourierAnswer(state, render)

// Initial render
render(true)
