import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 

function QuizCreation() {
  const [user, setUser] = useState(null);
  const [title,setTitle] = useState(null);
  const [questions, setQuestions] = useState([
    {
      question_title: "",
      options: ["", ""],
      correct_optionIdx: null,
      correct_option:null
    },
  ]);

  const createCookie = ()=>{
    Cookies.set("user",JSON.stringify({username:"ninj"}));
  }

  useEffect(() => {
    const userCookie = Cookies.get("user");
    if (userCookie) {
      const parsed = JSON.parse(userCookie);
      setUser(parsed.username);
    }
  }, []);

  const handleQuestionChange = (index, value) => {
    const replaceThing = [...questions];
    replaceThing[index].question_title = value;
    setQuestions(replaceThing);
  };

  const handleOptionChange = (index, oIndex, value) => {
    const replaceThing = [...questions];
    replaceThing[index].options[oIndex] = value;
    replaceThing[index].correct_option=replaceThing[index].options[replaceThing[index].correct_optionIdx];
    setQuestions(replaceThing);
  };

  const addOption = (index) => {
    const replaceThing = [...questions];
    if (replaceThing[index].options.length < 4) {
      replaceThing[index].options.push("");
      setQuestions(replaceThing);
    }
  };

  const removeOption = (index, oIndex) => {
    const replaceThing = [...questions];
    if (replaceThing[index].options.length > 2) {
      replaceThing[index].options.splice(oIndex, 1);
      if (replaceThing[index].correct_optionIdx === oIndex) {
        replaceThing[index].correct_optionIdx = null;
        replaceThing[index].correct_option=null;
      }
      setQuestions(replaceThing);
    }
  };

  const setcorrect_optiontion = (index, oIndex) => {
    const replaceThing = [...questions];
    replaceThing[index].correct_optionIdx = oIndex;
    replaceThing[index].correct_option=replaceThing[index].options[oIndex];
    setQuestions(replaceThing);
  };

  const addQuestion = () => {
    let exec = true;
    questions.forEach((question)=>{
        if(question.question_title=="" || question.options.length===0 || question.correct_optionIdx==null){
            
            exec=false;
            
            alert("FILL ALL THE FIELDS BEFORE ADDING ANOTHER QUESTION");
            return;
        }
        question.options.forEach((op)=>{
            if(op.length==0) {
            exec=false;
            alert("FILL ALL THE FIELDS BEFORE ADDING ANOTHER QUESTION");
            return;}
            });
    });
    if(exec){
    setQuestions([
      ...questions,
      { question_title: "", options: ["", ""], correct_optionIdx: null ,correct_option:null},
    ]);}

  };

  const handleCreateQuiz = async() => {
    if(!title){
        alert("Enter the title of the quiz");
        return;
    }

        let exec = true;
    questions.forEach((question)=>{
        if(question.question_title=="" || question.options.length===0 || question.correct_optionIdx==null){
            alert("Fill all the fields before creating the quiz");
            exec=false;
            return;
        }
        
        question.options.forEach((op)=>{
            if(op.length==0) {
            exec=false;
            alert("FILL ALL THE FIELDS BEFORE ADDING ANOTHER QUESTION");
            return;}
            });
    });
    if(exec){
        try{
            //Adding Questions
            let quesID;
            let quizID;
            let result = await axios.post("http://localhost:1234/questions/newmultiple",questions);
            if(result){
                console.log(result.data);
                quesID=result.data;
                console.log("Question IDS: "+quesID);
            }
            else{
                console.log("NO RESULT")
            }

            //Getting the userId from the username
            let userId = await axios.get(`http://localhost:1234/users/getid/${user}`)
            console.log(userId);
            let obj = {user_id:userId.data,quiz_title:title};
            //adding the quiz
            result = await axios.post("http://localhost:1234/quiz/create",obj);
            if(result){
                console.log(result.data)
                quizID=result.data;
            }
            else{
                console.log("NO RESULT")
            }

            //Adding Linkers
            let linkers=[];
            quesID.forEach((q)=>{
                linkers.push({quiz_id:quizID,quiz_ques:q});
            });
            console.log(linkers);

            result = await axios.post("http://localhost:1234/qtq/createMultiple",linkers);
            if(result){
                console.log(result.data)
            }
            else{
                console.log("NO RESULT")
            }
        }
        catch(e){
            console.log(e);
        }
}
  };

  const handleTitleChange = (e)=>{
    setTitle(e.target.value);
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-xl mb-4 text-gray-700">Kindly Login to Create a Quiz</p>
        <Link
          to="/login"
          className="text-blue-500 underline hover:text-blue-700"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Your Quiz</h1>

      
          <label className="mb-2 font-bold text-gray-800">Quiz Title:</label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter the title of the quiz"
            onChange={handleTitleChange}
          />

      {questions.map((q, index) => (
        <div
          key={index}
          className="bg-white shadow-md rounded-xl p-6 mb-6 border border-gray-200"
        >
          <label className="block mb-2 font-bold text-gray-800">
            Question {index + 1}
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter your question"
            value={q.question_title}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
          />

          {q.options.map((opt, oIndex) => (
            <div key={oIndex} className="flex items-center mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded mr-2"
                placeholder={`Option ${oIndex + 1}`}
                value={opt}
                onChange={(e) =>
                  handleOptionChange(index, oIndex, e.target.value)
                }
              />
              <input
                type="radio"
                name={`correct-${index}`}
                checked={q.correct_optionIdx === oIndex}
                onChange={() => setcorrect_optiontion(index, oIndex)}
              />
              <span className="ml-1 text-sm text-gray-600">Correct</span>
              {q.options.length > 2 && (
                <button
                  onClick={() => removeOption(index, oIndex)}
                  className="ml-2 text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          ))}

          {q.options.length < 4 && (
            <button
              onClick={() => addOption(index)}
              className="mt-2 text-sm text-blue-500 hover:underline"
            >
              + Add Option
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-4">
        <button
          onClick={addQuestion}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
        >
          + Add Another Question
        </button>

        <button
          onClick={handleCreateQuiz}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Quiz
        </button>
      </div>
    </div>
  );
}

export default QuizCreation;
