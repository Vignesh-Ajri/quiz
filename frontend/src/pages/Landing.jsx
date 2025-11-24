import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaChalkboardTeacher, FaClock, FaChartBar } from "react-icons/fa";
import { Play, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Footer from "../components/Footer";
import quizimg from "../assets/quiz2.png";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-tr from-white via-indigo-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <main className="min-h-[80vh] flex flex-1 items-center justify-center px-6 py-16">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Master the Quiz Game.
              <br />
              <span className="text-indigo-600 dark:text-indigo-400">
                Learn. Compete. Win.
              </span>
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Dive into fun quizzes, challenge your friends, and track your
              score on the leaderboard. It’s fast, it’s fun, it’s QuizMaster!
            </p>
            <div className="flex gap-4 flex-wrap">
              <button
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center"
                onClick={() => navigate("/home")}
              >
                <Play className="h-5 w-5 mr-2 group-hover:animate-pulse" />
                Start Your First Quiz
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate("/register")}
                className="border border-indigo-600 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-800 font-semibold"
              >
                Create Account
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={quizimg}
              alt="Quiz Illustration"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900" id="features">
        <div className="max-w-7xl w-full mx-auto px-4 md:px-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-12"
          >
            Why Choose QuizMaster?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <FaChalkboardTeacher className="text-indigo-600 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Create Engaging Quizzes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Build custom quizzes quickly and easily. Perfect for students,
                teachers, and teams.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <FaClock className="text-indigo-600 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Real-Time Play
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Instant feedback, live timers, and leaderboards for a
                competitive edge.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <FaChartBar className="text-indigo-600 text-5xl mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                Smart Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track quiz results, performance trends, and growth insights all
                in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-indigo-100 dark:bg-indigo-900 text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
        >
          Ready to challenge yourself?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-gray-700 dark:text-gray-200 text-lg mb-8"
        >
          Join thousands of users taking fun and competitive quizzes daily.
        </motion.p>
        <button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 font-semibold rounded-lg hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          onClick={() => navigate("/register")}
        >
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
