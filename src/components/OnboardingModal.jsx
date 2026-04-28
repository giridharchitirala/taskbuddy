import { useState } from 'react'

const STEPS = [
  { title: 'Welcome to TaskBuddy! 🎉', body: 'Your personal task management companion just got a major upgrade. Track tasks, earn achievements, and build productivity streaks.' },
  { title: 'Your Dashboard 📊', body: 'View your stats, completion rate, daily streak, and unlock achievements as you complete tasks.' },
  { title: 'Gamification 🎮', body: 'Earn XP, level up, and collect badges. Try to maintain your daily login streak!' },
  { title: 'Power Features ⚡', body: 'Pin important tasks, use bulk actions, undo mistakes, and organize with custom categories.' },
]

function OnboardingModal({ isOpen, onClose, darkMode }) {
  const [step, setStep] = useState(0)
  if (!isOpen) return null

  const overlay = 'fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4'
  const card = `w-full max-w-md p-6 rounded-xl border shadow-2xl ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-200 text-gray-800'}`

  return (
    <div className={overlay}>
      <div className={card}>
        <div className="mb-4">
          <div className="flex gap-1 mb-4">
            {STEPS.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-primary-500' : darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
            ))}
          </div>
          <h3 className="text-xl font-bold mb-2">{STEPS[step].title}</h3>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{STEPS[step].body}</p>
        </div>
        <div className="flex justify-between">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className={`px-4 py-2 text-sm rounded-lg border ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}`}
            >
              Back
            </button>
          ) : (
            <div />
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg bg-primary-600 text-white hover:bg-primary-700"
            >
              Get Started
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default OnboardingModal

