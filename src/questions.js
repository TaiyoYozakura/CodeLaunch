// Questions for each round
export const questions = [
  // KickOff Round - Code Writing
  {
    id: 1,
    roundName: 'kickoff',
    title: 'Reverse a String',
    description: 'Write a function that takes a string as input and returns the reversed string.',
    difficulty: 'easy',
    isDBQuestion: false,
    fileExtension: 'js'
  },
  {
    id: 2,
    roundName: 'kickoff',
    title: 'Find Maximum in Array',
    description: 'Write a function to find and return the maximum number in an array of integers.',
    difficulty: 'easy',
    isDBQuestion: false,
    fileExtension: 'py'
  },
  {
    id: 12,
    roundName: 'kickoff',
    title: 'SQL - Select All Students',
    description: 'Write a SQL query to select all students from the students table.',
    difficulty: 'easy',
    isDBQuestion: true,
    fileExtension: 'sql'
  },
  
  // Detect Round - Debug & Fix
  {
    id: 3,
    roundName: 'detect',
    title: 'Fix the Loop Error',
    description: 'The following code has a syntax error in the loop. Identify and fix it.',
    difficulty: 'medium',
    isDBQuestion: false,
    fileExtension: 'cpp'
  },
  {
    id: 4,
    roundName: 'detect',
    title: 'Correct Variable Scope',
    description: 'Find the variable scope issue causing undefined behavior and fix it.',
    difficulty: 'medium',
    isDBQuestion: false,
    fileExtension: 'java'
  },
  {
    id: 13,
    roundName: 'detect',
    title: 'SQL - Fix Join Query',
    description: 'Debug and fix the SQL query that has an incorrect JOIN syntax.',
    difficulty: 'medium',
    isDBQuestion: true,
    fileExtension: 'sql'
  },
  
  // Predict Round - Output Guessing
  {
    id: 5,
    roundName: 'predict',
    title: 'Predict Array Output',
    description: 'What will be the output of the given array manipulation code?',
    difficulty: 'medium',
    isDBQuestion: false,
    fileExtension: 'js'
  },
  {
    id: 6,
    roundName: 'predict',
    title: 'Predict Closure Behavior',
    description: 'Predict the output of the code involving closures and scope.',
    difficulty: 'hard',
    isDBQuestion: false,
    fileExtension: 'js'
  },
  {
    id: 14,
    roundName: 'predict',
    title: 'SQL - Predict Query Result',
    description: 'Predict the output of the given SQL query with GROUP BY and HAVING clauses.',
    difficulty: 'medium',
    isDBQuestion: true,
    fileExtension: 'sql'
  },
  
  // Transform Round - Code Modification
  {
    id: 7,
    roundName: 'transform',
    title: 'Convert Loop to Recursion',
    description: 'Transform the given iterative solution into a recursive implementation.',
    difficulty: 'hard',
    isDBQuestion: false,
    fileExtension: 'py'
  },
  {
    id: 8,
    roundName: 'transform',
    title: 'Optimize Time Complexity',
    description: 'Modify the given O(n²) solution to achieve O(n) time complexity.',
    difficulty: 'hard',
    isDBQuestion: false,
    fileExtension: 'cpp'
  },
  {
    id: 11,
    roundName: 'transform',
    title: 'SQL Query - Employee Data',
    description: 'Write a SQL query to find all employees with salary greater than 50000.',
    difficulty: 'medium',
    isDBQuestion: true,
    fileExtension: 'sql'
  },
  
  // Decoded Round - Algorithm Explanation
  {
    id: 9,
    roundName: 'decoded',
    title: 'Explain Binary Search',
    description: 'Explain how binary search works, its time complexity, and when to use it.',
    difficulty: 'medium',
    isDBQuestion: false,
    fileExtension: 'md'
  },
  {
    id: 10,
    roundName: 'decoded',
    title: 'Explain Dynamic Programming',
    description: 'Explain the concept of dynamic programming with memoization and tabulation approaches.',
    difficulty: 'hard',
    isDBQuestion: false,
    fileExtension: 'md'
  },
  {
    id: 15,
    roundName: 'decoded',
    title: 'SQL - Explain Indexing',
    description: 'Explain how database indexing works and when to use different types of indexes.',
    difficulty: 'hard',
    isDBQuestion: true,
    fileExtension: 'md'
  }
];

export const getQuestionsByRound = (roundName) => {
  return questions.filter(q => q.roundName === roundName);
};

export const getRandomQuestion = (roundName) => {
  const roundQuestions = getQuestionsByRound(roundName);
  if (roundQuestions.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * roundQuestions.length);
  return roundQuestions[randomIndex];
};