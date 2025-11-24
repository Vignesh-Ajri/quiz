const mongoose = require('mongoose');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Category = require('./models/Category');
require('dotenv').config();

const sampleQuizzes = [
  {
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics including variables, functions, and ES6 features.",
    category: "Technology",
    difficulty: "Medium",
    timeLimit: 30,
    tags: ["javascript", "programming", "web development"],
    questions: [
        {
          question: "Which keyword is used to declare a reassignable variable with block scope in JavaScript?",
          options: [
            { text: "var", isCorrect: false },
            { text: "let", isCorrect: true },
            { text: "const", isCorrect: false },
            { text: "scope", isCorrect: false }
          ],
          explanation: "The 'let' keyword declares a block-scoped variable that can be reassigned, introduced in ES6.",
          points: 1
        },
        {
            question: "Which method removes the last element from an array in JavaScript?",
            options: [
              { text: "shift()", isCorrect: false },
              { text: "pop()", isCorrect: true },
              { text: "remove()", isCorrect: false },
              { text: "delete()", isCorrect: false }
            ],
            explanation: "The pop() method removes the last element from an array and returns it.",
            points: 1
        },
        {
            question: "Which operator is used to check both value and type equality?",
            options: [
              { text: "==", isCorrect: false },
              { text: "===", isCorrect: true },
              { text: "=", isCorrect: false },
              { text: "!==", isCorrect: false }
            ],
            explanation: "The === operator checks both the value and the type of the operands.",
            points: 1
        },
        {
            question: "What does the typeof operator return for arrays?",
            options: [
              { text: "array", isCorrect: false },
              { text: "object", isCorrect: true },
              { text: "list", isCorrect: false },
              { text: "collection", isCorrect: false }
            ],
            explanation: "typeof [] returns 'object'. To check for arrays, use Array.isArray().",
            points: 1
        },
        {
            question: "Which method converts a JavaScript object to a JSON string?",
            options: [
              { text: "JSON.parse()", isCorrect: false },
              { text: "JSON.stringify()", isCorrect: true },
              { text: "toJSON()", isCorrect: false },
              { text: "object.toString()", isCorrect: false }
            ],
            explanation: "JSON.stringify() is used to convert a JavaScript object into a JSON string.",
            points: 1
        },
        {
            question: "How do you create an arrow function in JavaScript?",
            options: [
              { text: "function() => {}", isCorrect: false },
              { text: "() => {}", isCorrect: true },
              { text: "=> function() {}", isCorrect: false },
              { text: "arrow function() {}", isCorrect: false }
            ],
            explanation: "Arrow functions use the syntax () => {} for function expression.",
            points: 1
        },
        {
            question: "Which keyword is used to declare a constant in JavaScript?",
            options: [
              { text: "let", isCorrect: false },
              { text: "const", isCorrect: true },
              { text: "static", isCorrect: false },
              { text: "var", isCorrect: false }
            ],
            explanation: "The 'const' keyword declares constants whose values cannot be reassigned.",
            points: 1
        },
        {
            question: "Which function is used to print messages to the console?",
            options: [
              { text: "print()", isCorrect: false },
              { text: "console.log()", isCorrect: true },
              { text: "echo()", isCorrect: false },
              { text: "alert()", isCorrect: false }
            ],
            explanation: "console.log() is used to print messages to the developer console.",
            points: 1
        },
        {
            question: "What is a closure in JavaScript?",
            options: [
              { text: "A function with access to outer scope variables", isCorrect: true },
              { text: "A block of code that closes execution", isCorrect: false },
              { text: "A way to stop loops", isCorrect: false },
              { text: "A built-in object", isCorrect: false }
            ],
            explanation: "Closures are functions that retain access to variables from their outer scope.",
            points: 2
        },
        {
            question: "Which array method adds one or more elements to the beginning of an array?",
            options: [
              { text: "push()", isCorrect: false },
              { text: "unshift()", isCorrect: true },
              { text: "shift()", isCorrect: false },
              { text: "concat()", isCorrect: false }
            ],
            explanation: "The unshift() method adds elements to the beginning of an array.",
            points: 1
        },
        {
            question: "Which loop is guaranteed to run at least once?",
            options: [
              { text: "for loop", isCorrect: false },
              { text: "while loop", isCorrect: false },
              { text: "do...while loop", isCorrect: true },
              { text: "for...of loop", isCorrect: false }
            ],
            explanation: "The do...while loop executes the code block once before checking the condition.",
            points: 1
        },
        {
            question: "Which built-in method is used to combine two arrays?",
            options: [
              { text: "append()", isCorrect: false },
              { text: "concat()", isCorrect: true },
              { text: "combine()", isCorrect: false },
              { text: "merge()", isCorrect: false }
            ],
            explanation: "The concat() method is used to merge two or more arrays.",
            points: 1
        },
        {
            question: "What is the default value of uninitialized variables in JavaScript?",
            options: [
              { text: "null", isCorrect: false },
              { text: "undefined", isCorrect: true },
              { text: "0", isCorrect: false },
              { text: "false", isCorrect: false }
            ],
            explanation: "Uninitialized variables in JavaScript are undefined by default.",
            points: 1
        },
        {
            question: "Which operator is used for exponentiation in modern JavaScript?",
            options: [
              { text: "^", isCorrect: false },
              { text: "**", isCorrect: true },
              { text: "exp()", isCorrect: false },
              { text: "Math.pow", isCorrect: false }
            ],
            explanation: "The ** operator performs exponentiation (e.g., 2 ** 3 = 8).",
            points: 1
        },
        {
            question: "What will console.log([] == false) output?",
            options: [
              { text: "true", isCorrect: true },
              { text: "false", isCorrect: false },
              { text: "undefined", isCorrect: false },
              { text: "Throws error", isCorrect: false }
            ],
            explanation: "An empty array is coerced to an empty string, then to 0. 0 == false is true.",
            points: 2
        },
    ]
  },
  {
    title: "World Literature Classics",
    description: "Test your knowledge of famous authors, classic novels, poetry, and literary movements from around the world.",
    category: "Literature",
    difficulty: "Hard",
    timeLimit: 35,
    tags: ["literature", "classics", "authors", "novels", "poetry"],
    questions: [
      {
        question: "Who wrote the epic poem 'The Iliad'?",
        options: [
          { text: "Virgil", isCorrect: false },
          { text: "Homer", isCorrect: true },
          { text: "Sophocles", isCorrect: false },
          { text: "Euripides", isCorrect: false }
        ],
        explanation: "Homer is credited with writing 'The Iliad' and 'The Odyssey'.",
        points: 2
      },
      {
        question: "Which Shakespeare play features the characters Rosencrantz and Guildenstern?",
        options: [
          { text: "Othello", isCorrect: false },
          { text: "Hamlet", isCorrect: true },
          { text: "King Lear", isCorrect: false },
          { text: "Macbeth", isCorrect: false }
        ],
        explanation: "Rosencrantz and Guildenstern are friends of Hamlet in Shakespeare’s tragedy.",
        points: 1
      },
      {
        question: "Who is the author of 'One Hundred Years of Solitude'?",
        options: [
          { text: "Pablo Neruda", isCorrect: false },
          { text: "Gabriel García Márquez", isCorrect: true },
          { text: "Jorge Luis Borges", isCorrect: false },
          { text: "Mario Vargas Llosa", isCorrect: false }
        ],
        explanation: "Gabriel García Márquez wrote this famous work of magical realism.",
        points: 2
      },
      {
        question: "In Dante's 'Divine Comedy', who serves as Dante’s guide through Hell?",
        options: [
          { text: "Virgil", isCorrect: true },
          { text: "Beatrice", isCorrect: false },
          { text: "St. Peter", isCorrect: false },
          { text: "Aristotle", isCorrect: false }
        ],
        explanation: "The Roman poet Virgil guides Dante through Hell and Purgatory.",
        points: 1
      },
      {
        question: "Who wrote the novel 'Pride and Prejudice'?",
        options: [
          { text: "Emily Brontë", isCorrect: false },
          { text: "Jane Austen", isCorrect: true },
          { text: "Charlotte Brontë", isCorrect: false },
          { text: "Mary Shelley", isCorrect: false }
        ],
        explanation: "Jane Austen published 'Pride and Prejudice' in 1813.",
        points: 1
      },
      {
        question: "Which Russian author wrote 'War and Peace'?",
        options: [
          { text: "Fyodor Dostoevsky", isCorrect: false },
          { text: "Leo Tolstoy", isCorrect: true },
          { text: "Anton Chekhov", isCorrect: false },
          { text: "Ivan Turgenev", isCorrect: false }
        ],
        explanation: "Leo Tolstoy’s 'War and Peace' is a monumental work of Russian literature.",
        points: 2
      },
      {
        question: "Which Greek tragedy tells the story of a king who kills his father and marries his mother?",
        options: [
          { text: "Antigone", isCorrect: false },
          { text: "Oedipus Rex", isCorrect: true },
          { text: "Medea", isCorrect: false },
          { text: "Electra", isCorrect: false }
        ],
        explanation: "Sophocles' 'Oedipus Rex' tells the tragic story of Oedipus.",
        points: 2
      },
      {
        question: "Who wrote the novel 'Crime and Punishment'?",
        options: [
          { text: "Nikolai Gogol", isCorrect: false },
          { text: "Fyodor Dostoevsky", isCorrect: true },
          { text: "Leo Tolstoy", isCorrect: false },
          { text: "Maxim Gorky", isCorrect: false }
        ],
        explanation: "Dostoevsky’s 'Crime and Punishment' explores morality, guilt, and redemption.",
        points: 2
      },
      {
        question: "Which poet wrote 'The Raven'?",
        options: [
          { text: "Walt Whitman", isCorrect: false },
          { text: "Edgar Allan Poe", isCorrect: true },
          { text: "Robert Frost", isCorrect: false },
          { text: "William Blake", isCorrect: false }
        ],
        explanation: "Edgar Allan Poe’s 'The Raven' is one of the most famous poems in American literature.",
        points: 1
      },
      {
        question: "In which novel would you find the character Jay Gatsby?",
        options: [
          { text: "The Sun Also Rises", isCorrect: false },
          { text: "The Great Gatsby", isCorrect: true },
          { text: "Of Mice and Men", isCorrect: false },
          { text: "Catcher in the Rye", isCorrect: false }
        ],
        explanation: "Jay Gatsby is the central figure in F. Scott Fitzgerald’s 'The Great Gatsby'.",
        points: 1
      },
      {
        question: "Who is the author of 'The Odyssey'?",
        options: [
          { text: "Homer", isCorrect: true },
          { text: "Virgil", isCorrect: false },
          { text: "Plato", isCorrect: false },
          { text: "Sophocles", isCorrect: false }
        ],
        explanation: "'The Odyssey' is attributed to the ancient Greek poet Homer.",
        points: 1
      },
      {
        question: "Which novel begins with the line 'Call me Ishmael'?",
        options: [
          { text: "Moby-Dick", isCorrect: true },
          { text: "Treasure Island", isCorrect: false },
          { text: "Robinson Crusoe", isCorrect: false },
          { text: "Heart of Darkness", isCorrect: false }
        ],
        explanation: "Herman Melville’s 'Moby-Dick' opens with the famous line 'Call me Ishmael'.",
        points: 1
      },
      {
        question: "Who wrote 'Don Quixote'?",
        options: [
          { text: "Miguel de Cervantes", isCorrect: true },
          { text: "Federico García Lorca", isCorrect: false },
          { text: "Gabriel García Márquez", isCorrect: false },
          { text: "Lope de Vega", isCorrect: false }
        ],
        explanation: "'Don Quixote' was written by Spanish author Miguel de Cervantes.",
        points: 2
      },
      {
        question: "Which poet wrote the collection 'Leaves of Grass'?",
        options: [
          { text: "Robert Frost", isCorrect: false },
          { text: "Walt Whitman", isCorrect: true },
          { text: "T. S. Eliot", isCorrect: false },
          { text: "Emily Dickinson", isCorrect: false }
        ],
        explanation: "Walt Whitman’s 'Leaves of Grass' celebrates democracy and the human spirit.",
        points: 1
      },
      {
        question: "Who is the author of 'Frankenstein'?",
        options: [
          { text: "Mary Shelley", isCorrect: true },
          { text: "Percy Bysshe Shelley", isCorrect: false },
          { text: "Lord Byron", isCorrect: false },
          { text: "Bram Stoker", isCorrect: false }
        ],
        explanation: "'Frankenstein; or, The Modern Prometheus' was written by Mary Shelley in 1818.",
        points: 1
      },

    ]
  },
  {
    title: "Sports Trivia Championship",
    description: "Test your knowledge of sports history, famous athletes, Olympic games, and sporting achievements across various disciplines.",
    category: "Sports",
    difficulty: "Medium",
    timeLimit: 25,
    tags: ["sports", "olympics", "athletes", "history", "records"],
    questions: [
      {
        question: "Which country has won the most FIFA World Cup titles?",
        options: [
          { text: "Germany", isCorrect: false },
          { text: "Brazil", isCorrect: true },
          { text: "Italy", isCorrect: false },
          { text: "Argentina", isCorrect: false }
        ],
        explanation: "Brazil has won the FIFA World Cup 5 times, the most in history.",
        points: 2
      },
      {
        question: "Who holds the record for the most Olympic gold medals?",
        options: [
          { text: "Usain Bolt", isCorrect: false },
          { text: "Michael Phelps", isCorrect: true },
          { text: "Carl Lewis", isCorrect: false },
          { text: "Mark Spitz", isCorrect: false }
        ],
        explanation: "Swimmer Michael Phelps won 23 Olympic gold medals, the most by any athlete.",
        points: 2
      },
      {
        question: "In which sport would you perform a slam dunk?",
        options: [
          { text: "Volleyball", isCorrect: false },
          { text: "Basketball", isCorrect: true },
          { text: "Tennis", isCorrect: false },
          { text: "Rugby", isCorrect: false }
        ],
        explanation: "A slam dunk is a powerful scoring move in basketball.",
        points: 1
      },
      {
        question: "Which country hosted the 2016 Summer Olympics?",
        options: [
          { text: "China", isCorrect: false },
          { text: "Brazil", isCorrect: true },
          { text: "United Kingdom", isCorrect: false },
          { text: "Japan", isCorrect: false }
        ],
        explanation: "The 2016 Summer Olympics were hosted in Rio de Janeiro, Brazil.",
        points: 1
      },
      {
        question: "Which tennis player is known as the 'King of Clay'?",
        options: [
          { text: "Roger Federer", isCorrect: false },
          { text: "Novak Djokovic", isCorrect: false },
          { text: "Rafael Nadal", isCorrect: true },
          { text: "Andy Murray", isCorrect: false }
        ],
        explanation: "Rafael Nadal has dominated the French Open, earning the title 'King of Clay'.",
        points: 2
      },
      {
        question: "How many players are on a standard soccer team on the field?",
        options: [
          { text: "9", isCorrect: false },
          { text: "10", isCorrect: false },
          { text: "11", isCorrect: true },
          { text: "12", isCorrect: false }
        ],
        explanation: "Each soccer team has 11 players on the field, including the goalkeeper.",
        points: 1
      },
      {
        question: "Which boxer was nicknamed 'The Greatest'?",
        options: [
          { text: "Mike Tyson", isCorrect: false },
          { text: "Muhammad Ali", isCorrect: true },
          { text: "Joe Frazier", isCorrect: false },
          { text: "George Foreman", isCorrect: false }
        ],
        explanation: "Muhammad Ali was nicknamed 'The Greatest' for his boxing and charisma.",
        points: 2
      },
      {
        question: "Which country won the first ever FIFA World Cup in 1930?",
        options: [
          { text: "Argentina", isCorrect: false },
          { text: "Uruguay", isCorrect: true },
          { text: "Brazil", isCorrect: false },
          { text: "Italy", isCorrect: false }
        ],
        explanation: "Uruguay hosted and won the inaugural FIFA World Cup in 1930.",
        points: 2
      },
      {
        question: "In cricket, how many runs is a 'six' worth?",
        options: [
          { text: "4", isCorrect: false },
          { text: "5", isCorrect: false },
          { text: "6", isCorrect: true },
          { text: "7", isCorrect: false }
        ],
        explanation: "A six is scored when the batsman hits the ball over the boundary without bouncing.",
        points: 1
      },
      {
        question: "Who was the first gymnast to score a perfect 10 in the Olympics?",
        options: [
          { text: "Nadia Comăneci", isCorrect: true },
          { text: "Olga Korbut", isCorrect: false },
          { text: "Simone Biles", isCorrect: false },
          { text: "Larisa Latynina", isCorrect: false }
        ],
        explanation: "Nadia Comăneci scored the first perfect 10 at the 1976 Montreal Olympics.",
        points: 2
      },
      {
        question: "Which sport uses terms like 'love', 'deuce', and 'advantage'?",
        options: [
          { text: "Badminton", isCorrect: false },
          { text: "Tennis", isCorrect: true },
          { text: "Squash", isCorrect: false },
          { text: "Table Tennis", isCorrect: false }
        ],
        explanation: "These unique scoring terms are part of the game of tennis.",
        points: 1
      },
      {
        question: "Who is known as the fastest man in the world?",
        options: [
          { text: "Michael Johnson", isCorrect: false },
          { text: "Usain Bolt", isCorrect: true },
          { text: "Carl Lewis", isCorrect: false },
          { text: "Tyson Gay", isCorrect: false }
        ],
        explanation: "Usain Bolt holds world records in 100m and 200m sprinting events.",
        points: 2
      },
      {
        question: "Which country has won the most Olympic gold medals in ice hockey?",
        options: [
          { text: "Russia", isCorrect: false },
          { text: "Canada", isCorrect: true },
          { text: "Sweden", isCorrect: false },
          { text: "USA", isCorrect: false }
        ],
        explanation: "Canada has been the most successful nation in Olympic ice hockey.",
        points: 2
      },
      {
        question: "Which NFL teams are tied for the most Super Bowl titles?",
        options: [
          { text: "Dallas Cowboys and San Francisco 49ers", isCorrect: false },
          { text: "Pittsburgh Steelers and New England Patriots", isCorrect: true },
          { text: "Green Bay Packers and New York Giants", isCorrect: false },
          { text: "Denver Broncos and Indianapolis Colts", isCorrect: false }
        ],
        explanation: "The Pittsburgh Steelers and New England Patriots are tied with 6 Super Bowl wins each.",
        points: 2
      },
      {
        question: "Which female tennis player has won the most Grand Slam singles titles?",
        options: [
          { text: "Steffi Graf", isCorrect: false },
          { text: "Serena Williams", isCorrect: false },
          { text: "Margaret Court", isCorrect: true },
          { text: "Martina Navratilova", isCorrect: false }
        ],
        explanation: "Margaret Court holds the record with 24 Grand Slam singles titles.",
        points: 2
      },

    ]
  },
  {
    title: "Modern Technology & Innovation",
    description: "Explore cutting-edge technologies, artificial intelligence, smartphones, social media, and digital innovations shaping our world.",
    category: "Technology",
    difficulty: "Hard",
    timeLimit: 40,
    tags: ["technology", "AI", "smartphones", "internet", "innovation"],
    questions: [
      {
        question: "Who is known as the father of artificial intelligence?",
        options: [
          { text: "Alan Turing", isCorrect: false },
          { text: "John McCarthy", isCorrect: true },
          { text: "Marvin Minsky", isCorrect: false },
          { text: "Herbert Simon", isCorrect: false }
        ],
        explanation: "John McCarthy coined the term 'Artificial Intelligence' in 1956.",
        points: 2
      },
      {
        question: "What year was the first iPhone released?",
        options: [
          { text: "2005", isCorrect: false },
          { text: "2007", isCorrect: true },
          { text: "2009", isCorrect: false },
          { text: "2010", isCorrect: false }
        ],
        explanation: "Apple released the first iPhone in 2007, revolutionizing smartphones.",
        points: 1
      },
      {
        question: "Which company developed the voice assistant Alexa?",
        options: [
          { text: "Apple", isCorrect: false },
          { text: "Google", isCorrect: false },
          { text: "Amazon", isCorrect: true },
          { text: "Microsoft", isCorrect: false }
        ],
        explanation: "Amazon created Alexa, first launched with the Echo device in 2014.",
        points: 1
      },
      {
        question: "What does 5G technology primarily improve?",
        options: [
          { text: "Battery life", isCorrect: false },
          { text: "Network speed and latency", isCorrect: true },
          { text: "Camera quality", isCorrect: false },
          { text: "Storage capacity", isCorrect: false }
        ],
        explanation: "5G offers faster speeds, lower latency, and better connectivity.",
        points: 2
      },
      {
        question: "Which social media platform was originally limited to 140 characters per post?",
        options: [
          { text: "Instagram", isCorrect: false },
          { text: "Twitter (now X)", isCorrect: true },
          { text: "Facebook", isCorrect: false },
          { text: "Reddit", isCorrect: false }
        ],
        explanation: "Twitter launched in 2006 with a 140-character limit, later expanded.",
        points: 1
      },
      {
        question: "Who is the CEO of Tesla and SpaceX?",
        options: [
          { text: "Bill Gates", isCorrect: false },
          { text: "Elon Musk", isCorrect: true },
          { text: "Jeff Bezos", isCorrect: false },
          { text: "Sundar Pichai", isCorrect: false }
        ],
        explanation: "Elon Musk leads Tesla and SpaceX, driving innovation in cars and space exploration.",
        points: 1
      },
      {
        question: "Which programming language is most commonly used for machine learning?",
        options: [
          { text: "C++", isCorrect: false },
          { text: "Java", isCorrect: false },
          { text: "Python", isCorrect: true },
          { text: "PHP", isCorrect: false }
        ],
        explanation: "Python, with libraries like TensorFlow and PyTorch, dominates machine learning development.",
        points: 2
      },
      {
        question: "Which company created the Android operating system?",
        options: [
          { text: "Microsoft", isCorrect: false },
          { text: "Apple", isCorrect: false },
          { text: "Google", isCorrect: true },
          { text: "Nokia", isCorrect: false }
        ],
        explanation: "Google acquired Android Inc. in 2005 and developed it into the world’s most used mobile OS.",
        points: 1
      },
      {
        question: "What technology powers cryptocurrencies like Bitcoin?",
        options: [
          { text: "Virtual reality", isCorrect: false },
          { text: "Blockchain", isCorrect: true },
          { text: "Quantum computing", isCorrect: false },
          { text: "Cloud computing", isCorrect: false }
        ],
        explanation: "Blockchain technology ensures secure, decentralized transactions.",
        points: 2
      },
      {
        question: "Which company developed the first commercially successful graphical web browser?",
        options: [
          { text: "Netscape", isCorrect: true },
          { text: "Microsoft", isCorrect: false },
          { text: "Google", isCorrect: false },
          { text: "Apple", isCorrect: false }
        ],
        explanation: "Netscape Navigator, launched in 1994, was the first widely used web browser.",
        points: 2
      },
      {
        question: "What does 'IoT' stand for in modern technology?",
        options: [
          { text: "Internet of Tools", isCorrect: false },
          { text: "Internet of Things", isCorrect: true },
          { text: "Interface of Technology", isCorrect: false },
          { text: "Integration of Tech", isCorrect: false }
        ],
        explanation: "IoT refers to smart, interconnected devices communicating over the internet.",
        points: 1
      },
      {
        question: "Which company launched the first mass-market electric car, the Nissan Leaf?",
        options: [
          { text: "Toyota", isCorrect: false },
          { text: "Nissan", isCorrect: true },
          { text: "Tesla", isCorrect: false },
          { text: "Chevrolet", isCorrect: false }
        ],
        explanation: "The Nissan Leaf, launched in 2010, was the first widely available electric car.",
        points: 1
      },
      {
        question: "Which technology company owns YouTube?",
        options: [
          { text: "Amazon", isCorrect: false },
          { text: "Apple", isCorrect: false },
          { text: "Google", isCorrect: true },
          { text: "Meta", isCorrect: false }
        ],
        explanation: "Google acquired YouTube in 2006 for $1.65 billion.",
        points: 1
      },
      {
        question: "What is the name of Meta's virtual reality social platform?",
        options: [
          { text: "HoloLens", isCorrect: false },
          { text: "Horizon Worlds", isCorrect: true },
          { text: "SteamVR", isCorrect: false },
          { text: "PlayStation VR", isCorrect: false }
        ],
        explanation: "Horizon Worlds is Meta's virtual reality social platform where users interact in virtual spaces.",
        points: 2
      },
      {
        question: "Which innovation is expected to revolutionize computing by using qubits?",
        options: [
          { text: "Artificial Intelligence", isCorrect: false },
          { text: "Quantum Computing", isCorrect: true },
          { text: "Augmented Reality", isCorrect: false },
          { text: "3D Printing", isCorrect: false }
        ],
        explanation: "Quantum computing uses qubits to perform calculations far beyond classical computers.",
        points: 2
      }
    ]
  },
  {
    title: "General Knowledge Trivia",
    description: "A comprehensive quiz covering geography, current events, culture, food, entertainment, and miscellaneous interesting facts.",
    category: "General Knowledge",
    difficulty: "Medium",
    timeLimit: 30,
    tags: ["general knowledge", "geography", "culture", "entertainment", "facts"],
    questions: [
      {
        question: "What is the capital city of Australia?",
        options: [
          { text: "Sydney", isCorrect: false },
          { text: "Melbourne", isCorrect: false },
          { text: "Canberra", isCorrect: true },
          { text: "Perth", isCorrect: false }
        ],
        explanation: "Although Sydney and Melbourne are larger, Canberra is the capital of Australia.",
        points: 1
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: [
          { text: "Venus", isCorrect: false },
          { text: "Mars", isCorrect: true },
          { text: "Jupiter", isCorrect: false },
          { text: "Mercury", isCorrect: false }
        ],
        explanation: "Mars appears red due to iron oxide on its surface.",
        points: 1
      },
      {
        question: "Who painted the Mona Lisa?",
        options: [
          { text: "Leonardo da Vinci", isCorrect: true },
          { text: "Michelangelo", isCorrect: false },
          { text: "Pablo Picasso", isCorrect: false },
          { text: "Vincent van Gogh", isCorrect: false }
        ],
        explanation: "The Mona Lisa is one of Leonardo da Vinci's most famous works.",
        points: 1
      },
      {
        question: "What is the largest mammal in the world?",
        options: [
          { text: "African Elephant", isCorrect: false },
          { text: "Blue Whale", isCorrect: true },
          { text: "Giraffe", isCorrect: false },
          { text: "Sperm Whale", isCorrect: false }
        ],
        explanation: "The blue whale is the largest animal ever known to have lived on Earth.",
        points: 1
      },
      {
        question: "Which country is known as the Land of the Rising Sun?",
        options: [
          { text: "China", isCorrect: false },
          { text: "Japan", isCorrect: true },
          { text: "Thailand", isCorrect: false },
          { text: "South Korea", isCorrect: false }
        ],
        explanation: "Japan is called the Land of the Rising Sun because it lies to the east of Asia.",
        points: 1
      },
      {
        question: "Which element has the chemical symbol 'O'?",
        options: [
          { text: "Gold", isCorrect: false },
          { text: "Oxygen", isCorrect: true },
          { text: "Osmium", isCorrect: false },
          { text: "Oxide", isCorrect: false }
        ],
        explanation: "The chemical symbol 'O' stands for Oxygen.",
        points: 1
      },
      {
        question: "What is the national currency of Japan?",
        options: [
          { text: "Won", isCorrect: false },
          { text: "Yen", isCorrect: true },
          { text: "Peso", isCorrect: false },
          { text: "Ringgit", isCorrect: false }
        ],
        explanation: "Japan’s official currency is the Yen (¥).",
        points: 1
      },
      {
        question: "Which famous scientist developed the theory of relativity?",
        options: [
          { text: "Isaac Newton", isCorrect: false },
          { text: "Albert Einstein", isCorrect: true },
          { text: "Galileo Galilei", isCorrect: false },
          { text: "Niels Bohr", isCorrect: false }
        ],
        explanation: "Albert Einstein developed the theory of relativity in the early 20th century.",
        points: 2
      },
      {
        question: "Which continent is the Sahara Desert located on?",
        options: [
          { text: "Asia", isCorrect: false },
          { text: "Africa", isCorrect: true },
          { text: "Australia", isCorrect: false },
          { text: "South America", isCorrect: false }
        ],
        explanation: "The Sahara Desert is in North Africa and is the largest hot desert in the world.",
        points: 1
      },
      {
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: [
          { text: "William Shakespeare", isCorrect: true },
          { text: "Charles Dickens", isCorrect: false },
          { text: "Jane Austen", isCorrect: false },
          { text: "Mark Twain", isCorrect: false }
        ],
        explanation: "Shakespeare’s 'Romeo and Juliet' is one of the most famous plays in world literature.",
        points: 1
      },
      {
        question: "What is the smallest prime number?",
        options: [
          { text: "0", isCorrect: false },
          { text: "1", isCorrect: false },
          { text: "2", isCorrect: true },
          { text: "3", isCorrect: false }
        ],
        explanation: "2 is the smallest prime number and the only even prime.",
        points: 1
      },
      {
        question: "Which ocean is the largest on Earth?",
        options: [
          { text: "Atlantic Ocean", isCorrect: false },
          { text: "Pacific Ocean", isCorrect: true },
          { text: "Indian Ocean", isCorrect: false },
          { text: "Arctic Ocean", isCorrect: false }
        ],
        explanation: "The Pacific Ocean is the largest and deepest ocean on Earth.",
        points: 1
      },
      {
        question: "Which organ in the human body is primarily responsible for pumping blood?",
        options: [
          { text: "Lungs", isCorrect: false },
          { text: "Brain", isCorrect: false },
          { text: "Heart", isCorrect: true },
          { text: "Liver", isCorrect: false }
        ],
        explanation: "The heart pumps blood throughout the body, supplying oxygen and nutrients.",
        points: 1
      },
      {
        question: "Which country invented pizza?",
        options: [
          { text: "France", isCorrect: false },
          { text: "Italy", isCorrect: true },
          { text: "USA", isCorrect: false },
          { text: "Greece", isCorrect: false }
        ],
        explanation: "Pizza originated in Italy, particularly Naples.",
        points: 1
      },
      {
        question: "What is the hardest natural substance on Earth?",
        options: [
          { text: "Iron", isCorrect: false },
          { text: "Diamond", isCorrect: true },
          { text: "Steel", isCorrect: false },
          { text: "Granite", isCorrect: false }
        ],
        explanation: "Diamond is the hardest naturally occurring material known.",
        points: 2
      },

    ]
  },
  {
    title: "React Fundamentals",
    description: "Test your knowledge of React concepts including components, hooks, state management, and lifecycle methods.",
    category: "Technology",
    difficulty: "Medium",
    timeLimit: 30,
    tags: ["react", "javascript", "frontend", "web development"],
    questions: [
      {
        question: "What is React primarily used for?",
        options: [
          { text: "Database management", isCorrect: false },
          { text: "Building user interfaces", isCorrect: true },
          { text: "Server-side scripting", isCorrect: false },
          { text: "Mobile OS development", isCorrect: false }
        ],
        explanation: "React is a JavaScript library for building user interfaces, especially for single-page applications.",
        points: 1
      },
      {
        question: "Who developed React?",
        options: [
          { text: "Google", isCorrect: false },
          { text: "Facebook (Meta)", isCorrect: true },
          { text: "Microsoft", isCorrect: false },
          { text: "Twitter", isCorrect: false }
        ],
        explanation: "React was developed by Facebook in 2013.",
        points: 1
      },
      {
        question: "What is a React component?",
        options: [
          { text: "A function or class that returns JSX", isCorrect: true },
          { text: "A database entry", isCorrect: false },
          { text: "A CSS rule", isCorrect: false },
          { text: "A JavaScript variable", isCorrect: false }
        ],
        explanation: "Components are the building blocks of React apps and return UI elements in JSX.",
        points: 2
      },
      {
        question: "What does JSX stand for?",
        options: [
          { text: "JavaScript Extension", isCorrect: false },
          { text: "Java Syntax Extension", isCorrect: false },
          { text: "JavaScript XML", isCorrect: true },
          { text: "JSON XML", isCorrect: false }
        ],
        explanation: "JSX stands for JavaScript XML and allows writing HTML-like code inside JavaScript.",
        points: 1
      },
      {
        question: "Which hook is used to manage state in a functional component?",
        options: [
          { text: "useEffect", isCorrect: false },
          { text: "useContext", isCorrect: false },
          { text: "useState", isCorrect: true },
          { text: "useReducer", isCorrect: false }
        ],
        explanation: "useState allows adding state to functional components.",
        points: 2
      },
      {
        question: "Which hook is used for performing side effects in React?",
        options: [
          { text: "useEffect", isCorrect: true },
          { text: "useState", isCorrect: false },
          { text: "useMemo", isCorrect: false },
          { text: "useRef", isCorrect: false }
        ],
        explanation: "useEffect is used for side effects like data fetching, DOM manipulation, or subscriptions.",
        points: 2
      },
      {
        question: "What is the virtual DOM?",
        options: [
          { text: "A lightweight copy of the real DOM", isCorrect: true },
          { text: "A browser storage system", isCorrect: false },
          { text: "A React database", isCorrect: false },
          { text: "A CSS styling method", isCorrect: false }
        ],
        explanation: "The virtual DOM is a lightweight JavaScript object that React uses to optimize UI rendering.",
        points: 2
      },
      {
        question: "Which method is used to pass data from parent to child component?",
        options: [
          { text: "Props", isCorrect: true },
          { text: "State", isCorrect: false },
          { text: "Context", isCorrect: false },
          { text: "Redux", isCorrect: false }
        ],
        explanation: "Props (short for properties) allow data flow from parent to child components.",
        points: 1
      },
      {
        question: "What is the default method of data flow in React?",
        options: [
          { text: "Two-way binding", isCorrect: false },
          { text: "One-way binding", isCorrect: true },
          { text: "Circular binding", isCorrect: false },
          { text: "Bi-directional binding", isCorrect: false }
        ],
        explanation: "React uses one-way data binding from parent to child via props.",
        points: 1
      },
      {
        question: "Which hook is used to access context in React?",
        options: [
          { text: "useEffect", isCorrect: false },
          { text: "useContext", isCorrect: true },
          { text: "useReducer", isCorrect: false },
          { text: "useRef", isCorrect: false }
        ],
        explanation: "useContext allows components to consume context values without prop drilling.",
        points: 2
      },
      {
        question: "Which command is used to create a new React app?",
        options: [
          { text: "npx create-react-app myApp", isCorrect: true },
          { text: "npm new react-app myApp", isCorrect: false },
          { text: "react create myApp", isCorrect: false },
          { text: "npm start react-app myApp", isCorrect: false }
        ],
        explanation: "The command `npx create-react-app myApp` sets up a new React application.",
        points: 1
      },
      {
        question: "Which hook can be used for performance optimization in React?",
        options: [
          { text: "useMemo", isCorrect: true },
          { text: "useEffect", isCorrect: false },
          { text: "useState", isCorrect: false },
          { text: "useRef", isCorrect: false }
        ],
        explanation: "useMemo helps memoize expensive calculations to avoid unnecessary re-renders.",
        points: 2
      },
      {
        question: "What is the purpose of React Router?",
        options: [
          { text: "Manage database queries", isCorrect: false },
          { text: "Handle navigation and routing", isCorrect: true },
          { text: "Optimize rendering", isCorrect: false },
          { text: "Create animations", isCorrect: false }
        ],
        explanation: "React Router is used to implement client-side routing and navigation.",
        points: 1
      },
      {
        question: "What is a controlled component in React?",
        options: [
          { text: "A component managed by the DOM", isCorrect: false },
          { text: "A component that takes input value from state", isCorrect: true },
          { text: "A component with no state", isCorrect: false },
          { text: "A component that controls another component", isCorrect: false }
        ],
        explanation: "In controlled components, form inputs are controlled by React state.",
        points: 2
      },
      {
        question: "What does React StrictMode do?",
        options: [
          { text: "Checks for potential problems in an application", isCorrect: true },
          { text: "Makes React faster", isCorrect: false },
          { text: "Enables TypeScript by default", isCorrect: false },
          { text: "Prevents errors", isCorrect: false }
        ],
        explanation: "StrictMode helps highlight potential issues in an application during development.",
        points: 1
      },

    ]
  },
  {
    title: "React Advanced",
    description: "Test your knowledge of React concepts including Redux, Context API, Suspense, Concurrent Mode, Testing, Fiber, Hydration, Profiler, etc.",
    category: "Technology",
    difficulty: "Hard",
    timeLimit: 35,
    tags: ["react", "javascript", "frontend", "web development"],
    questions: [
      {
        question: "What is Redux primarily used for in React applications?",
        options: [
          { text: "Managing global state", isCorrect: true },
          { text: "Handling side effects", isCorrect: false },
          { text: "Styling components", isCorrect: false },
          { text: "Routing between pages", isCorrect: false }
        ],
        explanation: "Redux is a predictable state container for managing global state in large applications.",
        points: 2
      },
      {
        question: "What are the three core principles of Redux?",
        options: [
          { text: "Single source of truth, State is read-only, Changes by pure functions", isCorrect: true },
          { text: "Multiple sources, Mutable state, Direct DOM updates", isCorrect: false },
          { text: "Asynchronous actions only, Local state only, Middleware free", isCorrect: false },
          { text: "Context-only, No reducers, No immutability", isCorrect: false }
        ],
        explanation: "Redux principles: a single source of truth, state is immutable, and changes are made using pure functions (reducers).",
        points: 3
      },
      {
        question: "Which React feature allows avoiding prop drilling?",
        options: [
          { text: "Context API", isCorrect: true },
          { text: "Refs", isCorrect: false },
          { text: "Fragments", isCorrect: false },
          { text: "Keys", isCorrect: false }
        ],
        explanation: "The Context API provides a way to share values without passing props manually through each level.",
        points: 2
      },
      {
        question: "What is React Suspense used for?",
        options: [
          { text: "Error handling", isCorrect: false },
          { text: "Data fetching and lazy loading", isCorrect: true },
          { text: "Managing Redux state", isCorrect: false },
          { text: "Optimizing CSS rendering", isCorrect: false }
        ],
        explanation: "Suspense allows React to wait for some operation (like data fetching) before rendering.",
        points: 2
      },
      {
        question: "What is Concurrent Mode in React?",
        options: [
          { text: "A way to write multi-threaded React code", isCorrect: false },
          { text: "An experimental feature for rendering UI without blocking user interactions", isCorrect: true },
          { text: "A way to run multiple apps at the same time", isCorrect: false },
          { text: "An approach for managing server concurrency", isCorrect: false }
        ],
        explanation: "Concurrent Mode allows React to interrupt rendering to keep the UI responsive.",
        points: 3
      },
      {
        question: "What is the purpose of React’s Error Boundaries?",
        options: [
          { text: "To catch runtime errors in rendering lifecycle", isCorrect: true },
          { text: "To prevent syntax errors", isCorrect: false },
          { text: "To replace try/catch blocks in JS", isCorrect: false },
          { text: "To debug Redux state", isCorrect: false }
        ],
        explanation: "Error Boundaries are special components that catch errors during rendering, lifecycle methods, and constructors.",
        points: 2
      },
      {
        question: "Which hook is most similar to componentDidMount, componentDidUpdate, and componentWillUnmount combined?",
        options: [
          { text: "useEffect", isCorrect: true },
          { text: "useRef", isCorrect: false },
          { text: "useMemo", isCorrect: false },
          { text: "useReducer", isCorrect: false }
        ],
        explanation: "useEffect can mimic lifecycle methods depending on the dependency array.",
        points: 2
      },
      {
        question: "What is the difference between useMemo and useCallback?",
        options: [
          { text: "useMemo memoizes values, useCallback memoizes functions", isCorrect: true },
          { text: "useMemo works with async code, useCallback doesn’t", isCorrect: false },
          { text: "useCallback is faster than useMemo", isCorrect: false },
          { text: "Both are identical", isCorrect: false }
        ],
        explanation: "useMemo memoizes a computed value, while useCallback memoizes a function reference.",
        points: 2
      },
      {
        question: "What is React.lazy used for?",
        options: [
          { text: "Optimizing hooks", isCorrect: false },
          { text: "Lazy loading components", isCorrect: true },
          { text: "Creating async reducers", isCorrect: false },
          { text: "Delaying state updates", isCorrect: false }
        ],
        explanation: "React.lazy lets you dynamically import components for code-splitting.",
        points: 1
      },
      {
        question: "What is the main advantage of Redux Toolkit?",
        options: [
          { text: "Eliminates boilerplate and simplifies Redux setup", isCorrect: true },
          { text: "Replaces React Router", isCorrect: false },
          { text: "Provides custom hooks only", isCorrect: false },
          { text: "Removes reducers entirely", isCorrect: false }
        ],
        explanation: "Redux Toolkit simplifies Redux setup, reduces boilerplate, and provides powerful utilities.",
        points: 2
      },
      {
        question: "Which testing library is most commonly used with React?",
        options: [
          { text: "Mocha", isCorrect: false },
          { text: "React Testing Library", isCorrect: true },
          { text: "Cypress", isCorrect: false },
          { text: "Jasmine", isCorrect: false }
        ],
        explanation: "React Testing Library is widely used for unit and integration testing in React.",
        points: 1
      },
      {
        question: "What does the useReducer hook do?",
        options: [
          { text: "Handles async requests", isCorrect: false },
          { text: "Manages complex state logic", isCorrect: true },
          { text: "Optimizes component rendering", isCorrect: false },
          { text: "Provides routing", isCorrect: false }
        ],
        explanation: "useReducer is useful for managing more complex state logic compared to useState.",
        points: 2
      },
      {
        question: "What is hydration in React?",
        options: [
          { text: "Rendering React code inside Node.js", isCorrect: false },
          { text: "Attaching event listeners to pre-rendered HTML", isCorrect: true },
          { text: "Refreshing app state after reload", isCorrect: false },
          { text: "Clearing component cache", isCorrect: false }
        ],
        explanation: "Hydration is React’s process of attaching event handlers to server-rendered markup.",
        points: 3
      },
      {
        question: "What is React Fiber?",
        options: [
          { text: "A new threading model", isCorrect: false },
          { text: "The React reconciliation engine", isCorrect: true },
          { text: "A CSS framework", isCorrect: false },
          { text: "A Redux middleware", isCorrect: false }
        ],
        explanation: "React Fiber is the reconciliation algorithm introduced in React 16 for better rendering.",
        points: 3
      },
      {
        question: "Which hook would you use to store a mutable value that persists across renders without re-rendering?",
        options: [
          { text: "useState", isCorrect: false },
          { text: "useRef", isCorrect: true },
          { text: "useMemo", isCorrect: false },
          { text: "useEffect", isCorrect: false }
        ],
        explanation: "useRef holds mutable values without causing re-renders.",
        points: 2
      },
      {
        question: "What is the purpose of React Profiler?",
        options: [
          { text: "To analyze performance bottlenecks in components", isCorrect: true },
          { text: "To debug Redux reducers", isCorrect: false },
          { text: "To test hooks", isCorrect: false },
          { text: "To validate prop types", isCorrect: false }
        ],
        explanation: "React Profiler measures component rendering performance.",
        points: 2
      },
      {
        question: "How does React handle key props in lists?",
        options: [
          { text: "They help React identify which items have changed", isCorrect: true },
          { text: "They are used only for styling", isCorrect: false },
          { text: "They improve virtual DOM speed by default", isCorrect: false },
          { text: "They are optional and unused", isCorrect: false }
        ],
        explanation: "Keys help React identify which list items have changed, added, or removed.",
        points: 2
      },
      {
        question: "What is the main purpose of useImperativeHandle hook?",
        options: [
          { text: "To expose imperative methods from child to parent components", isCorrect: true },
          { text: "To optimize performance", isCorrect: false },
          { text: "To fetch data from APIs", isCorrect: false },
          { text: "To manage context values", isCorrect: false }
        ],
        explanation: "useImperativeHandle customizes the instance value exposed by ref.",
        points: 3
      },
      {
        question: "What is the difference between shallow rendering and full rendering in testing?",
        options: [
          { text: "Shallow rendering tests only one component, full rendering tests children too", isCorrect: true },
          { text: "Shallow rendering is faster but less reliable", isCorrect: false },
          { text: "Full rendering ignores props", isCorrect: false },
          { text: "They are identical approaches", isCorrect: false }
        ],
        explanation: "Shallow rendering tests a single component in isolation, while full rendering renders child components as well.",
        points: 2
      },
      {
        question: "Which hook is useful for memoizing callback functions to prevent unnecessary re-renders?",
        options: [
          { text: "useCallback", isCorrect: true },
          { text: "useMemo", isCorrect: false },
          { text: "useState", isCorrect: false },
          { text: "useEffect", isCorrect: false }
        ],
        explanation: "useCallback memoizes callback functions across renders.",
        points: 2
      }
    ]
  },
  {
    title: "CSS Mastery",
    description: "Explore questions on CSS selectors, layouts, flexbox, grid, animations, and responsive design techniques.",
    category: "Technology",
    difficulty: "Medium",
    timeLimit: 25,
    tags: ["css", "frontend", "design", "web development"],
    questions: [
      {
        question: "Which CSS property is used to change the text color of an element?",
        options: [
          { text: "background-color", isCorrect: false },
          { text: "color", isCorrect: true },
          { text: "text-style", isCorrect: false },
          { text: "font-color", isCorrect: false }
        ],
        explanation: "The 'color' property in CSS sets the color of the text.",
        points: 1
      },
      {
        question: "What does the CSS selector 'div > p' target?",
        options: [
          { text: "All <p> elements inside <div>", isCorrect: false },
          { text: "All direct child <p> elements of <div>", isCorrect: true },
          { text: "All <div> elements inside <p>", isCorrect: false },
          { text: "The first <p> inside <div>", isCorrect: false }
        ],
        explanation: "The '>' selector selects direct children only.",
        points: 2
      },
      {
        question: "Which CSS layout uses rows and columns to organize content?",
        options: [
          { text: "Flexbox", isCorrect: false },
          { text: "Grid", isCorrect: true },
          { text: "Float", isCorrect: false },
          { text: "Inline-block", isCorrect: false }
        ],
        explanation: "CSS Grid is designed for two-dimensional layouts with rows and columns.",
        points: 2
      },
      {
        question: "Which property is used to create space between the border and content?",
        options: [
          { text: "margin", isCorrect: false },
          { text: "padding", isCorrect: true },
          { text: "spacing", isCorrect: false },
          { text: "gap", isCorrect: false }
        ],
        explanation: "Padding creates space inside the element, between the content and border.",
        points: 1
      },
      {
        question: "Which value of position makes an element stay fixed relative to the viewport?",
        options: [
          { text: "relative", isCorrect: false },
          { text: "absolute", isCorrect: false },
          { text: "fixed", isCorrect: true },
          { text: "sticky", isCorrect: false }
        ],
        explanation: "Fixed elements stay in place even when the page is scrolled.",
        points: 1
      },
      {
        question: "Which CSS property controls the stacking order of elements?",
        options: [
          { text: "display", isCorrect: false },
          { text: "z-index", isCorrect: true },
          { text: "position", isCorrect: false },
          { text: "order", isCorrect: false }
        ],
        explanation: "z-index determines which elements appear above others.",
        points: 2
      },
      {
        question: "In flexbox, which property defines the direction of items?",
        options: [
          { text: "flex-direction", isCorrect: true },
          { text: "align-items", isCorrect: false },
          { text: "justify-content", isCorrect: false },
          { text: "flex-flow", isCorrect: false }
        ],
        explanation: "'flex-direction' sets the main axis direction: row, column, row-reverse, or column-reverse.",
        points: 1
      },
      {
        question: "Which CSS property makes text bold?",
        options: [
          { text: "font-style", isCorrect: false },
          { text: "font-weight", isCorrect: true },
          { text: "text-decoration", isCorrect: false },
          { text: "font-bold", isCorrect: false }
        ],
        explanation: "The 'font-weight' property controls the thickness of text.",
        points: 1
      },
      {
        question: "Which unit in CSS is relative to the root element's font size?",
        options: [
          { text: "em", isCorrect: false },
          { text: "rem", isCorrect: true },
          { text: "%", isCorrect: false },
          { text: "vh", isCorrect: false }
        ],
        explanation: "1rem equals the font size of the root element, usually <html>.",
        points: 2
      },
      {
        question: "Which CSS property is used to create transitions for hover effects?",
        options: [
          { text: "transition", isCorrect: true },
          { text: "animation", isCorrect: false },
          { text: "transform", isCorrect: false },
          { text: "effect", isCorrect: false }
        ],
        explanation: "The 'transition' property allows smooth changes between styles.",
        points: 2
      },
      {
        question: "Which pseudo-class selects the first child of an element?",
        options: [
          { text: ":hover", isCorrect: false },
          { text: ":first-child", isCorrect: true },
          { text: ":nth-child(2)", isCorrect: false },
          { text: ":first", isCorrect: false }
        ],
        explanation: "':first-child' matches the first child element of its parent.",
        points: 1
      },
      {
        question: "Which CSS function is used to apply transformations like rotate or scale?",
        options: [
          { text: "transition()", isCorrect: false },
          { text: "transform()", isCorrect: false },
          { text: "transform", isCorrect: true },
          { text: "translate()", isCorrect: false }
        ],
        explanation: "The 'transform' property applies transformations like rotate, scale, skew, and translate.",
        points: 2
      },
      {
        question: "Which CSS property makes a website responsive by adjusting to device width?",
        options: [
          { text: "media queries", isCorrect: true },
          { text: "grid-template", isCorrect: false },
          { text: "flex-wrap", isCorrect: false },
          { text: "viewport", isCorrect: false }
        ],
        explanation: "Media queries adjust styles based on device characteristics like width.",
        points: 2
      },
      {
        question: "Which property defines the gap between grid rows and columns?",
        options: [
          { text: "grid-gap", isCorrect: true },
          { text: "row-gap", isCorrect: false },
          { text: "column-gap", isCorrect: false },
          { text: "spacing", isCorrect: false }
        ],
        explanation: "'grid-gap' (now replaced by 'gap') sets spacing between rows and columns in grid layout.",
        points: 2
      },
      {
        question: "Which CSS property is used for creating animations?",
        options: [
          { text: "animation", isCorrect: true },
          { text: "transition", isCorrect: false },
          { text: "motion", isCorrect: false },
          { text: "keyframes", isCorrect: false }
        ],
        explanation: "'animation' works with '@keyframes' to create animations.",
        points: 3
      }
    ]
  },
  {
    title: "MongoDB Essentials",
    description: "Test your understanding of MongoDB basics including collections, queries, indexing, and aggregation framework.",
    category: "Databases",
    difficulty: "Hard",
    timeLimit: 35,
    tags: ["mongodb", "database", "nosql", "backend"],
    questions: [
            {
        question: "Which command is used to show all databases in MongoDB?",
        options: [
          { text: "show dbs", isCorrect: true },
          { text: "list databases", isCorrect: false },
          { text: "db.show()", isCorrect: false },
          { text: "show all", isCorrect: false }
        ],
        explanation: "In the MongoDB shell, 'show dbs' lists all databases.",
        points: 1
      },
      {
        question: "In MongoDB, data is stored in?",
        options: [
          { text: "Tables", isCorrect: false },
          { text: "Collections", isCorrect: true },
          { text: "Rows", isCorrect: false },
          { text: "Schemas", isCorrect: false }
        ],
        explanation: "MongoDB stores documents inside collections (equivalent to tables in RDBMS).",
        points: 1
      },
      {
        question: "Which of the following is NOT a valid BSON data type?",
        options: [
          { text: "String", isCorrect: false },
          { text: "Date", isCorrect: false },
          { text: "Array", isCorrect: false },
          { text: "Tuple", isCorrect: true }
        ],
        explanation: "BSON supports types like String, Date, Array, Object, but not Tuple.",
        points: 2
      },
      {
        question: "Which operator is used to match values greater than a specific number in MongoDB queries?",
        options: [
          { text: "$eq", isCorrect: false },
          { text: "$lt", isCorrect: false },
          { text: "$gt", isCorrect: true },
          { text: "$gte", isCorrect: false }
        ],
        explanation: "The $gt operator checks for values greater than a given number.",
        points: 1
      },
      {
        question: "What is the default primary key field in MongoDB documents?",
        options: [
          { text: "_id", isCorrect: true },
          { text: "id", isCorrect: false },
          { text: "primary", isCorrect: false },
          { text: "pk", isCorrect: false }
        ],
        explanation: "Every MongoDB document automatically has an '_id' field as its unique primary key.",
        points: 1
      },
      {
        question: "Which MongoDB method is used to update multiple documents?",
        options: [
          { text: "db.collection.update()", isCorrect: false },
          { text: "db.collection.updateMany()", isCorrect: true },
          { text: "db.collection.updateAll()", isCorrect: false },
          { text: "db.collection.modify()", isCorrect: false }
        ],
        explanation: "updateMany() updates all documents that match the query.",
        points: 2
      },
      {
        question: "Which index type supports geospatial queries in MongoDB?",
        options: [
          { text: "Single Field Index", isCorrect: false },
          { text: "Text Index", isCorrect: false },
          { text: "2dsphere Index", isCorrect: true },
          { text: "Compound Index", isCorrect: false }
        ],
        explanation: "2dsphere indexes support complex geospatial queries like location searches.",
        points: 3
      },
      {
        question: "What does the MongoDB aggregation stage '$match' do?",
        options: [
          { text: "Groups documents", isCorrect: false },
          { text: "Filters documents", isCorrect: true },
          { text: "Sorts documents", isCorrect: false },
          { text: "Projects specific fields", isCorrect: false }
        ],
        explanation: "$match is used to filter documents in an aggregation pipeline.",
        points: 1
      },
      {
        question: "Which MongoDB command is used to backup a database?",
        options: [
          { text: "mongodump", isCorrect: true },
          { text: "mongoexport", isCorrect: false },
          { text: "mongobackup", isCorrect: false },
          { text: "dumpdb", isCorrect: false }
        ],
        explanation: "mongodump creates a binary backup of a MongoDB database.",
        points: 2
      },
      {
        question: "Which command removes a collection from a database?",
        options: [
          { text: "db.drop()", isCorrect: false },
          { text: "db.collection.drop()", isCorrect: true },
          { text: "db.remove()", isCorrect: false },
          { text: "db.dropCollection()", isCorrect: false }
        ],
        explanation: "The method db.collection.drop() deletes a collection completely.",
        points: 1
      },
      {
        question: "Which of the following best describes MongoDB?",
        options: [
          { text: "Relational Database", isCorrect: false },
          { text: "NoSQL Document Database", isCorrect: true },
          { text: "Key-Value Store", isCorrect: false },
          { text: "Columnar Database", isCorrect: false }
        ],
        explanation: "MongoDB is a NoSQL database that stores data as documents in collections.",
        points: 1
      },
      {
        question: "Which stage in aggregation is used to group documents by a specific field?",
        options: [
          { text: "$match", isCorrect: false },
          { text: "$group", isCorrect: true },
          { text: "$sort", isCorrect: false },
          { text: "$project", isCorrect: false }
        ],
        explanation: "$group allows grouping of documents and performing operations like sum, avg, count.",
        points: 2
      },
      {
        question: "What is sharding in MongoDB?",
        options: [
          { text: "Replicating data to multiple servers", isCorrect: false },
          { text: "Splitting large datasets across multiple servers", isCorrect: true },
          { text: "Indexing data for faster queries", isCorrect: false },
          { text: "Encrypting data at rest", isCorrect: false }
        ],
        explanation: "Sharding distributes data across multiple servers for scalability.",
        points: 3
      },
      {
        question: "Which MongoDB function is used to insert multiple documents at once?",
        options: [
          { text: "insert()", isCorrect: false },
          { text: "insertMany()", isCorrect: true },
          { text: "insertAll()", isCorrect: false },
          { text: "bulkInsert()", isCorrect: false }
        ],
        explanation: "insertMany() allows adding multiple documents in one call.",
        points: 1
      },
      {
        question: "Which feature ensures high availability in MongoDB?",
        options: [
          { text: "Indexing", isCorrect: false },
          { text: "Replication", isCorrect: true },
          { text: "Sharding", isCorrect: false },
          { text: "Aggregation", isCorrect: false }
        ],
        explanation: "Replication maintains multiple copies of data across servers to ensure availability.",
        points: 2
      }

    ]
  },
  {
    title: "Express.js Basics",
    description: "Check your knowledge of Express.js, routing, middleware, REST API development, and server-side programming.",
    category: "Technology",
    difficulty: "Medium",
    timeLimit: 30,
    tags: ["express", "nodejs", "backend", "web development"],
    questions: [
      {
        question: "What is Express.js primarily used for?",
        options: [
          { text: "Frontend UI development", isCorrect: false },
          { text: "Database management", isCorrect: false },
          { text: "Web application and API development", isCorrect: true },
          { text: "Mobile app development", isCorrect: false }
        ],
        explanation: "Express.js is a Node.js framework for building web applications and APIs.",
        points: 1
      },
      {
        question: "Which command installs Express.js in a Node.js project?",
        options: [
          { text: "npm install express", isCorrect: true },
          { text: "npm add expressjs", isCorrect: false },
          { text: "node install express", isCorrect: false },
          { text: "express init", isCorrect: false }
        ],
        explanation: "The command 'npm install express' installs Express in your project.",
        points: 1
      },
      {
        question: "Which method is used to define a GET route in Express?",
        options: [
          { text: "app.get()", isCorrect: true },
          { text: "app.route()", isCorrect: false },
          { text: "app.fetch()", isCorrect: false },
          { text: "app.send()", isCorrect: false }
        ],
        explanation: "app.get(path, callback) defines a GET request route in Express.",
        points: 1
      },
      {
        question: "What does middleware in Express do?",
        options: [
          { text: "Handles requests and responses", isCorrect: true },
          { text: "Connects to the database", isCorrect: false },
          { text: "Renders HTML templates", isCorrect: false },
          { text: "Runs only once during server startup", isCorrect: false }
        ],
        explanation: "Middleware functions in Express process requests, responses, and can modify them.",
        points: 2
      },
      {
        question: "Which method is used to serve static files in Express?",
        options: [
          { text: "express.static()", isCorrect: true },
          { text: "app.static()", isCorrect: false },
          { text: "express.serve()", isCorrect: false },
          { text: "app.useStatic()", isCorrect: false }
        ],
        explanation: "express.static() middleware is used to serve static files like images, CSS, JS.",
        points: 1
      },
      {
        question: "Which object is used to access query parameters in Express?",
        options: [
          { text: "req.body", isCorrect: false },
          { text: "req.query", isCorrect: true },
          { text: "req.params", isCorrect: false },
          { text: "req.data", isCorrect: false }
        ],
        explanation: "req.query is used to access URL query parameters (e.g., ?id=10).",
        points: 2
      },
      {
        question: "How do you start an Express server on port 3000?",
        options: [
          { text: "app.run(3000)", isCorrect: false },
          { text: "app.listen(3000)", isCorrect: true },
          { text: "express.start(3000)", isCorrect: false },
          { text: "server.start(3000)", isCorrect: false }
        ],
        explanation: "app.listen(3000) starts the Express server on port 3000.",
        points: 1
      },
      {
        question: "Which Express method is used to define middleware?",
        options: [
          { text: "app.use()", isCorrect: true },
          { text: "app.set()", isCorrect: false },
          { text: "app.middleware()", isCorrect: false },
          { text: "app.handle()", isCorrect: false }
        ],
        explanation: "app.use() registers middleware in Express.",
        points: 1
      },
      {
        question: "What is the default export of the 'express' module?",
        options: [
          { text: "A function", isCorrect: true },
          { text: "A class", isCorrect: false },
          { text: "An object", isCorrect: false },
          { text: "A string", isCorrect: false }
        ],
        explanation: "The express module exports a function that returns an Express application.",
        points: 2
      },
      {
        question: "Which Express object is used to send responses to the client?",
        options: [
          { text: "req", isCorrect: false },
          { text: "res", isCorrect: true },
          { text: "next", isCorrect: false },
          { text: "app", isCorrect: false }
        ],
        explanation: "res is the response object used to send data back to the client.",
        points: 1
      },
      {
        question: "Which HTTP method is used for updating existing data in REST APIs?",
        options: [
          { text: "GET", isCorrect: false },
          { text: "POST", isCorrect: false },
          { text: "PUT", isCorrect: true },
          { text: "DELETE", isCorrect: false }
        ],
        explanation: "PUT requests are used to update existing resources in REST APIs.",
        points: 2
      },
      {
        question: "Which Express function is used to redirect users to another URL?",
        options: [
          { text: "res.redirect()", isCorrect: true },
          { text: "req.redirect()", isCorrect: false },
          { text: "app.redirect()", isCorrect: false },
          { text: "next.redirect()", isCorrect: false }
        ],
        explanation: "res.redirect() redirects the client to a different URL.",
        points: 1
      },
      {
        question: "How do you handle URL parameters in Express routes?",
        options: [
          { text: "Using req.params", isCorrect: true },
          { text: "Using req.body", isCorrect: false },
          { text: "Using req.query", isCorrect: false },
          { text: "Using req.url", isCorrect: false }
        ],
        explanation: "req.params stores route parameters like /user/:id.",
        points: 2
      },
      {
        question: "What is the role of 'next()' in middleware?",
        options: [
          { text: "It terminates the request", isCorrect: false },
          { text: "It passes control to the next middleware", isCorrect: true },
          { text: "It sends response to the client", isCorrect: false },
          { text: "It restarts the server", isCorrect: false }
        ],
        explanation: "next() passes control to the next middleware function in the stack.",
        points: 2
      },
      {
        question: "Which template engines are commonly used with Express?",
        options: [
          { text: "EJS, Pug, Handlebars", isCorrect: true },
          { text: "React, Vue, Angular", isCorrect: false },
          { text: "MySQL, PostgreSQL, MongoDB", isCorrect: false },
          { text: "HTML, CSS, JS", isCorrect: false }
        ],
        explanation: "EJS, Pug, and Handlebars are popular template engines for rendering HTML in Express.",
        points: 2
      }
    ]
  },
  {
    title: "Java Programming",
    description: "Evaluate your knowledge of Java including OOP concepts, exceptions, multithreading, and standard libraries.",
    category: "Programming",
    difficulty: "Medium",
    timeLimit: 40,
    tags: ["java", "programming", "oop", "backend"],
    questions: [
      {
        question: "Which keyword is used to inherit a class in Java?",
        options: [
          { text: "extends", isCorrect: true },
          { text: "implements", isCorrect: false },
          { text: "inherits", isCorrect: false },
          { text: "super", isCorrect: false }
        ],
        explanation: "The 'extends' keyword is used for class inheritance in Java.",
        points: 1
      },
      {
        question: "Which of the following is not a primitive data type in Java?",
        options: [
          { text: "int", isCorrect: false },
          { text: "float", isCorrect: false },
          { text: "String", isCorrect: true },
          { text: "boolean", isCorrect: false }
        ],
        explanation: "String is a class in Java, not a primitive data type.",
        points: 1
      },
      {
        question: "What is method overloading in Java?",
        options: [
          { text: "Defining multiple methods with the same name but different parameters", isCorrect: true },
          { text: "Defining multiple methods with the same name and same parameters", isCorrect: false },
          { text: "Redefining a method in a subclass", isCorrect: false },
          { text: "Using static methods in multiple classes", isCorrect: false }
        ],
        explanation: "Method overloading allows methods with the same name but different parameter lists.",
        points: 2
      },
      {
        question: "Which package contains the Scanner class?",
        options: [
          { text: "java.io", isCorrect: false },
          { text: "java.util", isCorrect: true },
          { text: "java.lang", isCorrect: false },
          { text: "java.text", isCorrect: false }
        ],
        explanation: "The Scanner class is part of the java.util package.",
        points: 1
      },
      {
        question: "Which keyword is used to prevent inheritance of a class?",
        options: [
          { text: "static", isCorrect: false },
          { text: "abstract", isCorrect: false },
          { text: "final", isCorrect: true },
          { text: "super", isCorrect: false }
        ],
        explanation: "A class declared as 'final' cannot be inherited.",
        points: 1
      },
      {
        question: "What is the parent class of all Java classes?",
        options: [
          { text: "System", isCorrect: false },
          { text: "Object", isCorrect: true },
          { text: "Class", isCorrect: false },
          { text: "Base", isCorrect: false }
        ],
        explanation: "The Object class is the root of the class hierarchy in Java.",
        points: 2
      },
      {
        question: "Which of the following is used to handle exceptions in Java?",
        options: [
          { text: "try-catch", isCorrect: true },
          { text: "if-else", isCorrect: false },
          { text: "switch-case", isCorrect: false },
          { text: "do-while", isCorrect: false }
        ],
        explanation: "try-catch blocks are used for exception handling in Java.",
        points: 1
      },
      {
        question: "Which interface is commonly implemented to create a thread in Java?",
        options: [
          { text: "Runnable", isCorrect: true },
          { text: "Threadable", isCorrect: false },
          { text: "Executor", isCorrect: false },
          { text: "Callable", isCorrect: false }
        ],
        explanation: "Threads are commonly created by implementing Runnable (or by extending Thread). Callable is used with ExecutorService for tasks that return results.",
        points: 2
      },
      {
        question: "What is the default value of a boolean variable in Java?",
        options: [
          { text: "true", isCorrect: false },
          { text: "false", isCorrect: true },
          { text: "0", isCorrect: false },
          { text: "null", isCorrect: false }
        ],
        explanation: "By default, boolean variables are initialized to false in Java.",
        points: 1
      },
      {
        question: "Which collection class allows duplicate elements in Java?",
        options: [
          { text: "Set", isCorrect: false },
          { text: "List", isCorrect: true },
          { text: "Map", isCorrect: false },
          { text: "Queue", isCorrect: false }
        ],
        explanation: "List allows duplicate elements, unlike Set.",
        points: 1
      },
      {
        question: "Which keyword is used to call the parent class constructor?",
        options: [
          { text: "this", isCorrect: false },
          { text: "super", isCorrect: true },
          { text: "base", isCorrect: false },
          { text: "extends", isCorrect: false }
        ],
        explanation: "The 'super' keyword is used to call the parent class constructor.",
        points: 2
      },
      {
        question: "Which method is called automatically when an object is created in Java?",
        options: [
          { text: "start()", isCorrect: false },
          { text: "main()", isCorrect: false },
          { text: "constructor", isCorrect: true },
          { text: "init()", isCorrect: false }
        ],
        explanation: "Constructors are special methods automatically invoked when an object is created.",
        points: 1
      },
      {
        question: "Which keyword is used to create an object in Java?",
        options: [
          { text: "new", isCorrect: true },
          { text: "create", isCorrect: false },
          { text: "object", isCorrect: false },
          { text: "instance", isCorrect: false }
        ],
        explanation: "The 'new' keyword creates new objects in Java.",
        points: 1
      },
      {
        question: "What is the default access modifier in Java?",
        options: [
          { text: "private", isCorrect: false },
          { text: "public", isCorrect: false },
          { text: "protected", isCorrect: false },
          { text: "package-private", isCorrect: true }
        ],
        explanation: "If no modifier is specified, the default is package-private (accessible only within the same package).",
        points: 2
      },
      {
        question: "Which of these is a marker interface in Java?",
        options: [
          { text: "Serializable", isCorrect: true },
          { text: "Runnable", isCorrect: false },
          { text: "Comparable", isCorrect: false },
          { text: "Iterable", isCorrect: false }
        ],
        explanation: "Serializable is a marker interface with no methods, used to mark classes for serialization.",
        points: 3
      }
    ]
  },
  {
    title: "Python Programming",
    description: "Answer questions on Python syntax, data types, functions, modules, OOP, and advanced topics like decorators.",
    category: "Programming",
    difficulty: "Easy",
    timeLimit: 30,
    tags: ["python", "programming", "backend", "scripting"],
    questions: [
      {
        question: "Which keyword is used to define a function in Python?",
        options: [
          { text: "func", isCorrect: false },
          { text: "function", isCorrect: false },
          { text: "def", isCorrect: true },
          { text: "define", isCorrect: false }
        ],
        explanation: "The def keyword is used to define functions in Python.",
        points: 1
      },
      {
        question: "What is the correct file extension for Python files?",
        options: [
          { text: ".pt", isCorrect: false },
          { text: ".pyt", isCorrect: false },
          { text: ".py", isCorrect: true },
          { text: ".python", isCorrect: false }
        ],
        explanation: "Python files always use the .py extension.",
        points: 1
      },
      {
        question: "Which data type is immutable in Python?",
        options: [
          { text: "List", isCorrect: false },
          { text: "Dictionary", isCorrect: false },
          { text: "Tuple", isCorrect: true },
          { text: "Set", isCorrect: false }
        ],
        explanation: "Tuples are immutable, meaning their elements cannot be changed.",
        points: 2
      },
      {
        question: "How do you start a comment in Python?",
        options: [
          { text: "//", isCorrect: false },
          { text: "/* */", isCorrect: false },
          { text: "#", isCorrect: true },
          { text: "<!-- -->", isCorrect: false }
        ],
        explanation: "Python comments begin with the # symbol.",
        points: 1
      },
      {
        question: "Which function is used to get input from the user?",
        options: [
          { text: "scanf()", isCorrect: false },
          { text: "cin", isCorrect: false },
          { text: "input()", isCorrect: true },
          { text: "read()", isCorrect: false }
        ],
        explanation: "The input() function reads input from the user as a string.",
        points: 1
      },
      {
        question: "What is the output of type(5)?",
        options: [
          { text: "<class 'float'>", isCorrect: false },
          { text: "<class 'int'>", isCorrect: true },
          { text: "<class 'number'>", isCorrect: false },
          { text: "<class 'double'>", isCorrect: false }
        ],
        explanation: "The number 5 is an integer in Python, so its type is int.",
        points: 1
      },
      {
        question: "Which keyword is used to define a class in Python?",
        options: [
          { text: "object", isCorrect: false },
          { text: "class", isCorrect: true },
          { text: "struct", isCorrect: false },
          { text: "type", isCorrect: false }
        ],
        explanation: "The class keyword is used to define classes in Python.",
        points: 1
      },
      {
        question: "Which of these is used to import a module in Python?",
        options: [
          { text: "include", isCorrect: false },
          { text: "import", isCorrect: true },
          { text: "require", isCorrect: false },
          { text: "using", isCorrect: false }
        ],
        explanation: "The import statement is used to load modules in Python.",
        points: 1
      },
      {
        question: "Which of the following is a valid variable name in Python?",
        options: [
          { text: "2value", isCorrect: false },
          { text: "value_2", isCorrect: true },
          { text: "value-2", isCorrect: false },
          { text: "value 2", isCorrect: false }
        ],
        explanation: "Python variables cannot start with a number or contain spaces or hyphens.",
        points: 2
      },
      {
        question: "What is the correct way to create a list in Python?",
        options: [
          { text: "my_list = {}", isCorrect: false },
          { text: "my_list = []", isCorrect: true },
          { text: "my_list = ()", isCorrect: false },
          { text: "my_list = <>", isCorrect: false }
        ],
        explanation: "Lists are created using square brackets []. Avoid naming variables 'list' to prevent shadowing the built-in type.",
        points: 1
      },
      {
        question: "Which operator is used for exponentiation in Python?",
        options: [
          { text: "^", isCorrect: false },
          { text: "**", isCorrect: true },
          { text: "//", isCorrect: false },
          { text: "exp()", isCorrect: false }
        ],
        explanation: "Python uses ** for exponentiation (e.g., 2**3 = 8).",
        points: 2
      },
      {
        question: "Which of these is a built-in Python data type?",
        options: [
          { text: "Array", isCorrect: false },
          { text: "dict (Dictionary)", isCorrect: true },
          { text: "Pointer", isCorrect: false },
          { text: "Structure", isCorrect: false }
        ],
        explanation: "dict (dictionary) is a built-in Python data type for key-value pairs.",
        points: 1
      },
      {
        question: "Which keywords are used to handle exceptions in Python?",
        options: [
          { text: "try / except", isCorrect: true },
          { text: "try-catch", isCorrect: false },
          { text: "if-error", isCorrect: false },
          { text: "error-handling", isCorrect: false }
        ],
        explanation: "Exceptions are handled using try and except blocks in Python (with optional else/finally).",
        points: 1
      },
      {
        question: "What does the len() function do?",
        options: [
          { text: "Returns the size of a variable", isCorrect: false },
          { text: "Returns the length of an object", isCorrect: true },
          { text: "Returns the type of an object", isCorrect: false },
          { text: "Returns the index of an element", isCorrect: false }
        ],
        explanation: "len() returns the number of items in an object such as a list, string, or tuple.",
        points: 1
      },
      {
        question: "What is used for indentation in Python?",
        options: [
          { text: "{}", isCorrect: false },
          { text: ";", isCorrect: false },
          { text: "tabs/spaces", isCorrect: true },
          { text: "()", isCorrect: false }
        ],
        explanation: "Python uses indentation (tabs or spaces) to define code blocks; mixing tabs and spaces can cause errors.",
        points: 2
      }
    ]
  },
  {
    title: "Aptitude Test",
    description: "Challenge yourself with aptitude questions including logical reasoning, quantitative aptitude, and problem-solving skills.",
    category: "General Knowledge",
    difficulty: "Medium",
    timeLimit: 20,
    tags: ["aptitude", "reasoning", "math", "logic"],
    questions: [
      {
        question: "What is the next number in the sequence: 2, 6, 12, 20, 30, ?",
        options: [
          { text: "36", isCorrect: false },
          { text: "40", isCorrect: false },
          { text: "42", isCorrect: true },
          { text: "44", isCorrect: false }
        ],
        explanation: "The sequence increases by consecutive even numbers: +4, +6, +8, +10... Next is +12 = 42.",
        points: 2
      },
      {
        question: "If A = 1, B = 2, ..., Z = 26, what is the value of 'CAT'?",
        options: [
          { text: "24", isCorrect: true },
          { text: "27", isCorrect: false },
          { text: "52", isCorrect: false },
          { text: "54", isCorrect: false }
        ],
        explanation: "C=3, A=1, T=20. Sum = 3 + 1 + 20 = 24.",
        points: 1
      },
      {
        question: "A train 150 m long is running at 60 km/h. How long will it take to cross a pole?",
        options: [
          { text: "6 sec", isCorrect: false },
          { text: "9 sec", isCorrect: true },
          { text: "12 sec", isCorrect: false },
          { text: "15 sec", isCorrect: false }
        ],
        explanation: "Speed = 60 km/h = 16.67 m/s. Time = Distance / Speed = 150 / 16.67 ≈ 9 sec.",
        points: 2
      },
      {
        question: "Find the odd one out: 2, 6, 12, 20, 32, 42",
        options: [
          { text: "32", isCorrect: true },
          { text: "20", isCorrect: false },
          { text: "12", isCorrect: false },
          { text: "42", isCorrect: false }
        ],
        explanation: "Except 32, all are products of two consecutive integers (1×2=2, 2×3=6, 3×4=12, 4×5=20, 6×7=42).",
        points: 2
      },
      {
        question: "If 3 pencils cost 15 rupees, how much will 7 pencils cost?",
        options: [
          { text: "30", isCorrect: false },
          { text: "35", isCorrect: true },
          { text: "40", isCorrect: false },
          { text: "45", isCorrect: false }
        ],
        explanation: "1 pencil = 15/3 = 5 rupees. 7 pencils = 7×5 = 35 rupees.",
        points: 1
      },
      {
        question: "What is the angle sum of a hexagon?",
        options: [
          { text: "540°", isCorrect: false },
          { text: "720°", isCorrect: true },
          { text: "900°", isCorrect: false },
          { text: "1080°", isCorrect: false }
        ],
        explanation: "Sum of interior angles = (n−2)×180 = (6−2)×180 = 720°.",
        points: 1
      },
      {
        question: "Ravi is 3 times as old as his son. In 15 years, he will be twice as old as his son. How old is Ravi?",
        options: [
          { text: "30", isCorrect: true },
          { text: "36", isCorrect: false },
          { text: "42", isCorrect: false },
          { text: "45", isCorrect: false }
        ],
        explanation: "Let son’s age = x. Ravi = 3x. After 15 yrs: 3x+15 = 2(x+15). Solving → x=10, Ravi=30.",
        points: 2
      },
      {
        question: "A clock shows 3:15. What is the angle between the hour and minute hands?",
        options: [
          { text: "7.5°", isCorrect: true },
          { text: "22.5°", isCorrect: false },
          { text: "30°", isCorrect: false },
          { text: "37.5°", isCorrect: false }
        ],
        explanation: "Hour hand at 3:15 = 97.5°. Minute hand at 90°. Difference = 7.5°.",
        points: 2
      },
      {
        question: "If 12 men can finish a work in 8 days, how many men are needed to finish it in 6 days?",
        options: [
          { text: "14", isCorrect: false },
          { text: "16", isCorrect: true },
          { text: "18", isCorrect: false },
          { text: "20", isCorrect: false }
        ],
        explanation: "Work = men × days. 12×8 = 96 man-days. For 6 days: 96/6 = 16 men.",
        points: 2
      },
      {
        question: "The average of 5 numbers is 20. If one number is 25, what is the average of the remaining 4?",
        options: [
          { text: "18.75", isCorrect: true },
          { text: "19", isCorrect: false },
          { text: "19.25", isCorrect: false },
          { text: "20", isCorrect: false }
        ],
        explanation: "Total = 5×20 = 100. Removing 25 leaves 75. Average = 75/4 = 18.75.",
        points: 1
      },
      {
        question: "If 'EARTH' is coded as 'FBSUI' (each letter shifted by +1), how is 'MOON' coded?",
        options: [
          { text: "NPPQ", "isCorrect": true },
          { text: "NNOP", "isCorrect": false },
          { text: "NOOP", "isCorrect": false },
          { text: "NQQP", "isCorrect": false }
        ],
        explanation: "Shift each letter by +1: M→N, O→P, O→P, N→Q → NPPQ.",
        points: 2
      },
      {
        question: "What is the probability of getting a head when tossing a fair coin?",
        options: [
          { text: "1/2", isCorrect: true },
          { text: "1/3", isCorrect: false },
          { text: "1/4", isCorrect: false },
          { text: "2/3", isCorrect: false }
        ],
        explanation: "There are two outcomes: Head or Tail. Probability = 1/2.",
        points: 1
      },
      {
        question: "Which number will replace the question mark? 5, 10, 20, 40, ?",
        options: [
          { text: "60", isCorrect: false },
          { text: "70", isCorrect: false },
          { text: "80", isCorrect: true },
          { text: "100", isCorrect: false }
        ],
        explanation: "The sequence doubles each time: ×2 → 5, 10, 20, 40, 80.",
        points: 1
      },
      {
        question: "Find the missing number: 9, 18, 36, ?, 144",
        options: [
          { text: "54", isCorrect: false },
          { text: "72", isCorrect: true },
          { text: "90", isCorrect: false },
          { text: "108", isCorrect: false }
        ],
        explanation: "Each term is multiplied by 2: 9×2=18, 18×2=36, 36×2=72, 72×2=144.",
        points: 2
      },
      {
        question: "Two dice are rolled. What is the probability that the sum is 7?",
        options: [
          { text: "1/12", isCorrect: false },
          { text: "1/6", isCorrect: true },
          { text: "1/8", isCorrect: false },
          { text: "1/9", isCorrect: false }
        ],
        explanation: "Possible pairs = (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). 6 favorable out of 36 → 1/6.",
        points: 2
      }
    ]
  }
];

const defaultCategories = [
  'Technology', 'Science', 'History', 'Sports', 'Programming',
  'General Knowledge', 'Mathematics', 'Literature', 'Databases'
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quizdb');
    console.log('Connected to MongoDB');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@quiz.com' });
    let adminUser;
    
    if (!adminExists) {
      adminUser = new User({
        name: 'Quiz Admin',
        email: 'admin@quiz.com',
        password: 'admin123',
        role: 'admin'
      });
      await adminUser.save();
      console.log('Admin user created');
    } else {
      adminUser = adminExists;
      console.log('Admin user already exists');
    }

    // Clear existing quizzes
    await Quiz.deleteMany({});
    console.log('Cleared existing quizzes');

    await Category.deleteMany({});
    console.log('Cleared existing category');

    // Create sample categories
    const categoryMap = {};
    for (const name of defaultCategories) {
      const category = await Category.findOneAndUpdate(
        { name },
        { name },
        { upsert: true, new: true }
      );
      categoryMap[name] = category._id;
    }

    console.log('Seeded default categories:', Object.keys(categoryMap));

    // Create sample quizzes
    for (const quizData of sampleQuizzes) {
      const categoryId = categoryMap[quizData.category];
      if (!categoryId) {
        console.warn(`Skipping quiz "${quizData.title}" — category not found: ${quizData.category}`);
        continue;
      }
      const quiz = new Quiz({
        ...quizData,
        category: categoryId,
        createdBy: adminUser._id
      });
      await quiz.save();
      console.log(`Created quiz: ${quiz.title}`);
    }

    console.log('Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: admin@quiz.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();