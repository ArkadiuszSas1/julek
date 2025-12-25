export function generateMathProblem(state) {
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

export function renderMathGame(container, isNewView, state, render) {
    if (state.math.problem.a === 0) generateMathProblem(state)

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
                    generateMathProblem(state)
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
