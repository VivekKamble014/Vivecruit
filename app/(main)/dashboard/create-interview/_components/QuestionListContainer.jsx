import React from 'react'
import { Trash2 } from 'lucide-react';

export default function QuestionListContainer({questionList, onRemoveQuestion}) {
  return (
    <div>
      <h2 className='font-bold text-lg'>Generated Interview Questions :</h2>
  <div className="p-6 bg-white shadow-md border border-gray-300 rounded-xl space-y-4">
    {questionList.map((item, index) => (
      <div
        key={index}
        className="p-4 bg-gray-50 border border-gray-200 rounded-lg relative group"
      >
        {onRemoveQuestion && (
          <button
            onClick={() => onRemoveQuestion(index)}
            className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
            title="Remove question"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
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
