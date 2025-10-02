class QuizGame {
    constructor() {
        this.score = 0;
        this.totalQuestions = 0;
        this.currentQuestion = 0;
        this.answers = [];
        this.timeStarted = Date.now();
        this.questions = [];
    }

    updateScore(questionIndex, selectedAnswer, correctAnswer, points = 1) {
        const isCorrect = selectedAnswer === correctAnswer;
        this.answers[questionIndex] = {
            selected: selectedAnswer,
            correct: correctAnswer,
            isCorrect: isCorrect,
            points: isCorrect ? points : 0,
            timestamp: Date.now()
        };

        if (isCorrect) {
            this.score += points;
        }
        return isCorrect;
    }
 
    loadQuestion(questionIndex) {
        if (questionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        this.currentQuestion = questionIndex;
        const question = this.questions[questionIndex];
        document.getElementById('questionText').textContent = question.text;
        document.getElementById('questionImage').src = question.image || '';
        this.renderAnswerOptions(question);
        this.updateProgressDisplay();
    }

    renderAnswerOptions(question) {
        const container = document.getElementById('answerContainer');
        container.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.onclick = () => this.selectAnswer(index);
            button.className = 'answer-option';
            container.appendChild(button);
        });
    }

    selectAnswer(answerIndex) {
        const question = this.questions[this.currentQuestion];
        const isCorrect = this.updateScore(this.currentQuestion, answerIndex, question.correctAnswer);
        this.showAnswerFeedback(isCorrect, question.explanation);
        
        // Disable all answer buttons
        document.querySelectorAll('.answer-option').forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === question.options[question.correctAnswer]) {
                btn.classList.add('correct');
            }
        });
        
        setTimeout(() => {
            this.loadQuestion(this.currentQuestion + 1);
        }, 2000);
    }

    showAnswerFeedback(isCorrect, explanation) {
        const feedbackDiv = document.getElementById('feedback');
        feedbackDiv.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
        feedbackDiv.innerHTML = `${isCorrect ? 'Correct!' : 'Not quite right'} ${explanation}`;
        feedbackDiv.style.display = 'block';
    }

    updateProgressDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('question-number').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = this.totalQuestions;
    }
    
    calculateResults() {
        const totalTime = Math.round((Date.now() - this.timeStarted) / 1000);
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        return {
            score: this.score,
            totalQuestions: this.questions.length,
            percentage: percentage,
            timeSpent: totalTime,
            answers: this.answers,
            performance: this.getPerformanceLevel(percentage)
        };
    }
    
    getPerformanceLevel(percentage) {
        if (percentage >= 90) return { level: 'Excellent', message: 'Outstanding work!' };
        if (percentage >= 80) return { level: 'Great', message: 'Nice job!' };
        if (percentage >= 70) return { level: 'Good', message: 'Well done!' };
        if (percentage >= 60) return { level: 'Okay', message: 'Not bad!' };
        return { level: 'Needs Work', message: 'Keep practicing!' };
    }

    showResults() {
        const results = this.calculateResults();
        const resultsHTML = `<h1>Quiz Complete!</h1>
        <p>${results.score}/${results.totalQuestions}</p>
        <p>${results.percentage}%</p>   
        <p>${results.performance.level}</p>
        <p>${results.performance.message}</p>
        <p>Completed in ${results.timeSpent} seconds</p>
        <button onclick="location.reload()">Try Again</button>
        <button onclick="quiz.shareResults()">Share Results</button>`;
        document.getElementById('quizContainer').innerHTML = resultsHTML;
    }

    shareResults() {
        const results = this.calculateResults();
        const shareText = `I just scored ${results.percentage}% on this quiz! Can you beat my score?`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Quiz Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
            alert('Results copied to clipboard!');
        }
    }
}

const sampleQuestions = [
    {
        text: "What's the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris has been the capital of France since 508 AD."
    },
    {
        text: "Which planet is closest to the Sun?",
        options: ["Venus", "Mercury", "Earth", "Mars"],
        correctAnswer: 1,
        explanation: "Mercury is the closest planet to the Sun, orbiting at about 36 million miles away."
    }
];

const quiz = new QuizGame();
quiz.questions = sampleQuestions;
quiz.totalQuestions = sampleQuestions.length;
quiz.loadQuestion(0);