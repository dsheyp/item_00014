interface Review {
  id: number
  rating: number
  comment: string
  userName: string
  date: string
}

// Extended course interface with ratings
export interface Course {
  id: number
  title: string
  description: string
  category: string
  level: string
  students: number
  lessons: number
  image: string
  rating: number
  reviews: Review[]
  price?: number
  duration?: string
  lastUpdated?: string
  instructor?: {
    name: string
    bio: string
    avatar: string
  }
  modules?: {
    title: string
    lessons: {
      title: string
      duration: string
    }[]
  }[]
  ratings?: {
    average: number
    total: number
    distribution: Record<number, number>
  }
  longDescription?: string
}

export const allCourses: Course[] = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript to build modern websites.",
    category: "Web Development",
    level: "Beginner",
    students: 1234,
    lessons: 24,
    image: "/placeholder.svg?height=200&width=400",
    rating: 4.7,
    reviews: [
      {
        id: 1,
        rating: 5,
        comment: "This course is amazing! I've learned so much and the instructor explains everything clearly.",
        userName: "Alex Johnson",
        date: "2023-02-15",
      },
      {
        id: 2,
        rating: 4,
        comment: "Great content and well-structured course. I would have liked more advanced topics.",
        userName: "Maria Garcia",
        date: "2023-03-10",
      },
      {
        id: 3,
        rating: 5,
        comment: "The best course I've taken on this subject. The instructor's teaching style is excellent.",
        userName: "David Kim",
        date: "2023-04-05",
      },
    ],
    price: 49.99,
    duration: "18 hours",
    lastUpdated: "January 2023",
    longDescription:
      "This comprehensive course will take you from zero to hero in web development. You'll learn HTML for structure, CSS for styling, and JavaScript for interactivity. By the end of this course, you'll be able to build responsive websites from scratch and understand the core principles of modern web development.",
    instructor: {
      name: "John Smith",
      bio: "Senior Web Developer with 8+ years of experience",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "HTML Fundamentals",
        lessons: [
          { title: "Introduction to HTML", duration: "15 min" },
          { title: "HTML Document Structure", duration: "20 min" },
          { title: "Working with Text and Links", duration: "25 min" },
          { title: "HTML Forms and Inputs", duration: "30 min" },
        ],
      },
      {
        title: "CSS Styling",
        lessons: [
          { title: "CSS Basics", duration: "20 min" },
          { title: "Selectors and Properties", duration: "25 min" },
          { title: "Layout and Positioning", duration: "30 min" },
          { title: "Responsive Design", duration: "35 min" },
        ],
      },
      {
        title: "JavaScript Essentials",
        lessons: [
          { title: "JavaScript Syntax", duration: "20 min" },
          { title: "DOM Manipulation", duration: "30 min" },
          { title: "Events and Listeners", duration: "25 min" },
          { title: "Building Interactive Features", duration: "40 min" },
        ],
      },
    ],
    ratings: {
      average: 4.7,
      total: 3,
      distribution: {
        5: 2,
        4: 1,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Master advanced React concepts including hooks, context, and performance optimization.",
    category: "Frontend",
    level: "Advanced",
    students: 856,
    lessons: 18,
    image: "/placeholder.svg?height=200&width=400",
    rating: 0,
    reviews: [],
    price: 79.99,
    duration: "15 hours",
    lastUpdated: "February 2023",
    longDescription:
      "Take your React skills to the next level with this advanced course. You'll learn sophisticated patterns for state management, component composition, and performance optimization. This course covers advanced hooks, context API, code splitting, and more to help you build scalable and maintainable React applications.",
    instructor: {
      name: "Emily Chen",
      bio: "React Specialist and Frontend Architect",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "Advanced Hooks",
        lessons: [
          { title: "Custom Hooks", duration: "25 min" },
          { title: "useReducer for Complex State", duration: "30 min" },
          { title: "useCallback and useMemo", duration: "20 min" },
          { title: "useRef Deep Dive", duration: "25 min" },
        ],
      },
      {
        title: "State Management",
        lessons: [
          { title: "Context API Patterns", duration: "30 min" },
          { title: "State Machines in React", duration: "35 min" },
          { title: "Redux vs. Context", duration: "25 min" },
          { title: "Server State Management", duration: "30 min" },
        ],
      },
      {
        title: "Performance Optimization",
        lessons: [
          { title: "React Profiler", duration: "20 min" },
          { title: "Memoization Techniques", duration: "25 min" },
          { title: "Code Splitting Strategies", duration: "30 min" },
          { title: "Virtualization for Large Lists", duration: "35 min" },
        ],
      },
    ],
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
  {
    id: 3,
    title: "Full-Stack Development with Next.js",
    description: "Build complete web applications with Next.js, from frontend to backend.",
    category: "Full-Stack",
    level: "Intermediate",
    students: 642,
    lessons: 32,
    image: "/placeholder.svg?height=200&width=400",
    rating: 0,
    reviews: [],
    price: 89.99,
    duration: "24 hours",
    lastUpdated: "March 2023",
    longDescription:
      "Next.js is a powerful React framework that enables you to build full-stack web applications by extending the latest React features. In this comprehensive course, you'll learn how to leverage Next.js to create production-ready applications.\n\nYou'll master server-side rendering, static site generation, API routes, and more. By the end of this course, you'll be able to build and deploy complete web applications that are fast, SEO-friendly, and provide an excellent user experience.",
    instructor: {
      name: "Sarah Johnson",
      bio: "Full-Stack Developer with 10+ years of experience",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "Getting Started with Next.js",
        lessons: [
          { title: "Introduction to Next.js", duration: "15 min" },
          { title: "Setting Up Your Development Environment", duration: "20 min" },
          { title: "Creating Your First Next.js Project", duration: "25 min" },
          { title: "Understanding the Next.js File Structure", duration: "18 min" },
        ],
      },
      {
        title: "Routing and Navigation",
        lessons: [
          { title: "File-Based Routing in Next.js", duration: "22 min" },
          { title: "Dynamic Routes", duration: "28 min" },
          { title: "Navigation Between Pages", duration: "20 min" },
          { title: "Route Parameters and Query Strings", duration: "25 min" },
        ],
      },
      {
        title: "Data Fetching and API Routes",
        lessons: [
          { title: "Server-Side Rendering (SSR)", duration: "30 min" },
          { title: "Static Site Generation (SSG)", duration: "28 min" },
          { title: "Incremental Static Regeneration", duration: "25 min" },
          { title: "Creating API Routes", duration: "35 min" },
        ],
      },
    ],
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
  {
    id: 4,
    title: "Node.js Backend Development",
    description: "Learn to build scalable backend services with Node.js, Express, and MongoDB.",
    category: "Backend",
    level: "Intermediate",
    students: 789,
    lessons: 28,
    image: "/placeholder.svg?height=200&width=400",
    rating: 0,
    reviews: [],
    price: 69.99,
    duration: "20 hours",
    lastUpdated: "April 2023",
    longDescription:
      "Master backend development with Node.js in this comprehensive course. You'll learn how to build RESTful APIs, connect to databases, implement authentication, and deploy your applications. This course covers Express.js, MongoDB, authentication strategies, and best practices for building secure and scalable backend services.",
    instructor: {
      name: "Michael Rodriguez",
      bio: "Backend Engineer and Node.js Expert",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "Node.js Fundamentals",
        lessons: [
          { title: "Introduction to Node.js", duration: "20 min" },
          { title: "Asynchronous Programming", duration: "30 min" },
          { title: "Modules and Package Management", duration: "25 min" },
          { title: "File System Operations", duration: "20 min" },
        ],
      },
      {
        title: "Building APIs with Express",
        lessons: [
          { title: "Express.js Basics", duration: "25 min" },
          { title: "Routing and Middleware", duration: "30 min" },
          { title: "Error Handling", duration: "20 min" },
          { title: "API Design Best Practices", duration: "35 min" },
        ],
      },
      {
        title: "Database Integration",
        lessons: [
          { title: "MongoDB Basics", duration: "25 min" },
          { title: "Mongoose ODM", duration: "30 min" },
          { title: "CRUD Operations", duration: "35 min" },
          { title: "Data Validation and Schemas", duration: "25 min" },
        ],
      },
    ],
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
  {
    id: 5,
    title: "UI/UX Design Fundamentals",
    description: "Master the principles of user interface and experience design for digital products.",
    category: "Design",
    level: "Beginner",
    students: 1023,
    lessons: 20,
    image: "/placeholder.svg?height=200&width=400",
    rating: 0,
    reviews: [],
    price: 59.99,
    duration: "16 hours",
    lastUpdated: "May 2023",
    longDescription:
      "Learn the essential principles of UI/UX design to create beautiful and user-friendly digital products. This course covers design thinking, user research, wireframing, prototyping, and visual design fundamentals. You'll complete practical exercises and build a portfolio-ready project by the end of the course.",
    instructor: {
      name: "Sophia Lee",
      bio: "UI/UX Designer with experience at top tech companies",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "Design Fundamentals",
        lessons: [
          { title: "Introduction to UI/UX", duration: "20 min" },
          { title: "Design Principles", duration: "25 min" },
          { title: "Color Theory", duration: "30 min" },
          { title: "Typography Basics", duration: "25 min" },
        ],
      },
      {
        title: "User Experience Design",
        lessons: [
          { title: "User Research Methods", duration: "35 min" },
          { title: "Personas and User Journeys", duration: "30 min" },
          { title: "Information Architecture", duration: "25 min" },
          { title: "Usability Testing", duration: "40 min" },
        ],
      },
      {
        title: "Prototyping and Wireframing",
        lessons: [
          { title: "Sketching Interfaces", duration: "20 min" },
          { title: "Digital Wireframing", duration: "30 min" },
          { title: "Interactive Prototypes", duration: "35 min" },
          { title: "User Testing with Prototypes", duration: "25 min" },
        ],
      },
    ],
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
  {
    id: 6,
    title: "Mobile App Development with React",
    description: "Build cross-platform mobile applications using React Native and JavaScript.",
    category: "Mobile",
    level: "Intermediate",
    students: 567,
    lessons: 26,
    image: "/placeholder.svg?height=200&width=400",
    rating: 0,
    reviews: [],
    price: 74.99,
    duration: "22 hours",
    lastUpdated: "June 2023",
    longDescription:
      "Learn to build native mobile apps for iOS and Android using React Native. This course teaches you how to leverage your React and JavaScript skills to create truly native mobile experiences. You'll learn about mobile UI components, navigation, state management, and how to access device features like camera and location.",
    instructor: {
      name: "David Kim",
      bio: "Mobile Developer and React Native Specialist",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "React Native Basics",
        lessons: [
          { title: "Introduction to React Native", duration: "25 min" },
          { title: "Setting Up Your Environment", duration: "30 min" },
          { title: "Core Components", duration: "35 min" },
          { title: "Styling in React Native", duration: "25 min" },
        ],
      },
      {
        title: "Navigation and Routing",
        lessons: [
          { title: "Navigation Fundamentals", duration: "30 min" },
          { title: "Stack Navigation", duration: "25 min" },
          { title: "Tab and Drawer Navigation", duration: "30 min" },
          { title: "Nested Navigators", duration: "20 min" },
        ],
      },
      {
        title: "Native Device Features",
        lessons: [
          { title: "Camera Access", duration: "25 min" },
          { title: "Geolocation", duration: "20 min" },
          { title: "Local Storage", duration: "25 min" },
          { title: "Push Notifications", duration: "30 min" },
        ],
      },
    ],
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
  {
    id: 7,
    title: "Python for Data Science",
    description: "Learn Python programming for data analysis, visualization, and machine learning.",
    category: "Data Science",
    level: "Beginner",
    students: 1456,
    lessons: 30,
    image: "/placeholder.svg?height=200&width=400",
    rating: 0,
    reviews: [],
    price: 84.99,
    duration: "28 hours",
    lastUpdated: "July 2023",
    longDescription:
      "Start your journey into data science with Python, one of the most popular languages for data analysis and machine learning. This course covers Python fundamentals, data manipulation with pandas, visualization with matplotlib and seaborn, and an introduction to machine learning with scikit-learn. You'll work on real-world datasets and build a portfolio of data science projects.",
    instructor: {
      name: "Alex Johnson",
      bio: "Data Scientist and Python Educator",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "Python Fundamentals",
        lessons: [
          { title: "Introduction to Python", duration: "25 min" },
          { title: "Data Types and Structures", duration: "30 min" },
          { title: "Control Flow", duration: "25 min" },
          { title: "Functions and Modules", duration: "30 min" },
        ],
      },
      {
        title: "Data Analysis with Pandas",
        lessons: [
          { title: "Introduction to Pandas", duration: "25 min" },
          { title: "Data Cleaning", duration: "35 min" },
          { title: "Data Transformation", duration: "30 min" },
          { title: "Exploratory Data Analysis", duration: "40 min" },
        ],
      },
      {
        title: "Data Visualization",
        lessons: [
          { title: "Matplotlib Basics", duration: "25 min" },
          { title: "Seaborn for Statistical Visualization", duration: "30 min" },
          { title: "Interactive Visualizations", duration: "35 min" },
          { title: "Dashboard Creation", duration: "40 min" },
        ],
      },
    ],
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
  {
    id: 8,
    title: "Advanced JavaScript Concepts",
    description: "Deep dive into advanced JavaScript concepts like closures, prototypes, and async patterns.",
    category: "Frontend",
    level: "Advanced",
    students: 723,
    lessons: 22,
    image: "/placeholder.svg?height=200&width=400",
    rating: 0,
    reviews: [],
    price: 69.99,
    duration: "18 hours",
    lastUpdated: "August 2023",
    longDescription:
      "Take your JavaScript skills to the expert level with this deep dive into advanced concepts. You'll learn about closures, prototypes, the event loop, asynchronous patterns, and functional programming techniques. This course will help you understand the inner workings of JavaScript and write more efficient, maintainable code.",
    instructor: {
      name: "Robert Martinez",
      bio: "JavaScript Expert and Senior Frontend Engineer",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "JavaScript Under the Hood",
        lessons: [
          { title: "Execution Context and Call Stack", duration: "30 min" },
          { title: "Scope and Closures", duration: "35 min" },
          { title: "Prototypal Inheritance", duration: "30 min" },
          { title: "this Keyword Deep Dive", duration: "25 min" },
        ],
      },
      {
        title: "Asynchronous JavaScript",
        lessons: [
          { title: "Event Loop", duration: "25 min" },
          { title: "Promises in Depth", duration: "35 min" },
          { title: "Async/Await Patterns", duration: "30 min" },
          { title: "Error Handling Strategies", duration: "25 min" },
        ],
      },
      {
        title: "Functional Programming",
        lessons: [
          { title: "Pure Functions", duration: "20 min" },
          { title: "Higher-Order Functions", duration: "25 min" },
          { title: "Immutability", duration: "20 min" },
          { title: "Composition Patterns", duration: "30 min" },
        ],
      },
    ],
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
  {
    id: 9,
    title: "GraphQL API Development",
    description: "Learn to build efficient APIs with GraphQL, Apollo, and Node.js.",
    category: "Backend",
    level: "Intermediate",
    students: 512,
    lessons: 24,
    image: "/placeholder.svg?height=200&width=400",
    rating: 0,
    reviews: [],
    price: 79.99,
    duration: "20 hours",
    lastUpdated: "September 2023",
    longDescription:
      "Master GraphQL API development to build more efficient and flexible backend services. This course covers GraphQL schema design, resolvers, mutations, subscriptions, and integration with various data sources. You'll learn how to use Apollo Server with Node.js and implement authentication, authorization, and best practices for production-ready GraphQL APIs.",
    instructor: {
      name: "Lisa Wang",
      bio: "Backend Engineer specializing in GraphQL",
      avatar: "/placeholder.svg?height=100&width=100",
    },
    modules: [
      {
        title: "GraphQL Fundamentals",
        lessons: [
          { title: "Introduction to GraphQL", duration: "25 min" },
          { title: "Schema Definition Language", duration: "30 min" },
          { title: "Types and Fields", duration: "25 min" },
          { title: "Queries and Mutations", duration: "35 min" },
        ],
      },
      {
        title: "Apollo Server",
        lessons: [
          { title: "Setting Up Apollo Server", duration: "20 min" },
          { title: "Resolvers", duration: "30 min" },
          { title: "Context and Authentication", duration: "35 min" },
          { title: "Error Handling", duration: "25 min" },
        ],
      },
      {
        title: "Advanced GraphQL",
        lessons: [
          { title: "Subscriptions", duration: "30 min" },
          { title: "DataLoader for Batching", duration: "25 min" },
          { title: "Caching Strategies", duration: "30 min" },
          { title: "Performance Optimization", duration: "35 min" },
        ],
      },
    ],
    ratings: {
      average: 0,
      total: 0,
      distribution: {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      },
    },
  },
]

