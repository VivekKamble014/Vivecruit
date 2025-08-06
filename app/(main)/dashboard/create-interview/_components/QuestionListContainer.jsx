import React from 'react'

export default function QuestionListContainer({questionList}) {
  return (
    <div>
      <h2 className='font-bold text-lg'>Generated Interview Questions :</h2>
  <div className="p-6 bg-white shadow-md border border-gray-300 rounded-xl space-y-4">
    {questionList.map((item, index) => (
      <div
        key={index}
        className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
      >
        <h2 className="text-lg font-semibold text-gray-800">
          Question {index + 1}:
        </h2>
        <p className="text-gray-700 mt-1">{item.question}</p>
        <p className="text-sm text-violet-500 mt-2">
          <span className="font-medium">Type:</span> {item?.type}
        </p>
      </div>
    ))}
  </div>
    </div>
  )
}
