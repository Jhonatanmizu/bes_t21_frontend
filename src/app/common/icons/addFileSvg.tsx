import { AiFillFileAdd } from "react-icons/ai";

const AddFileSvg = ({ ...props }) => {
  return (
    <AiFillFileAdd
      className={`w-[80%] h-[80%] text-slate-100 ${props.className}`}
    />
  );
};

export default AddFileSvg;
