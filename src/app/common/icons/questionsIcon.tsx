import { BsPatchQuestionFill } from "react-icons/bs";

const QuestionIcon = ({ ...props }) => {
  return <BsPatchQuestionFill className={`text-2xl ${props.className}`} />;
};

export default QuestionIcon;
