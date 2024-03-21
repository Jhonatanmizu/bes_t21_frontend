import { CiEdit } from "react-icons/ci";

const EditIcon = ({ ...props }) => {
  return <CiEdit className={`text-2xl ${props.className}`} />;
};

export default EditIcon;
