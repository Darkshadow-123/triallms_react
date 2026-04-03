import { useState } from 'react'

const Quiz = ({ quiz }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('')
  const [quizResult, setQuizResult] = useState(null)

  const handleSubmit = () => {
    setQuizResult(null)

    if (selectedAnswer) {
      if (selectedAnswer === quiz.answer) {
        setQuizResult('correct')
      } else {
        setQuizResult('Incorrect')
      }
    } else {
      alert('Select Answer First')
    }
  }

  return (
    <div>
      <h3>{quiz.question}</h3>

      <div className="control">
        <label className="radio">
          <input
            type="radio"
            value={quiz.op1}
            checked={selectedAnswer === quiz.op1}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
          {' '}{quiz.op1}
        </label>
      </div>

      <div className="control">
        <label className="radio">
          <input
            type="radio"
            value={quiz.op2}
            checked={selectedAnswer === quiz.op2}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
          {' '}{quiz.op2}
        </label>
      </div>

      <div className="control">
        <label className="radio">
          <input
            type="radio"
            value={quiz.op3}
            checked={selectedAnswer === quiz.op3}
            onChange={(e) => setSelectedAnswer(e.target.value)}
          />
          {' '}{quiz.op3}
        </label>
      </div>

      <div className="control mt-4">
        <button className="button is-info" onClick={handleSubmit}>Submit</button>
      </div>

      {quizResult === 'correct' && (
        <div className="notification is-success mt-4">Correct !</div>
      )}

      {quizResult === 'Incorrect' && (
        <div className="notification is-danger mt-4">Wrong !! Please Try Again!</div>
      )}
    </div>
  )
}

export default Quiz
