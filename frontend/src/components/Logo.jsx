import { Brain } from "lucide-react";
import { Link } from "react-router-dom";

const Logo = ({ mobile = false }) => {
  return (
    <Link to={"/"}>
      <div className="flex items-center space-x-3">
        {!mobile && (
          <div className="bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
            <Brain className="h-7 w-7 text-white" />
          </div>
        )}
        <span className="text-3xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent cursor-pointer">
          QuizMaster
        </span>
      </div>
    </Link>
  );
};

export default Logo;
