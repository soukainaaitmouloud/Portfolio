
/* =========================================
   SOUKAINA — PORTFOLIO JAVASCRIPT
   EmailJS contact form integration
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  // 1. MOBILE NAVIGATION
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.getElementById("navLinks");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      });
    });

    document.addEventListener("click", (event) => {
      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
      }
    });
  }

  // 2. ACTIVE NAVIGATION LINK
  const sections = document.querySelectorAll("main section[id]");
  const navigationLinks = document.querySelectorAll(".nav-links a");

  function setActiveLink(sectionId) {
    navigationLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${sectionId}`;
      link.classList.toggle("active", isActive);
    });
  }

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          );

        if (visibleSections.length > 0) {
          setActiveLink(visibleSections[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // 3. SKILLS CATEGORY TABS
  const skillTabs = document.querySelectorAll(".skill-tab");
  const skillCards = document.querySelectorAll(".skill-card");

  function showSkills(category) {
    const selectedCategory = String(category).trim().toLowerCase();

    skillTabs.forEach((tab) => {
      const tabCategory = (tab.dataset.category || "")
        .trim()
        .toLowerCase();

      const isActive = tabCategory === selectedCategory;
      tab.classList.toggle("active", isActive);
      tab.setAttribute("aria-pressed", String(isActive));
    });

    skillCards.forEach((card) => {
      const cardCategory = (card.dataset.skillCategory || "")
        .trim()
        .toLowerCase();

      const isVisible =
        selectedCategory === "all" ||
        cardCategory === selectedCategory;

      card.hidden = !isVisible;
      card.style.display = isVisible ? "" : "none";
    });
  }

  if (skillTabs.length && skillCards.length) {
    skillTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        if (tab.dataset.category) {
          showSkills(tab.dataset.category);
        }
      });
    });

    showSkills("frontend");
  }

  // 4. CONTACT FORM — EMAILJS
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");

  const EMAILJS_PUBLIC_KEY = "KOH5xLKu-fCVQLjcV";
  const EMAILJS_SERVICE_ID = "service_5v04mg8";
  const EMAILJS_TEMPLATE_ID = "template_h5vt9y8";

  // Initialize EmailJS only if its library loaded.
  if (window.emailjs) {
    window.emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!contactForm.reportValidity()) return;

      const name = contactForm.elements["name"]?.value.trim() || "";
      const email = contactForm.elements["email"]?.value.trim() || "";
      const message = contactForm.elements["message"]?.value.trim() || "";

      if (!name || !email || !message) {
        if (formNote) {
          formNote.textContent = "Please complete all fields.";
        }
        return;
      }

      if (!window.emailjs) {
        if (formNote) {
          formNote.textContent =
            "The email service could not load. Please refresh and try again.";
        }
        console.error("EmailJS library not found. Check index.html.");
        return;
      }

      if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY_HERE") {
        if (formNote) {
          formNote.textContent =
            "Email setup is incomplete. Please add your EmailJS Public Key.";
        }
        console.error("Replace YOUR_PUBLIC_KEY_HERE with your real Public Key.");
        return;
      }

      const submitButton = contactForm.querySelector(
        'button[type="submit"]'
      );
      const originalButtonText = submitButton
        ? submitButton.textContent
        : "";

      if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = "Sending...";
      }

      if (formNote) {
        formNote.textContent = "Sending your message...";
      }

      try {
        await window.emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            name: name,
            email: email,
            message: message,
            title: "Portfolio contact message"
          }
        );

        if (formNote) {
          formNote.textContent =
            "Message sent successfully! Thank you for contacting me. ♡";
        }

        contactForm.reset();
      } catch (error) {
        console.error("EmailJS send error:", error);

        if (formNote) {
          formNote.textContent =
            "Your message could not be sent. Please try again or email me directly.";
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = originalButtonText;
        }
      }
    });
  }

  // 5. SMOOTH SCROLL FOR INTERNAL LINKS
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;

        target.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start"
        });

        history.replaceState(null, "", targetId);

        if (target.matches("section[id]")) {
          setActiveLink(target.id);
        }
      }
    });
  });

  // 6. PROJECT CARD ENTRANCE ANIMATION
  const projectCards = document.querySelectorAll(".project-card");

  if (
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    const cardObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    projectCards.forEach((card) => cardObserver.observe(card));
  } else {
    projectCards.forEach((card) => card.classList.add("visible"));
  }

  // 7. CURRENT YEAR IN FOOTER
  const footerCopyright = document.querySelector(".footer > small");

  if (footerCopyright) {
    footerCopyright.textContent =
      `© ${new Date().getFullYear()} Soukaina. All rights reserved.`;
  }

  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 8. IMAGE ERROR HANDLING
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener(
      "error",
      () => {
        img.style.backgroundColor = "#211526";
        img.style.color = "#e9a9d2";
        console.warn("Could not load image:", img.getAttribute("src"));
      },
      { once: true }
    );
  });

    console.log("✨ Soukaina's portfolio is ready!");

  // 9. WEBSITE LANGUAGE SWITCHER
  const languageButtons = document.querySelectorAll(".lang-btn");

  const translations = {
  
en: {
  home: "Home",
  about: "About",
  skills: "Skills",
  languages: "Languages",
  projects: "Projects",
  contact: "Contact",
  connect: "Let's Connect ↗",

  welcome: "WELCOME TO MY PORTFOLIO",
  intro: "Hello, I'm",
  role: "Aspiring Front-End Developer",
  subtitle: "Computer Science Graduate | Creative Mind | Lifelong Learner",
  heroDescription: "I love turning ideas into beautiful and meaningful digital experiences. I'm passionate about learning, creating, and building for the web. I'm currently looking for an opportunity to grow my skills and gain professional experience in web development.",

  viewProjects: "View My Projects →",
  cvEnglish: "CV English ↓",
  cvFrench: "CV Français ↓",

  aboutEyebrow: "GET TO KNOW ME",
  aboutTitle: "About Me",
  aboutHeading: "A Dreamer, a Learner,<br>and a Creator",
  aboutParagraph: "I completed four years of Computer Science studies at Nanjing University of Posts and Telecommunications (NJUPT) in China, from 2022 to 2026. I'm passionate about web development, design, and technology. I'm looking for an opportunity to apply my knowledge, gain professional experience, and continue learning while contributing to real-world projects.",

  education: "Education",
  educationValue: "Computer Science — NJUPT, China",
  location: "Location",
  locationValue: "Morocco",
  interests: "Interests",
  interestsValue: "Web Development, Design, Animals",

  skillsEyebrow: "MY TECH TOOLKIT",
  skillsTitle: "My Skills",
  skillsDescription: "Technologies I have studied and used in my projects.",
  frontend: "Frontend",
  backend: "Backend",
  tools: "Tools",
  programming: "Programming",

  pageStructure: "Page structure",
  stylingLayouts: "Styling and layouts",
  interactiveWebsites: "Interactive websites",
  uiComponents: "UI components",
  backendRuntime: "JavaScript runtime",
  backendFramework: "Backend framework",
  relationalDatabase: "Relational database",
  versionControl: "Version control",
  codeEditor: "Code editor",

  languageEyebrow: "COMMUNICATING WITH THE WORLD",
  languageTitle: "My Languages",
  languageDescription: "Languages that connect me with people, cultures, and opportunities.",
  arabic: "Arabic",
  english: "English",
  french: "French",
  chinese: "Chinese (Mandarin)",
  native: "Native",
  fluent: "Fluent",
  basic: "Basic",
  nativeDescription: "Native",
  fluentDescription: "Fluent",
  basicDescription: "Basic",

  projectsEyebrow: "A FEW THINGS I'VE CREATED",
  projectsTitle: "My Projects",
  viewGithub: "View GitHub ↗",
  flightDescription: "Flight Booking Website",
  memoryDescription: "Interactive Memory Game",
  traceDescription: "Transparent Humanitarian Aid Platform",

  contactEyebrow: "HAVE A PROJECT IN MIND?",
  contactTitle: "Let's Connect",
  contactDescription: "I'm open to internship opportunities, collaborations, and interesting conversations. Feel free to contact me!",
  country: "Morocco",
  contactNote: "Good ideas build better futures ♡",
  yourName: "Your Name",
  yourEmail: "Your Email",
  yourMessage: "Your Message",
  programmingDescription: "Programming",
  sendMessage: "Send Message →",
  formHelp: "Send me a message directly through this form. ♡",

  footerTagline: "Good Ideas Build Better Futures ♡",
  footerRights: "All rights reserved.",
  footerHome: "Home",
  footerAbout: "About",
  footerSkills: "Skills",
  footerProjects: "Projects",
  footerContact: "Contact"
},

   
fr: {
  home: "Accueil",
  about: "À propos",
  skills: "Compétences",
  languages: "Langues",
  projects: "Projets",
  contact: "Contact",
  connect: "Me contacter ↗",

  welcome: "BIENVENUE SUR MON PORTFOLIO",
  intro: "Bonjour, je suis",
  role: "Développeuse Front-End en devenir",
  subtitle: "Diplômée en informatique | Esprit créatif | Apprentissage continu",
  heroDescription: "J'aime transformer les idées en expériences numériques belles et utiles. Passionnée par l'apprentissage, la création et le web, je recherche une opportunité pour développer mes compétences et acquérir une expérience professionnelle.",
  viewProjects: "Voir mes projets →",
  cvEnglish: "CV anglais ↓",
  cvFrench: "CV français ↓",

  aboutEyebrow: "APPRENEZ À ME CONNAÎTRE",
  aboutTitle: "À propos de moi",
  aboutHeading: "Une rêveuse, une apprenante,<br>et une créatrice",
  aboutParagraph: "J'ai effectué quatre années d'études en informatique à l'Université des Postes et Télécommunications de Nanjing (NJUPT), en Chine, de 2022 à 2026. Je m'intéresse au développement web, au design et aux technologies. Je recherche une opportunité pour mettre en pratique mes connaissances, acquérir une expérience professionnelle et continuer à apprendre tout en contribuant à des projets concrets.",

  education: "Formation",
  educationValue: "Informatique — NJUPT, Chine",
  location: "Lieu",
  locationValue: "Maroc",
  interests: "Centres d’intérêt",
  interestsValue: "Développement web, design, animaux",

  skillsEyebrow: "MES OUTILS TECHNIQUES",
  skillsTitle: "Mes compétences",
  skillsDescription: "Technologies étudiées et utilisées dans mes projets.",
  frontend: "Front-End",
  backend: "Back-End",
  tools: "Outils",
  programming: "Programmation",

  pageStructure: "Structure des pages",
  stylingLayouts: "Styles et mises en page",
  interactiveWebsites: "Sites web interactifs",
  uiComponents: "Composants d'interface",
  backendRuntime: "Environnement d'exécution JavaScript",
  backendFramework: "Framework back-end",
  relationalDatabase: "Base de données relationnelle",
  versionControl: "Gestion de versions",
  codeEditor: "Éditeur de code",
  programmingDescription: "Programmation",

  languageEyebrow: "COMMUNIQUER AVEC LE MONDE",
  languageTitle: "Mes langues",
  languageDescription: "Des langues qui me relient aux personnes, aux cultures et aux opportunités.",
  arabic: "Arabe",
  english: "Anglais",
  french: "Français",
  chinese: "Chinois (mandarin)",
  native: "Langue maternelle",
  fluent: "Courant",
  basic: "Notions de base",
  nativeDescription: "Langue maternelle",
  fluentDescription: "Courant",
  basicDescription: "Notions de base",

  projectsEyebrow: "QUELQUES-UNES DE MES CRÉATIONS",
  projectsTitle: "Mes projets",
  viewGithub: "Voir GitHub ↗",
  flightDescription: "Site de réservation de vols",
  memoryDescription: "Jeu de mémoire interactif",
  traceDescription: "Plateforme transparente d'aide humanitaire",

  contactEyebrow: "UN PROJET EN TÊTE ?",
  contactTitle: "Contactons-nous",
  contactDescription: "Je suis ouverte aux stages, aux collaborations et aux échanges intéressants. N'hésitez pas à me contacter !",
  country: "Maroc",
  contactNote: "Les bonnes idées construisent un avenir meilleur ♡",
  yourName: "Votre nom",
  yourEmail: "Votre adresse e-mail",
  yourMessage: "Votre message",
  sendMessage: "Envoyer le message →",
  formHelp: "Envoyez-moi un message directement depuis ce formulaire. ♡",

  footerTagline: "Les bonnes idées construisent un avenir meilleur ♡",
  footerRights: "Tous droits réservés.",
  footerHome: "Accueil",
  footerAbout: "À propos",
  footerSkills: "Compétences",

  footerProjects: "Projets",
  footerContact: "Contact"
},

   
ar: {
  home: "الرئيسية",
  about: "من أنا",
  skills: "المهارات",
  languages: "اللغات",
  projects: "المشاريع",
  contact: "اتصل بي",
  connect: "تواصل معي ↗",

  welcome: "مرحباً بكم في موقعي",
  intro: "مرحباً، أنا",
  role: "مطورة واجهات أمامية مبتدئة",
  subtitle: "خريجة علوم الحاسوب | مبدعة | محبة للتعلم",
  heroDescription: "أحب تحويل الأفكار إلى تجارب رقمية جميلة ومفيدة. أبحث عن فرصة لتطوير مهاراتي واكتساب خبرة مهنية في تطوير الويب.",
  viewProjects: "شاهد مشاريعي →",
  cvEnglish: "السيرة الذاتية بالإنجليزية ↓",
  cvFrench: "السيرة الذاتية بالفرنسية ↓",

  aboutEyebrow: "تعرّفوا عليّ",
  aboutTitle: "من أنا",
  aboutHeading: "حلم، وتعلّم،<br>وإبداع",
  aboutParagraph: "أكملت أربع سنوات من دراسة علوم الحاسوب في جامعة نانجينغ للبريد والاتصالات (NJUPT) في الصين، من عام 2022 إلى عام 2026. أهتم بتطوير الويب والتصميم والتكنولوجيا. أبحث عن فرصة لتطبيق معارفي واكتساب خبرة مهنية ومواصلة التعلم والمساهمة في مشاريع واقعية.",

  education: "التعليم",
  educationValue: "علوم الحاسوب — جامعة NJUPT، الصين",
  location: "الموقع",
  locationValue: "المغرب",
  interests: "الاهتمامات",
  interestsValue: "تطوير الويب، التصميم، الحيوانات",

  skillsEyebrow: "أدواتي التقنية",
  skillsTitle: "مهاراتي",
  skillsDescription: "التقنيات التي تعلمتها واستخدمتها في مشاريعي.",
  frontend: "الواجهات الأمامية",
  backend: "الواجهات الخلفية",
  tools: "الأدوات",
  programming: "البرمجة",

  pageStructure: "هيكلة صفحات الويب",
  stylingLayouts: "التنسيق وتخطيطات الصفحات",
  interactiveWebsites: "مواقع ويب تفاعلية",
  uiComponents: "مكونات واجهة المستخدم",
  backendRuntime: "بيئة تشغيل JavaScript",
  backendFramework: "إطار عمل الواجهات الخلفية",
  relationalDatabase: "قاعدة بيانات علائقية",
  versionControl: "إدارة الإصدارات",
  codeEditor: "محرر الأكواد",
  programmingDescription: "البرمجة",

  languageEyebrow: "التواصل مع العالم",
  languageTitle: "لغاتي",
  languageDescription: "لغات تربطني بالأشخاص والثقافات والفرص.",
  arabic: "العربية",
  english: "الإنجليزية",
  french: "الفرنسية",
  chinese: "الصينية (الماندرين)",
  native: "اللغة الأم",
  fluent: "بطلاقة",
  basic: "مستوى أساسي",
  nativeDescription: "اللغة الأم",
  fluentDescription: "بطلاقة",
  basicDescription: "مستوى أساسي",

  projectsEyebrow: "بعض أعمالي",
  projectsTitle: "مشاريعي",
  viewGithub: "عرض GitHub ↗",
  flightDescription: "موقع لحجز الرحلات الجوية",
  memoryDescription: "لعبة ذاكرة تفاعلية",
  traceDescription: "منصة شفافة للمساعدات الإنسانية",

  contactEyebrow: "هل لديك مشروع؟",
  contactTitle: "لنتواصل",
  contactDescription: "أنا مهتمة بفرص التدريب والتعاون وتبادل الأفكار. لا تترددوا في التواصل معي!",
  country: "المغرب",
  contactNote: "الأفكار الجيدة تصنع مستقبلاً أفضل ♡",
  yourName: "اسمك",
  yourEmail: "بريدك الإلكتروني",
  yourMessage: "رسالتك",
  sendMessage: "إرسال الرسالة →",
  formHelp: "أرسل لي رسالة مباشرة عبر هذا النموذج. ♡",

  footerTagline: "الأفكار الجيدة تصنع مستقبلاً أفضل ♡",
  footerRights: "جميع الحقوق محفوظة.",
  footerHome: "الرئيسية",
  footerAbout: "من أنا",
  footerSkills: "المهارات",
  footerProjects: "المشاريع",
  programmingDescription: "البرمجة",
  footerContact: "اتصل بي"
}

  };

 
const translationTargets = [
    // Navigation
    [".nav-links a[href='#home']", "home"],
    [".nav-links a[href='#about']", "about"],
    [".nav-links a[href='#skills']", "skills"],
    [".nav-links a[href='#languages']", "languages"],
    [".nav-links a[href='#projects']", "projects"],
    [".nav-links a[href='#contact']", "contact"],
    [".nav-cta", "connect"],

    // Hero section
    [".hero .eyebrow", "welcome"],
    [".hero .intro", "intro"],
    [".hero h2", "role"],
    [".hero .hero-subtitle", "subtitle"],
    [".hero .hero-description", "heroDescription"],
    [".hero-actions a[href='#projects']", "viewProjects"],
    [".hero-actions a[href*='soukaina-cv EN.pdf']", "cvEnglish"],
    [".hero-actions a[href*='soukaina-cv FR.pdf']", "cvFrench"],

    // About section
    [".about-content .eyebrow", "aboutEyebrow"],
    [".about-content .section-title", "aboutTitle"],
    [".about-content h3", "aboutHeading"],
    [".about-description", "aboutParagraph"],

    // About details — use the actual HTML structure
    [".about-details .detail-item:nth-child(1) strong", "education"],
    [".about-details .detail-item:nth-child(1) small", "educationValue"],
    [".about-details .detail-item:nth-child(2) strong", "location"],
    [".about-details .detail-item:nth-child(2) small", "locationValue"],
    [".about-details .detail-item:nth-child(3) strong", "interests"],
    [".about-details .detail-item:nth-child(3) small", "interestsValue"],

    // Skills section
    [".skills .eyebrow", "skillsEyebrow"],
    [".skills .section-title", "skillsTitle"],
    [".skills .section-heading > p:last-child", "skillsDescription"],
    [".skill-tab[data-category='frontend']", "frontend"],
    [".skill-tab[data-category='backend']", "backend"],
    [".skill-tab[data-category='tools']", "tools"],
    [".skill-tab[data-category='other']", "programming"],

    // Individual skill descriptions

[".skill-card:nth-child(1) p", "pageStructure"],
[".skill-card:nth-child(2) p", "stylingLayouts"],
[".skill-card:nth-child(3) p", "interactiveWebsites"],
[".skill-card:nth-child(4) p", "uiComponents"],
[".skill-card:nth-child(5) p", "backendRuntime"],
[".skill-card:nth-child(6) p", "backendFramework"],
[".skill-card:nth-child(7) p", "relationalDatabase"],
[".skill-card:nth-child(8) p", "versionControl"],
[".skill-card:nth-child(9) p", "codeEditor"],
[".skill-card:nth-child(10) p", "programmingDescription"],
[".skill-card:nth-child(11) p", "programmingDescription"],
[".skill-card:nth-child(12) p", "programmingDescription"],


    // Languages section
    [".languages .eyebrow", "languageEyebrow"],
    [".languages .section-title", "languageTitle"],
    [".languages .section-heading > p:last-child", "languageDescription"],
    [".language-card:nth-child(1) h3", "arabic"],
    [".language-card:nth-child(2) h3", "english"],
    [".language-card:nth-child(3) h3", "french"],
    [".language-card:nth-child(4) h3", "chinese"],
    [".language-card:nth-child(1) p", "nativeDescription"],
    [".language-card:nth-child(2) p", "fluentDescription"],
    [".language-card:nth-child(3) p", "fluentDescription"],
    [".language-card:nth-child(4) p", "basicDescription"],

    // Projects section
    [".projects .projects-heading .eyebrow", "projectsEyebrow"],
    [".projects .section-title", "projectsTitle"],
    [".projects-heading .btn", "viewGithub"],
    [".project-card:nth-child(1) .project-info > p", "flightDescription"],
    [".project-card:nth-child(2) .project-info > p", "memoryDescription"],
    [".project-card:nth-child(3) .project-info > p", "traceDescription"],

    // Contact section
    [".contact-copy .eyebrow", "contactEyebrow"],
    [".contact-copy .section-title", "contactTitle"],
    [".contact-copy > p:not(.eyebrow):not(.contact-location):not(.contact-note)", "contactDescription"],
    [".contact-location", "country"],
    [".contact-note", "contactNote"],
    ["#contactName", "yourName", "placeholder"],
    ["#contactEmail", "yourEmail", "placeholder"],
    ["#contactMessage", "yourMessage", "placeholder"],
    ["#contactForm button[type='submit']", "sendMessage"],
    ["#formNote", "formHelp"],

    // Footer
    [".footer > p", "footerTagline"],
    [".footer nav a[href='#home']", "footerHome"],
    [".footer nav a[href='#about']", "footerAbout"],
    [".footer nav a[href='#skills']", "footerSkills"],
    [".footer nav a[href='#projects']", "footerProjects"],
    [".skill-card p", "programmingDescription"],
    [".footer nav a[href='#contact']", "footerContact"],
    [".footer > small", "footerRights"]
];


  function setWebsiteLanguage(language) {
    const dictionary = translations[language];
    if (!dictionary) return;

    translationTargets.forEach(([selector, key, attribute]) => {
      const element = document.querySelector(selector);
      if (!element || !dictionary[key]) return;

      if (attribute === "placeholder") {
        element.setAttribute("placeholder", dictionary[key]);
      } else {
        element.innerHTML = dictionary[key];
      }
    });

    languageButtons.forEach((button) => {
      const isActive = button.dataset.lang === language;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.body.classList.toggle("arabic-layout", language === "ar");

    try {
      localStorage.setItem("portfolioLanguage", language);
    } catch (error) {
      // Language switching still works if browser storage is unavailable.
    }
  }

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setWebsiteLanguage(button.dataset.lang);
    });
  });

  let savedLanguage = "en";
  try {
    savedLanguage = localStorage.getItem("portfolioLanguage") || "en";
  } catch (error) {
    // Use English if browser storage is unavailable.
  }

  setWebsiteLanguage(savedLanguage);

});
