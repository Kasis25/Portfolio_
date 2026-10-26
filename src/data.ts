export const DATA = {
  name: 'Kasis Kachiya',
  first: 'Kasis',
  role: ['FULL-STACK', 'DEVELOPER.'],
  tagline:
    'I build fast, clean web products end to end: React interfaces, Node and .NET APIs, MySQL and MongoDB underneath. Shipping real client work at MSM Solutions in Surat.',
  manifesto: [
    ['I turn ideas into ', false], ['fast, honest', true], [' web products. From sharp ', false], ['React', true],
    [' interfaces to REST and .NET ', false], ['APIs', true], [' and the databases beneath them, I build the ', false],
    ['whole stack', true], [' and care about every layer.', false],
  ] as [string, boolean][],
  stats: [
    { label: 'CGPA · BCA', value: 9.01, decimals: 2, suffix: '' },
    { label: 'Distinction · BCA 2025', value: 1, decimals: 0, suffix: 'ST' },
    { label: 'Public repositories', value: 10, decimals: 0, suffix: '' },
  ],
  projects: [
    {
      n: '01', cat: 'Portfolio', name: 'This Portfolio', desc: 'A scroll-driven TypeScript portfolio.',
      chips: ['TypeScript', 'React', 'HTML', 'CSS'], href: 'https://github.com/Kasis25/Portfolio', visual: 'gauge',
    },
    {
      n: '02', cat: 'Client work', name: 'Hline Consumer', desc: 'Consumer-facing web app built at MSM Solutions.',
      chips: ['JavaScript', 'React.js', 'Node.js', 'REST APIs'], href: 'https://github.com/Kasis25/Hline_Consumer', visual: 'heat',
    },
    {
      n: '03', cat: 'Landing page', name: 'Art-MSM', desc: 'Landing page for the Art-HI project at MSM.',
      chips: ['HTML', 'CSS', 'JavaScript', 'Responsive'], href: 'https://github.com/Kasis25/Art-MSM', visual: 'page',
    },
  ],
  startYear: 2022,
  gradYear: 2025,
  journey: [
    { when: '04/2025 – NOW', title: 'Full-Stack Developer', org: 'MSM Solutions, Surat' },
    { when: '03/2025', title: 'BCA, First Distinction', org: 'CGPA 9.01 · VNSGU' },
    { when: '06/2022', title: 'Began BCA', org: 'Suart Sutex Bank College' },
  ],
  skills: [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js', 'MongoDB',
    'MySQL', 'REST APIs', '.NET APIs', 'API Integration', 'Git & GitHub', 'C', 'C++', '3D Websites',
  ],
  counters: [
    { n: 9.01, d: 2, suffix: '★', label: 'CGPA' },
    { n: 10, d: 0, suffix: '', label: 'Public repos' },
    { n: 16, d: 0, suffix: '+', label: 'Technologies' },
    { n: 3, d: 0, suffix: '', label: 'Languages spoken' },
  ],
  creds: [
    { t: 'BCA · First Distinction', i: 'VNSGU · 2025' },
    { t: 'Full-Stack Developer', i: 'MSM Solutions · 2025' },
    { t: 'CGPA 9.01', i: 'Suart Sutex Bank College' },
    { t: 'React.js', i: 'Front end' },
    { t: 'Node & Express', i: 'Back end' },
    { t: 'REST & .NET APIs', i: 'Integration' },
    { t: 'MongoDB & MySQL', i: 'Data' },
    { t: '3D Websites', i: 'CSS 3D · GSAP' },
  ],
  email: 'kasispatel0071@gmail.com',
  github: 'https://github.com/Kasis25',
  linkedin: 'https://www.linkedin.com/in/kasis-patel-4b0a44336/',
  resume: './resume.pdf',
}
