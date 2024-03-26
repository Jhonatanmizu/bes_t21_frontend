import { FaRankingStar } from "react-icons/fa6";

const LevelIcon = ({ ...props }) => {
  return <FaRankingStar className={`text-2xl ${props.className}`} />;
};

export default LevelIcon;
