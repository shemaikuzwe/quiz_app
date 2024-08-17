import quizImage from "../assets/image2.png"
export default function QuizImage(){
    return(
       <div className="flex justify-center items-center p-4">
         <img src={quizImage} alt="quiz" width={300} height={300}/>
       </div>
    );
}