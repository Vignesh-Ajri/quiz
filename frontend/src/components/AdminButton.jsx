import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

const AdminButton = () => (
  <Link
    to="/admin"
    className="flex items-center space-x-2 px-2 py-2
      bg-indigo-50 dark:bg-indigo-900/20 
      text-indigo-600 dark:text-indigo-400 
      rounded-lg font-medium 
      hover:bg-indigo-100 dark:hover:bg-indigo-900/40 
      transition-all duration-200 
      focus:outline-none focus:ring-2 
      focus:ring-indigo-500 focus:ring-offset-2"
  >
    <Shield className="h-4 w-4" />
    <span>Admin Panel</span>
  </Link>
);

export default AdminButton;
