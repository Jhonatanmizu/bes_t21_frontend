import { GiNotebook } from "react-icons/gi";

const CourseIcon = ({ ...props }) => {
  return <GiNotebook className={`text-2xl ${props.className}`} />;
};

export default CourseIcon;
