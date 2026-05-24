import { useState, useEffect } from 'react'

const Quiz = ({ quiz }) => {
  const quizList = Array.isArray(quiz) ? quiz : []
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizStarted, setQuizStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [quizResults, setQuizResults] = useState({})

  const currentQuiz = quizList[currentQuizIndex]

  // Timer effect
  useEffect(() => {
    if (!quizStarted || quizCompleted) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitAllQuizzes()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, quizCompleted])

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setTimeLeft(60)
    setSelectedAnswers({})
    setQuizResults({})
    setQuizCompleted(false)
    setCurrentQuizIndex(0)
  }

  const handleSubmitAllQuizzes = () => {
    const results = {}
    let correctCount = 0

    quizList.forEach(q => {
      const selectedAnswer = selectedAnswers[q.id]
      
      if (!selectedAnswer) {
        results[q.id] = 'unanswered'
      } else if (selectedAnswer === q.answer) {
        results[q.id] = 'correct'
        correctCount++
      } else {
        results[q.id] = 'incorrect'
      }
    })

    setQuizResults(results)
    setQuizCompleted(true)
  }

  const handleNextQuiz = () => {
    if (currentQuizIndex < quizList.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1)
    }
  }

  const handlePreviousQuiz = () => {
    if (currentQuizIndex > 0) {
      setCurrentQuizIndex(currentQuizIndex - 1)
    }
  }

  const correctCount = Object.values(quizResults).filter(r => r === 'correct').length
  const totalQuizzes = quizList.length

  return (
    <div>
      {!quizStarted && (
        <div className="mb-4">
          <button className="button is-primary" onClick={handleStartQuiz}>
            Start Quiz ({totalQuizzes} questions)
          </button>
        </div>
      )}

      {quizStarted && !quizCompleted && (
        <>
          <div className="box mb-4">
            <div className="level">
              <div className="level-left">
                <p className="has-text-weight-bold">
                  Question {currentQuizIndex + 1} of {totalQuizzes}
                </p>
              </div>
              <div className="level-right">
                <p className="has-text-weight-bold">
                  Time Left: <span className={timeLeft <= 10 ? 'has-text-danger' : 'has-text-info'}>
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                  </span>
                </p>
              </div>
            </div>
            <progress className="progress is-info" value={timeLeft} max="60"></progress>
          </div>

          {currentQuiz && (
            <>
              <div className="control mb-4">
                <h3>{currentQuiz.question}</h3>
              </div>

              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    value={currentQuiz.op1}
                    checked={selectedAnswers[currentQuiz.id] === currentQuiz.op1}
                    onChange={(e) => setSelectedAnswers({...selectedAnswers, [currentQuiz.id]: e.target.value})}
                  />
                  {' '}{currentQuiz.op1}
                </label>
              </div>

              <div className="control">
                <label className="radio">
                  <input
                    type="radio"
                    value={currentQuiz.op2}
                    checked={selectedAnswers[currentQuiz.id] === currentQuiz.op2}
                    onChange={(e) => setSelectedAnswers({...selectedAnswers, [currentQuiz.id]: e.target.value})}
                  />
                  {' '}{currentQuiz.op2}
                </label>
              </div>

              <div className="control mb-4">
                <label className="radio">
                  <input
                    type="radio"
                    value={currentQuiz.op3}
                    checked={selectedAnswers[currentQuiz.id] === currentQuiz.op3}
                    onChange={(e) => setSelectedAnswers({...selectedAnswers, [currentQuiz.id]: e.target.value})}
                  />
                  {' '}{currentQuiz.op3}
                </label>
              </div>

              <div className="control mt-4 level">
                <div className="level-left">
                  <button 
                    className="button is-info mr-2" 
                    onClick={handlePreviousQuiz}
                    disabled={currentQuizIndex === 0}
                  >
                    Previous
                  </button>
                </div>
                <div className="level-right">
                  {currentQuizIndex === quizList.length - 1 ? (
                    <button 
                      className="button is-success" 
                      onClick={handleSubmitAllQuizzes}
                    >
                      Submit All Answers
                    </button>
                  ) : (
                    <button 
                      className="button is-info" 
                      onClick={handleNextQuiz}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {quizCompleted && (
        <div className="box has-text-centered">
          <h2 className="title is-3">Quiz Complete!</h2>
          <p className="title is-4">You scored {correctCount}/{totalQuizzes} correct</p>
          
          <div className="mt-6">
            <h3 className="title is-5">Results Summary</h3>
            {quizList.map((q, index) => (
              <div key={q.id} className="mb-4 p-4" style={{backgroundColor: '#f5f5f5', borderLeft: `4px solid ${quizResults[q.id] === 'correct' ? '#48c774' : quizResults[q.id] === 'incorrect' ? '#f14668' : '#ffdd57'}`}}>
                <p className="mb-2"><strong>Question {index + 1}: {q.question}</strong></p>
                <p className="mb-2">Your answer: <strong>{selectedAnswers[q.id] || 'Not answered'}</strong></p>
                <p className="mb-2">Correct answer: <strong>{q.answer}</strong></p>
                <p className="mb-2">
                  Status: {' '}
                  {quizResults[q.id] === 'correct' && <span className="tag is-success">Correct</span>}
                  {quizResults[q.id] === 'incorrect' && <span className="tag is-danger">Incorrect</span>}
                  {quizResults[q.id] === 'unanswered' && <span className="tag is-warning">Unanswered</span>}
                </p>
              </div>
            ))}
          </div>

          <button className="button is-primary mt-4" onClick={handleStartQuiz}>
            Restart Quiz
          </button>
        </div>
      )}
    </div>
  )
}

export default Quiz
