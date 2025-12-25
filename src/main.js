import './style.css'

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

const EMOJIS = ['🚀', '🪐', '🦖', '⚽', '🍦', '🎮', '🦄', '🌈']

function render(isNewView = false) {
  const app = document.querySelector('#app')

  if (state.currentView === 'dashboard') {
    renderDashboard(app, isNewView)
  } else if (state.currentView === 'math') {
    renderMathGame(app, isNewView)
  } else if (state.currentView === 'memory') {
    renderMemoryGame(app, isNewView)
  } else if (state.currentView === 'courier') {
    renderCourierGame(app, isNewView)
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

// MATH GAME LOGIC
function generateMathProblem() {
  const ops = ['+', '-', '*']
  const op = ops[Math.floor(Math.random() * ops.length)]
  let a, b, answer

  if (op === '+') {
    a = Math.floor(Math.random() * 50) + 1
    b = Math.floor(Math.random() * 50) + 1
    answer = a + b
  } else if (op === '-') {
    a = Math.floor(Math.random() * 50) + 20
    b = Math.floor(Math.random() * a)
    answer = a - b
  } else {
    a = Math.floor(Math.random() * 10) + 1
    b = Math.floor(Math.random() * 10) + 1
    answer = a * b
  }

  state.math.problem = { a, b, op, answer }
}

function renderMathGame(container, isNewView) {
  if (state.math.problem.a === 0) generateMathProblem()

  const opSymbol = state.math.problem.op === '*' ? '×' : state.math.problem.op

  container.innerHTML = `
    <div class="app-view ${isNewView ? 'view-enter' : ''}">
      <button class="btn back-btn" onclick="window.switchView('dashboard')">← Powrót do menu</button>
      
      <div class="math-game">
        <h2>Mistrz Matematyki 🏆</h2>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Punkty</span>
            <span>${state.math.score}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Seria</span>
            <span>${state.math.streak} 🔥</span>
          </div>
        </div>

        <div class="problem-card">
          ${state.math.problem.a} ${opSymbol} ${state.math.problem.b} = ?
        </div>

        <div class="${state.math.messageType}-message">${state.math.message}</div>

        <input type="number" id="math-answer" class="answer-input" placeholder="..." autofocus>
        
        <p>Wpisz wynik i naciśnij <strong>Enter</strong></p>
      </div>
    </div>
  `

  const input = document.querySelector('#math-answer')
  if (input) {
    input.focus()
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const val = parseInt(input.value)
        if (val === state.math.problem.answer) {
          state.math.score += 10 + state.math.streak
          state.math.streak++
          state.math.message = 'Brawo! Super wynik! 🎉'
          state.math.messageType = 'success'
          generateMathProblem()
          render()
        } else {
          state.math.streak = 0
          state.math.message = 'Ojej, spróbuj jeszcze raz! 💪'
          state.math.messageType = 'error'
          render()
        }
      }
    })
  }
}

// MEMORY GAME LOGIC
function initMemoryGame() {
  const pairs = EMOJIS.concat(EMOJIS)
  state.memory.cards = pairs
    .sort(() => Math.random() - 0.5)
    .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))
  state.memory.flipped = []
  state.memory.matched = []
  state.memory.moves = 0
  state.memory.isProcessing = false
}

function renderMemoryGame(container, isNewView) {
  if (state.memory.cards.length === 0) initMemoryGame()

  container.innerHTML = `
    <div class="app-view ${isNewView ? 'view-enter' : ''}">
      <button class="btn back-btn" onclick="window.switchView('dashboard')">← Powrót do menu</button>
      
      <div class="memory-game">
        <h2>Kraina Pamięci 🧩</h2>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Ruchy</span>
            <span>${state.memory.moves}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Znalezione</span>
            <span>${state.memory.matched.length / 2} / ${EMOJIS.length}</span>
          </div>
        </div>

        <div class="memory-grid">
          ${state.memory.cards.map(card => `
            <div class="memory-card ${state.memory.flipped.includes(card.id) ? 'flipped' : ''} ${state.memory.matched.includes(card.id) ? 'matched' : ''}" 
                 onclick="window.handleMemoryClick(${card.id})">
              <div class="card-back"></div>
              <div class="card-front">${card.emoji}</div>
            </div>
          `).join('')}
        </div>

        ${state.memory.matched.length === state.memory.cards.length ? `
          <div class="success-message">Gratulacje! Ukończyłeś grę w ${state.memory.moves} ruchach! 🎊</div>
          <button class="btn btn-primary" onclick="window.handleResetMemory()">Zagraj ponownie</button>
        ` : ''}
      </div>
    </div>
  `
}

window.handleMemoryClick = (id) => {
  const { memory } = state
  if (memory.isProcessing) return
  if (memory.flipped.includes(id)) return
  if (memory.matched.includes(id)) return
  if (memory.flipped.length === 2) return

  memory.flipped.push(id)

  if (memory.flipped.length === 2) {
    memory.moves++
    const [id1, id2] = memory.flipped
    const card1 = memory.cards[id1]
    const card2 = memory.cards[id2]

    if (card1.emoji === card2.emoji) {
      memory.matched.push(id1, id2)
      memory.flipped = []
      render()
    } else {
      memory.isProcessing = true
      render()
      setTimeout(() => {
        memory.flipped = []
        memory.isProcessing = false
        render()
      }, 1000)
    }
  } else {
    render()
  }
}

window.handleResetMemory = () => {
  initMemoryGame()
  render()
}

// COURIER GAME LOGIC
function generateCourierProblem() {
  const categories = ['weight', 'currency', 'distance', 'time']
  const type = categories[Math.floor(Math.random() * categories.length)]
  let question = ''
  let answer = 0
  let unit = ''

  if (type === 'weight') {
    const subType = Math.floor(Math.random() * 3)
    if (subType === 0) {
      const kg = Math.floor(Math.random() * 5) + 1
      question = `Ile to gramów (g): ${kg} kg?`
      answer = kg * 1000
    } else if (subType === 1) {
      const g = (Math.floor(Math.random() * 9) + 1) * 100
      question = `Ile to dekagramów (dag): ${g} g?`
      answer = g / 10
    } else {
      const dag = (Math.floor(Math.random() * 5) + 1) * 10
      question = `Paczka waży ${dag} dag. Ile to gramów (g)?`
      answer = dag * 10
    }
  } else if (type === 'currency') {
    const subType = Math.floor(Math.random() * 2)
    if (subType === 0) {
      const zl = Math.floor(Math.random() * 10) + 1
      const gr = (Math.floor(Math.random() * 9) + 1) * 10
      question = `Masz ${zl} zł i ${gr} gr. Ile to razem groszy?`
      answer = zl * 100 + gr
    } else {
      const total = 1000 // 10 zł
      const costGr = (Math.floor(Math.random() * 8) + 1) * 100 + (Math.floor(Math.random() * 9) * 10)
      const costZl = costGr / 100
      question = `Paczka kosztuje ${costZl.toFixed(2).replace('.', ',')} zł. Płacisz 10 zł. Ile groszy reszty?`
      answer = total - costGr
    }
  } else if (type === 'distance') {
    const subType = Math.floor(Math.random() * 2)
    if (subType === 0) {
      const km = Math.floor(Math.random() * 3) + 1
      const m = (Math.floor(Math.random() * 9) + 1) * 50
      question = `Do klienta jest ${km} km i ${m} m. Ile to metrów?`
      answer = km * 1000 + m
    } else {
      const m = Math.floor(Math.random() * 5) + 2
      const cm = Math.floor(Math.random() * 90) + 10
      question = `Sznurek ma ${m} m. Odciąłeś ${cm} cm. Ile cm zostało?`
      answer = (m * 100) - cm
    }
  } else if (type === 'time') {
    const subType = Math.floor(Math.random() * 3)
    if (subType === 0) {
      const h = Math.floor(Math.random() * 2) + 1
      question = `Ile minut trwa podróż, jeśli jedziesz ${h === 1 ? '1 godzinę' : h + ' godziny'}?`
      answer = h * 60
    } else if (subType === 1) {
      const quarters = Math.floor(Math.random() * 4) + 1
      question = `Ile minut to ${quarters} ${quarters === 1 ? 'kwadrans' : 'kwadranse'}?`
      answer = quarters * 15
    } else {
      const startH = 12
      const startM = 15
      const diff = (Math.floor(Math.random() * 3) + 1) * 15
      question = `Wystartowałeś o 12:15. Twoja trasa trwa ${diff} minut. Ile minut po 12:00 będziesz na miejscu?`
      answer = startM + diff
    }
  }

  state.courier.problem = { question, answer, type }
}

function renderCourierGame(container, isNewView) {
  if (state.courier.problem.question === '') generateCourierProblem()

  const typeIcons = {
    weight: '⚖️',
    currency: '💰',
    distance: '📏',
    time: '⏱️'
  }

  container.innerHTML = `
    <div class="app-view ${isNewView ? 'view-enter' : ''}">
      <button class="btn back-btn" onclick="window.switchView('dashboard')">← Powrót do menu</button>
      
      <div class="courier-game">
        <header class="game-header">
          <div class="header-main">
            <span class="game-icon">🚚</span>
            <h2>Kurier Julek</h2>
          </div>
          <div class="category-tag">
            ${typeIcons[state.courier.problem.type]} ${state.courier.problem.type.toUpperCase()}
          </div>
        </header>
        
        <div class="stats">
          <div class="stat-item">
            <span class="stat-label">Paczki</span>
            <span>${state.courier.score}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Seria</span>
            <span>${state.courier.streak} 🔥</span>
          </div>
        </div>

        <div class="problem-card courier-problem">
          <div class="courier-illustration">📦</div>
          <div class="question-text">${state.courier.problem.question}</div>
        </div>

        <div class="feedback-area ${state.courier.messageType}">
          ${state.courier.message}
        </div>

        <div class="input-group">
          <input type="number" id="courier-answer" class="answer-input" placeholder="Wynik..." autofocus>
          <button class="btn btn-primary" onclick="window.checkCourierAnswer()">Dostarcz!</button>
        </div>
        
        <p class="hint">Wpisz liczbę i naciśnij <strong>Enter</strong> lub przycisk</p>
      </div>
    </div>
  `

  const input = document.querySelector('#courier-answer')
  if (input) {
    input.focus()
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        window.checkCourierAnswer()
      }
    })
  }
}

window.checkCourierAnswer = () => {
  const input = document.querySelector('#courier-answer')
  if (!input) return

  const val = parseInt(input.value)
  if (val === state.courier.problem.answer) {
    state.courier.score += 1
    state.courier.streak++
    state.courier.message = 'Świetnie! Paczka dostarczona! 🌟'
    state.courier.messageType = 'success'
    generateCourierProblem()
    render()
  } else {
    state.courier.streak = 0
    state.courier.message = 'Ups! Coś się pomyliło. Spróbuj jeszcze raz! 💪'
    state.courier.messageType = 'error'
    render()
  }
}

// Global exposure for onclick handlers
window.switchView = (view) => {
  if (view === 'memory') initMemoryGame()
  if (view === 'courier') {
    state.courier.message = ''
    state.courier.messageType = ''
  }
  state.currentView = view
  render(true)
}

// Initial render
render(true)
