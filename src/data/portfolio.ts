// ──────────────────────────────────────────────────────────────────
//  AKSHIT JAIN — PORTFOLIO DATA
// ──────────────────────────────────────────────────────────────────

export const personal = {
  name: 'Akshit Jain',
  firstName: 'Akshit',
  lastName: 'Jain',
  title: 'Machine Learning Engineer',
  subtitle: 'ML Engineer & CS Student',
  tagline: 'Software Engineer specializing in scalable web applications and intelligent systems.',
  bio: "I'm a BTech CSE student at LPU with a passion for building robust software and solving complex problems. When I'm not coding, you'll find me exploring new technologies or refining system architectures. I have a hunger for perfection and believe that learning never stops. Active in competitive programming and full-stack development.",
  shortBio: 'Software Engineer building scalable web applications and intelligent systems. Passionate about writing clean, efficient code and transforming ideas into robust products.',
  education: '3rd Year BTech @ LPU',
  focus: 'Machine Learning',
  languages: '5+ Languages',
  profileImage: '/profile.jpg',
  resume: '/Akshit_jain_CV.pdf',
  email: 'akshitjainonly1@gmail.com',
  phone: '+91 935055XXXX',
  location: 'Phagwara, India',
  availability: 'Available for opportunities',
  social: {
    github: 'https://github.com/akshitjain1',
    linkedin: 'https://www.linkedin.com/in/akshit-jain-b75a6028b',
    twitter: 'https://twitter.com/akshitjain',
    instagram: 'https://instagram.com/akshitjain__1',
    leetcode: 'https://leetcode.com/u/AkshitJain__1/',
    gfg: 'https://www.geeksforgeeks.org/user/akshitjain__1/',
  },
  stats: [
    { label: 'Languages Mastered', value: '5+' },
    { label: 'Projects Built', value: '12+' },
    { label: 'Certifications', value: '17+' },
    { label: 'LeetCode Solved', value: '100+' },
  ],
  funFacts: [
    'Transforms problems into elegant solutions',
    'Music fuels my coding sessions',
    'Perfectionist at heart, learner by nature',
    'Python & C++ are my languages of choice',
  ],
};

// ──────────────────────────────────────────────────────────────────
//  WHAT I DO (Services / Capabilities)
// ──────────────────────────────────────────────────────────────────
export const capabilities = [
  {
    id: '01',
    title: 'Machine Learning & AI',
    items: [
      'Supervised & Unsupervised Learning models',
      'NLP & Clinical Entity Recognition',
      'Data-driven predictive modelling',
    ],
  },
  {
    id: '02',
    title: 'Web Development',
    items: [
      'Full-stack Django web applications',
      'Responsive HTML/CSS/JS frontends',
      'E-commerce & exam platform systems',
    ],
  },
  {
    id: '03',
    title: 'Data Science & Analysis',
    items: [
      'Exploratory data analysis with Pandas',
      'Data visualisation with Matplotlib',
      'Streamlit interactive dashboards',
      'Statistical modelling & clustering',
    ],
  },
  {
    id: '04',
    title: 'Problem Solving & DSA',
    items: [
      'Competitive programming (LeetCode / GFG)',
      'Algorithm design & optimisation',
      'Pathfinding & graph algorithms',
      'C++ & Python based solutions',
    ],
  },
];

// ──────────────────────────────────────────────────────────────────
//  SKILLS
// ──────────────────────────────────────────────────────────────────
export const skillsMarquee = [
  'Python', 'C++', 'Java', 'JavaScript', 'HTML', 'CSS',
  'Django', 'Flask', 'Streamlit', 'React', 'Bootstrap',
  'Machine Learning', 'PyTorch', 'Matplotlib',
  'Pandas', 'NumPy', 'Scikit-learn', 'MySQL', 'Git',
  'Jupyter', 'Tesseract OCR', 'Gemini API', 'K-Modes',
];

export const skillCategories = [
  {
    category: 'Programming Languages',
    skills: [
      { name: 'Python', level: 90 },
      { name: 'C', level: 90 },
      { name: 'C++', level: 80 },
      { name: 'Java', level: 70 },
      { name: 'JavaScript', level: 80 },
    ],
  },
  {
    category: 'Web Development',
    skills: [
      { name: 'HTML / CSS', level: 80 },
      { name: 'Django', level: 80 },
      { name: 'Flask', level: 70 },
      { name: 'React', level: 65 },
      { name: 'Bootstrap', level: 75 },
      { name: 'Streamlit', level: 75 },
    ],
  },
  {
    category: 'AI / ML & Data Science',
    skills: [
      { name: 'Machine Learning', level: 80 },
      { name: 'Pandas / NumPy', level: 75 },
      { name: 'Scikit-learn', level: 70 },
      { name: 'PyTorch', level: 60 },
      { name: 'Matplotlib', level: 70 },
    ],
  },
  {
    category: 'Database & Tools',
    skills: [
      { name: 'MySQL', level: 80 },
      { name: 'Git / GitHub', level: 80 },
      { name: 'Jupyter', level: 85 },
      { name: 'VS Code', level: 90 },
      { name: 'Tesseract OCR', level: 70 },
      { name: 'Gemini API', level: 75 },
    ],
  },
];

// ──────────────────────────────────────────────────────────────────
//  PROJECTS
// ──────────────────────────────────────────────────────────────────
export const projects = [
  {
    id: 1,
    title: 'Explainable Clinical Entity Recognition',
    subtitle: '(De-identified EHR)',
    description:
      'An end-to-end NLP system for extracting clinical entities from EHRs while ensuring patient privacy through de-identification and providing XAI for model predictions. Features 72% accuracy, comprehensive PHI masking (10+ pattern types), and transformer-based biomedical NER.',
    image: '/projects/ecer.png',
    tags: ['Python', 'HuggingFace', 'PyTorch', 'Streamlit', 'NLP', 'Healthcare AI'],
    category: 'Machine Learning',
    github: 'https://github.com/akshitjain1/EHR-CNER-Explainable',
    demo: '',
    featured: true,
  },
  {
    id: 2,
    title: 'Rheumatoid Arthritis Patient Stratification',
    subtitle: 'K-Modes Clustering',
    description:
      'A clinically interpretable, patent-based ML system for identifying meaningful subgroups of RA patients using categorical comorbidity, lifestyle, demographic, and socioeconomic data. Patent filed: K-Modes Clustering on Categorical Comorbidity and Symptom Data.',
    image: '/projects/ra_kmodes.png',
    tags: ['Python', 'pandas', 'K-Modes', 'Streamlit', 'matplotlib'],
    category: 'Machine Learning',
    github: 'https://github.com/akshitjain1/ra-kmodes-stratification',
    demo: 'https://ra-kmodes-stratification.streamlit.app/',
    featured: true,
  },
  {
    id: 3,
    title: 'Handwritten Assignment Grader',
    subtitle: 'OCR + Gemini AI',
    description:
      'An intelligent web-based grader that evaluates handwritten assignments using OCR and Gemini AI. Provides detailed evaluation, grammar correction, and content classification.',
    image: '/projects/handwritten-assignment.png',
    tags: ['Python', 'Streamlit', 'Tesseract OCR', 'Gemini API'],
    category: 'Machine Learning',
    github: 'https://github.com/akshitjain1/Handwritten-Classifier.git',
    demo: 'https://handwritten-classifier-by-aj.streamlit.app/',
    featured: true,
  },
  {
    id: 4,
    title: 'Exam Platform',
    subtitle: 'Django-based LMS',
    description:
      'A comprehensive Django-based online examination platform featuring email OTP verification, MCQ/Subjective/Mixed question types, automatic evaluation, admin dashboard, and secure password reset.',
    image: '/projects/exam-platform.png',
    tags: ['Django', 'Python', 'MySQL', 'Bootstrap', 'Gmail SMTP'],
    category: 'Web Application',
    github: 'https://github.com/akshitjain1/exam_platform',
    demo: '',
    featured: true,
  },
  {
    id: 5,
    title: 'Pathfinding Visualizer',
    subtitle: 'Algorithm Visualiser',
    description:
      'An interactive web app that visualises classic pathfinding algorithms: A*, Dijkstra\'s, BFS, and DFS. Features real-time animation, maze generation, and a unique comparison mode.',
    image: '/projects/pathfinding-visualizer.png',
    tags: ['JavaScript', 'HTML', 'Tailwind CSS', 'Algorithms'],
    category: 'Web Application',
    github: 'https://github.com/akshitjain1/Maze-Path-Finder/',
    demo: 'https://akshitjain1.github.io/Maze-Path-Finder/',
    featured: true,
  },
  {
    id: 6,
    title: 'CampusMart',
    subtitle: 'Campus E-commerce',
    description:
      'A Django-based e-commerce platform for campus communities. Features user authentication, product listings, shopping cart, order management, and a comprehensive admin panel.',
    image: '/projects/campusmart.png',
    tags: ['Django', 'Python', 'MySQL', 'CSS', 'E-commerce'],
    category: 'Web Application',
    github: 'https://github.com/akshitjain1/django_ecommerce_1',
    demo: '',
    featured: false,
  },
  {
    id: 7,
    title: 'Home Loan Advisor',
    subtitle: 'AI Financial Tool',
    description:
      'A Streamlit app that helps users assess loan eligibility and provides personalised advice using Gemini API. Features EMI calculator and context-aware chat support.',
    image: '/projects/home-loan-advisor.png',
    tags: ['Python', 'Streamlit', 'Gemini API'],
    category: 'Web Application',
    github: 'https://github.com/akshitjain1/Home-Loan-Advisor.git',
    demo: 'https://home-loan-advisor-kh2s8dbmjap8ejhdxl5hxa.streamlit.app/',
    featured: false,
  },
  {
    id: 8,
    title: 'Your Buddy Speaker',
    subtitle: 'TTS Desktop App',
    description:
      'A Python GUI application that translates text into multiple languages and speaks it aloud using text-to-speech synthesis. Features voice selection and real-time translation.',
    image: '/projects/robot-speaker.png',
    tags: ['Python', 'pyttsx3', 'googletrans', 'tkinter'],
    category: 'Desktop Application',
    github: 'https://github.com/akshitjain1/your_buddy_speaker.git',
    demo: '',
    featured: false,
  },
  {
    id: 9,
    title: 'Bytebazzar',
    subtitle: 'E-commerce Site',
    description:
      'A fully responsive e-commerce website built from scratch. Features complete shopping experience with user authentication, product catalogue, and responsive design.',
    image: '/projects/byte-bazzar.png',
    tags: ['HTML', 'CSS', 'JavaScript'],
    category: 'Web Development',
    github: 'https://github.com/akshitjain1/Bytebazzar.git',
    demo: 'https://akshitjain1.github.io/Bytebazzar/',
    featured: false,
  },
  {
    id: 10,
    title: 'Eco Tech',
    subtitle: 'Awareness Platform',
    description:
      'A comprehensive responsive website dedicated to raising awareness about electronic waste. Features interactive content, Bootstrap components, and engaging animations.',
    image: '/projects/eco-tech.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    category: 'Web Development',
    github: 'https://github.com/akshitjain1/Eco-TecH',
    demo: 'https://akshitjain1.github.io/Eco-TecH/',
    featured: false,
  },
  {
    id: 11,
    title: 'AUTO-NO',
    subtitle: 'Hackathon Project',
    description:
      'A hackathon project with interactive quizzes and dynamic web interfaces. Developed during Hackathon IOD 16 Feb 24.',
    image: '/projects/auto-no.png',
    tags: ['HTML', 'CSS', 'JavaScript', 'Hackathon'],
    category: 'Web Development',
    github: 'https://github.com/akshitjain1/AUTO-NO.git',
    demo: '',
    featured: false,
  },
  {
    id: 12,
    title: 'Employee Management System',
    subtitle: 'Django-based Enterprise Solution',
    description:
      'A comprehensive, modern Django-based Employee Management System featuring an integrated public website and multi-role portals for Admins, HR staff, and Employees. Includes attendance tracking with overlap detection, task management with file attachments, leave workflows, and robust security features like OTP verification and account locking.',
    image: '/projects/ems.png',
    tags: ['Django', 'Python', 'SQLite', 'Bootstrap', 'Chart.js', 'OTP Auth'],
    category: 'Web Application',
    github: 'https://github.com/akshitjain1/Employee_management_system',
    demo: '',
    featured: true,
  },
];

// ──────────────────────────────────────────────────────────────────
//  EDUCATION
// ──────────────────────────────────────────────────────────────────
export const education = [
  {
    id: 1,
    degree: 'BTech in Computer Science (ML)',
    institution: 'Lovely Professional University',
    location: 'Phagwara, Punjab',
    period: 'July 2023 – Present',
    description:
      'Bachelor of Technology in Computer Science with specialisation in Machine Learning. 3rd year student passionate about AI/ML and problem-solving. Active participant in hackathons.',
    highlights: ['Machine Learning specialisation', 'Active hackathon participant', 'Multiple ML research projects'],
    current: true,
  },
  {
    id: 2,
    degree: 'Senior Secondary (Class XII — CBSE)',
    institution: 'Himgiri Public School',
    location: 'Panipat, Haryana',
    period: 'April 2021 – June 2022',
    description:
      'Higher secondary education with Science stream (PCM). Built strong foundation in Mathematics and Physics.',
    highlights: ['Science stream (PCM)', 'Strong academic performance'],
    current: false,
  },
  {
    id: 3,
    degree: 'Secondary (Class X — CBSE)',
    institution: 'Himgiri Public School',
    location: 'Panipat, Haryana',
    period: 'April 2019 – March 2020',
    description:
      'Secondary education with excellent academic performance. Developed early interest in computer science.',
    highlights: ['Excellent academic record', 'Early interest in programming'],
    current: false,
  },
];

// ──────────────────────────────────────────────────────────────────
//  EXPERIENCE
// ──────────────────────────────────────────────────────────────────
export const experience: any[] = [];

// ──────────────────────────────────────────────────────────────────
//  CERTIFICATIONS (top 10 most relevant)
// ──────────────────────────────────────────────────────────────────
export const certifications = [
  {
    id: 1,
    title: 'Computational Theory: Language Principle & Finite Automata',
    issuer: 'Skillsoft',
    date: 'Aug 2025',
    credentialId: '157772739',
    category: 'Computer Science',
  },
  {
    id: 2,
    title: 'DSA Summer Training',
    issuer: 'Hitbullseye',
    date: 'Jul 2025',
    credentialId: '',
    category: 'Algorithms',
  },
  {
    id: 3,
    title: 'JAVA Programming',
    issuer: 'Lovely Professional University',
    date: 'May 2025',
    credentialId: '',
    category: 'Programming',
  },
  {
    id: 4,
    title: 'Data Structures and Algorithm',
    issuer: 'Lovely Professional University',
    date: 'Dec 2024',
    credentialId: '',
    category: 'Algorithms',
  },
  {
    id: 5,
    title: 'Object Oriented Programming',
    issuer: 'Lovely Professional University',
    date: 'Dec 2024',
    credentialId: '',
    category: 'Programming',
  },
  {
    id: 6,
    title: 'Packet Switching Networks and Algorithms',
    issuer: 'University of Colorado Boulder',
    date: 'Nov 2024',
    credentialId: '',
    category: 'Networking',
  },
  {
    id: 7,
    title: 'The Bits and Bytes of Computer Networking',
    issuer: 'Google',
    date: 'Sep 2024',
    credentialId: '',
    category: 'Networking',
  },
  {
    id: 8,
    title: 'Introduction to Hardware and Operating Systems',
    issuer: 'IBM',
    date: 'Sep 2024',
    credentialId: '',
    category: 'Systems',
  },
  {
    id: 9,
    title: 'Mastering Full Stack Development',
    issuer: 'Udemy',
    date: 'Feb 2024',
    credentialId: '',
    category: 'Web Dev',
  },
  {
    id: 10,
    title: 'Responsive Web Design',
    issuer: 'freeCodeCamp',
    date: 'Nov 2023',
    credentialId: '',
    category: 'Web Dev',
  },
  {
    id: 11,
    title: 'Digital Systems: From Logic Gates to Processors',
    issuer: 'Universitat Autònoma de Barcelona',
    date: 'Sep 2024',
    credentialId: '',
    category: 'Hardware',
  },
  {
    id: 12,
    title: 'Computer Programming',
    issuer: 'Lovely Professional University',
    date: 'May 2024',
    credentialId: '',
    category: 'Programming',
  },
];

// ──────────────────────────────────────────────────────────────────
//  CODING PROFILES
// ──────────────────────────────────────────────────────────────────
export const codingProfiles = {
  github: {
    username: 'akshitjain1',
    url: 'https://github.com/akshitjain1',
    repos: 20,
    contributions: 350,
    stars: 2,
    topLanguages: ['Python', 'C++', 'HTML', 'JavaScript'],
    statsImg:
      'https://github-readme-stats.vercel.app/api?username=akshitjain1&show_icons=true&theme=default&hide_border=true&count_private=true',
  },
  leetcode: {
    username: 'AkshitJain__1',
    url: 'https://leetcode.com/u/AkshitJain__1/',
    solved: '100+',
    ranking: '',
  },
  gfg: {
    username: 'akshitjain__1',
    url: 'https://www.geeksforgeeks.org/user/akshitjain__1/',
    score: 'Active',
  },
};
