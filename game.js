class CalorieDuelGame {
    constructor() {
        this.gameState = {
            turn: 1,
            phase: 0, // 0: 朝食, 1: 昼食, 2: 夕食
            phases: ['朝食', '昼食', '夕食'],
            maxTurns: 7,
            gameEnded: false
        };
        
        this.players = {
            player1: {
                name: 'プレイヤー1',
                calories: 0,
                targetCalories: 2000,
                maxCalories: 2500,
                minCalories: 1200,
                baseMetabolism: 1500,
                hand: [],
                playedCard: null,
                effects: {},
                penalties: 0
            },
            player2: {
                name: 'CPU',
                calories: 0,
                targetCalories: 2000,
                maxCalories: 2500,
                minCalories: 1200,
                baseMetabolism: 1500,
                hand: [],
                playedCard: null,
                effects: {},
                penalties: 0
            }
        };
        
        this.deck = [];
        this.selectedCard = null;
        this.cpuSelectedCard = null;
        
        this.initializeUI();
    }
    
    initializeUI() {
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('reset-game').addEventListener('click', () => this.resetGame());
        document.getElementById('new-game').addEventListener('click', () => this.resetGame());
        document.getElementById('resolve-turn').addEventListener('click', () => this.resolveTurn());
    }
    
    startGame() {
        this.deck = createDeck();
        
        this.players.player1.hand = drawCards(this.deck, 7);
        this.players.player2.hand = drawCards(this.deck, 7);
        
        document.getElementById('start-game').style.display = 'none';
        document.getElementById('reset-game').style.display = 'inline-block';
        
        this.updateUI();
        this.renderPlayerHand();
        this.updateGameInfo();
    }
    
    resetGame() {
        this.gameState = {
            turn: 1,
            phase: 0,
            phases: ['朝食', '昼食', '夕食'],
            maxTurns: 7,
            gameEnded: false
        };
        
        Object.keys(this.players).forEach(key => {
            this.players[key].calories = 0;
            this.players[key].hand = [];
            this.players[key].playedCard = null;
            this.players[key].effects = {};
            this.players[key].penalties = 0;
        });
        
        this.selectedCard = null;
        this.cpuSelectedCard = null;
        
        document.getElementById('start-game').style.display = 'inline-block';
        document.getElementById('reset-game').style.display = 'none';
        document.getElementById('game-result').style.display = 'none';
        document.getElementById('resolve-turn').style.display = 'none';
        
        document.getElementById('player1-played').innerHTML = '';
        document.getElementById('player2-played').innerHTML = '';
        document.getElementById('player1-played').classList.remove('has-card');
        document.getElementById('player2-played').classList.remove('has-card');
        
        this.updateUI();
        this.updateGameInfo();
        document.getElementById('player-hand').innerHTML = '';
    }
    
    updateUI() {
        Object.keys(this.players).forEach((key, index) => {
            const playerNum = index + 1;
            const player = this.players[key];
            
            const caloriesSpan = document.getElementById(`player${playerNum}-calories`);
            const targetSpan = document.getElementById(`player${playerNum}-target`);
            const meterFill = document.getElementById(`player${playerNum}-meter`);
            const statusDiv = document.getElementById(`player${playerNum}-status`);
            
            caloriesSpan.textContent = Math.round(player.calories);
            targetSpan.textContent = player.targetCalories;
            
            const percentage = Math.max(0, Math.min(100, (player.calories / player.maxCalories) * 100));
            meterFill.style.width = `${percentage}%`;
            
            let status = '正常';
            let statusClass = 'normal';
            
            if (player.calories > player.maxCalories) {
                status = 'オーバーカロリー';
                statusClass = 'over';
            } else if (player.calories < player.minCalories) {
                status = 'エネルギー不足';
                statusClass = 'under';
            }
            
            statusDiv.textContent = status;
            statusDiv.className = `status ${statusClass}`;
        });
    }
    
    updateGameInfo() {
        document.getElementById('current-turn').textContent = this.gameState.turn;
        document.getElementById('current-phase').textContent = this.gameState.phases[this.gameState.phase];
    }
    
    renderPlayerHand() {
        const handContainer = document.getElementById('player-hand');
        handContainer.innerHTML = '';
        
        this.players.player1.hand.forEach((card, index) => {
            const cardElement = this.createCardElement(card, index);
            handContainer.appendChild(cardElement);
        });
    }
    
    createCardElement(card, index) {
        const cardDiv = document.createElement('div');
        cardDiv.className = `card ${card.type}`;
        cardDiv.dataset.index = index;
        
        const calorieText = card.calories > 0 ? `+${card.calories}` : `${card.calories}`;
        
        cardDiv.innerHTML = `
            <div class="card-name">${card.name}</div>
            <div class="card-calories">${calorieText} kcal</div>
            <div class="card-effect">${card.effect}</div>
        `;
        
        cardDiv.addEventListener('click', () => this.selectCard(card, index));
        
        return cardDiv;
    }
    
    selectCard(card, index) {
        if (this.gameState.gameEnded) return;
        
        document.querySelectorAll('.card').forEach(c => c.classList.remove('selected'));
        document.querySelector(`[data-index="${index}"]`).classList.add('selected');
        
        this.selectedCard = { card, index };
        
        this.cpuSelectCard();
        
        if (this.selectedCard && this.cpuSelectedCard) {
            document.getElementById('resolve-turn').style.display = 'inline-block';
        }
    }
    
    cpuSelectCard() {
        const availableCards = this.players.player2.hand;
        if (availableCards.length === 0) return;
        
        let selectedIndex;
        const currentCalories = this.players.player2.calories;
        
        if (currentCalories > this.players.player2.targetCalories + 200) {
            const exerciseCards = availableCards
                .map((card, index) => ({ card, index }))
                .filter(item => item.card.type === 'exercise');
            
            if (exerciseCards.length > 0) {
                const bestExercise = exerciseCards.reduce((best, current) => 
                    current.card.calories < best.card.calories ? current : best
                );
                selectedIndex = bestExercise.index;
            } else {
                selectedIndex = Math.floor(Math.random() * availableCards.length);
            }
        } else if (currentCalories < this.players.player2.targetCalories - 300) {
            const foodCards = availableCards
                .map((card, index) => ({ card, index }))
                .filter(item => item.card.type === 'food');
            
            if (foodCards.length > 0) {
                selectedIndex = foodCards[Math.floor(Math.random() * foodCards.length)].index;
            } else {
                selectedIndex = Math.floor(Math.random() * availableCards.length);
            }
        } else {
            selectedIndex = Math.floor(Math.random() * availableCards.length);
        }
        
        this.cpuSelectedCard = { 
            card: availableCards[selectedIndex], 
            index: selectedIndex 
        };
    }
    
    resolveTurn() {
        if (!this.selectedCard || !this.cpuSelectedCard) return;
        
        this.displayPlayedCards();
        
        setTimeout(() => {
            this.applyCardEffects();
            this.checkPenalties();
            this.nextPhase();
            
            this.players.player1.hand.splice(this.selectedCard.index, 1);
            this.players.player2.hand.splice(this.cpuSelectedCard.index, 1);
            
            if (this.players.player1.hand.length < 5 && this.deck.length > 0) {
                this.players.player1.hand.push(...drawCards(this.deck, 1));
                this.players.player2.hand.push(...drawCards(this.deck, 1));
            }
            
            this.selectedCard = null;
            this.cpuSelectedCard = null;
            
            document.getElementById('resolve-turn').style.display = 'none';
            
            this.updateUI();
            this.renderPlayerHand();
            this.updateGameInfo();
            
            if (this.checkGameEnd()) {
                this.endGame();
            }
        }, 2000);
    }
    
    displayPlayedCards() {
        const player1Played = document.getElementById('player1-played');
        const player2Played = document.getElementById('player2-played');
        
        player1Played.innerHTML = this.getCardDisplayHTML(this.selectedCard.card);
        player2Played.innerHTML = this.getCardDisplayHTML(this.cpuSelectedCard.card);
        
        player1Played.classList.add('has-card');
        player2Played.classList.add('has-card');
    }
    
    getCardDisplayHTML(card) {
        const calorieText = card.calories > 0 ? `+${card.calories}` : `${card.calories}`;
        return `
            <div class="card-name">${card.name}</div>
            <div class="card-calories">${calorieText} kcal</div>
            <div class="card-effect">${card.effect}</div>
        `;
    }
    
    applyCardEffects() {
        this.applyCardToPlayer(this.selectedCard.card, 'player1');
        this.applyCardToPlayer(this.cpuSelectedCard.card, 'player2');
        
        this.handleSpecialEffects(this.selectedCard.card, 'player1', 'player2');
        this.handleSpecialEffects(this.cpuSelectedCard.card, 'player2', 'player1');
    }
    
    applyCardToPlayer(card, playerId) {
        this.players[playerId].calories += card.calories;
        
        if (this.players[playerId].calories < 0) {
            this.players[playerId].calories = 0;
        }
    }
    
    handleSpecialEffects(card, playerId, opponentId) {
        if (!card.specialEffect) return;
        
        switch (card.specialEffect) {
            case 'opponent_calories_boost':
                this.players[opponentId].calories += 100;
                break;
            case 'opponent_exercise':
                this.players[opponentId].calories -= 100;
                if (this.players[opponentId].calories < 0) {
                    this.players[opponentId].calories = 0;
                }
                break;
            case 'both_players_calories':
                this.players[playerId].calories += Math.abs(card.calories);
                this.players[opponentId].calories += Math.abs(card.calories);
                break;
            case 'health_boost':
                this.players[playerId].maxCalories += 50;
                break;
            case 'metabolism_boost':
                this.players[playerId].baseMetabolism += 10;
                break;
        }
    }
    
    checkPenalties() {
        Object.keys(this.players).forEach(key => {
            const player = this.players[key];
            
            if (player.calories > player.maxCalories) {
                player.penalties++;
            } else if (player.calories < player.minCalories) {
                player.penalties++;
            }
        });
    }
    
    nextPhase() {
        this.gameState.phase++;
        
        if (this.gameState.phase >= this.gameState.phases.length) {
            this.gameState.phase = 0;
            this.gameState.turn++;
            
            Object.keys(this.players).forEach(key => {
                this.players[key].calories = Math.max(0, 
                    this.players[key].calories - (this.players[key].baseMetabolism / 3)
                );
            });
        }
    }
    
    checkGameEnd() {
        if (this.gameState.turn > this.gameState.maxTurns) {
            return true;
        }
        
        const player1Penalties = this.players.player1.penalties;
        const player2Penalties = this.players.player2.penalties;
        
        if (player1Penalties >= 3 || player2Penalties >= 3) {
            return true;
        }
        
        return false;
    }
    
    endGame() {
        this.gameState.gameEnded = true;
        
        const player1 = this.players.player1;
        const player2 = this.players.player2;
        
        let winner;
        
        if (player1.penalties >= 3 && player2.penalties >= 3) {
            winner = 'draw';
        } else if (player1.penalties >= 3) {
            winner = 'player2';
        } else if (player2.penalties >= 3) {
            winner = 'player1';
        } else {
            const player1Distance = Math.abs(player1.calories - player1.targetCalories);
            const player2Distance = Math.abs(player2.calories - player2.targetCalories);
            
            if (player1Distance < player2Distance) {
                winner = 'player1';
            } else if (player2Distance < player1Distance) {
                winner = 'player2';
            } else {
                winner = 'draw';
            }
        }
        
        this.displayGameResult(winner);
    }
    
    displayGameResult(winner) {
        const resultDiv = document.getElementById('game-result');
        const resultText = document.getElementById('result-text');
        
        let message;
        switch (winner) {
            case 'player1':
                message = 'あなたの勝利！';
                break;
            case 'player2':
                message = 'CPUの勝利！';
                break;
            case 'draw':
                message = '引き分け！';
                break;
        }
        
        resultText.textContent = message;
        resultDiv.style.display = 'flex';
    }
}

let game;

document.addEventListener('DOMContentLoaded', () => {
    game = new CalorieDuelGame();
});