import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const Intro = () => {
  
  const navigate = useNavigate();
  const [category, setCategory] = useState("category");
  const[difficulty,setDifficulty]=useState("sfficulty");
  const [submit, setSubmit] = useState(false);
   const [limit,setLimit]=useState(5);
  const handleSubmit = () => {
    navigate(`/questions?category=${category}&limit=${limit}&difficulty=medium`);
  };
  const handleCategory=(e)=>{
      setCategory(e);
      if (e=="category"){
          return setSubmit(false)
      }
      return  setSubmit(true)
  }
  const handleDifficulty=(e)=>{
    setCategory(e);
    if (e=="category"){
        return setSubmit(false)
    }
    return  setSubmit(true)
}
  const  handleLimit=(e)=>{
      setLimit(e)
  }

  const categories = [
    {
      value: "history",
      name: "History",
    },
    {
      value: "general_knowledge",
      name: "General knowledge",
    },
    {
      value: "science",
      name: "Science",
    },
    {
      value: "music",
      name: "Music",
    },
    {
      value: "society_and_culture",
      name: "society and culture",
    },
    {
      value: "geography",
      name: "Geography",
    },
  ];
  return (
    <div className=" m-20 border p-5 flex flex-col gap-7 rounded justify-center items-center">
      <h3 className="mt-3 text-2xl  text-center font-bold">Quiz App</h3>
         <div className={"w-full p-2 border-b-1"}>

         </div>
      <select
        className={
          "block p-3 border border-indigo-700 rounded w-64 focus:border-indigo-700 outline-0"
        }
        onChange={(event)=>handleCategory(event.target.value)}
      >
        <option>category</option>
        {categories.map((item) => (
          <option key={item.name} value={item.value}>
            {item.name}
          </option>
        ))}
      </select>
      <select
        className={
          "block p-3 border border-indigo-700 rounded w-64 focus:border-indigo-700 outline-0"
        }
      >
        <option>Difficulty</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>
      <label className={"text-indigo-700 font-bold text-xl"}>
        Total Questions: {limit}
      </label>
        <input type={"range"}  onChange={(e)=>handleLimit(e.target.value)} min={5} max={50} value={limit} className={"text-indigo-300 bg-indigo-700"}/>
      <button
        className={
          `block px-5 py-1.5 outline-0  text-white rounded hover:bg-indigo-500 ${submit ? "cursor-pointer bg-indigo-700":"cursor-not-allowed bg-indigo-500"}`
        }
        type={"submit"}
        disabled={!submit}
       onClick={handleSubmit}
      >
        Start quiz
      </button>
    </div>
  );
};

export default Intro;
