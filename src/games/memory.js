export const EMOJIS = ['🚀', '🪐', 'REX', '⚽', '🍦', '🎮', '🦄', '🌈']

export function initMemoryGame(state) {
    const emojis = ['🚀', '🪐', '🦖', '⚽', '🍦', '🎮', '🦄', '🌈']
    const pairs = emojis.concat(emojis)
    state.memory.cards = pairs
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({ id: index, emoji, flipped: false, matched: false }))
    state.memory.flipped = []
    state.memory.matched = []
    state.memory.moves = 0
    state.memory.isProcessing = false
}

export function renderMemoryGame(container, isNewView, state, render) {
    if (state.memory.cards.length === 0) initMemoryGame(state)

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
            <span>${state.memory.matched.length / 2} / 8</span>
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

export function handleMemoryClick(id, state, render) {
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
