export function generateCourierProblem(state) {
    const categories = ['weight', 'currency', 'distance', 'time']
    const type = categories[Math.floor(Math.random() * categories.length)]
    let question = ''
    let answer = 0

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
            const startM = 15
            const diff = (Math.floor(Math.random() * 3) + 1) * 15
            question = `Wystartowałeś o 12:15. Twoja trasa trwa ${diff} minut. Ile minut po 12:00 będziesz na miejscu?`
            answer = startM + diff
        }
    }

    state.courier.problem = { question, answer, type }
}

export function renderCourierGame(container, isNewView, state, render) {
    if (state.courier.problem.question === '') generateCourierProblem(state)

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

export function checkCourierAnswer(state, render) {
    const input = document.querySelector('#courier-answer')
    if (!input) return

    const val = parseInt(input.value)
    if (val === state.courier.problem.answer) {
        state.courier.score += 1
        state.courier.streak++
        state.courier.message = 'Świetnie! Paczka dostarczona! 🌟'
        state.courier.messageType = 'success'
        generateCourierProblem(state)
        render()
    } else {
        state.courier.streak = 0
        state.courier.message = 'Ups! Coś się pomyliło. Spróbuj jeszcze raz! 💪'
        state.courier.messageType = 'error'
        render()
    }
}
