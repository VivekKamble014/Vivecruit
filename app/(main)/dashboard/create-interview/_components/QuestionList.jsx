import React, { use } from 'react'

export default function QuestionList({formData}) {

useEffect(() => {
  if(formData)
  {
    GenerateQuestionList();
  }

},[formData]) // useEffect to handle formData changes

  const GenerateQuestionList=()=>{

  }

  return (
    <div>
      <h1>Genrate</h1>
    </div>
  )
}
