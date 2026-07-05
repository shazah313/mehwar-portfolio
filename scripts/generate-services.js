const fs = require('fs');
const path = require('path');

const services = [
  { file: 'appdevelopment.html', title: 'Mobile App Development', accent: '#ffbb2c', lottie: 'https://assets10.lottiefiles.com/packages/lf20_udpiwbbr.json', custom: true, tagline: "Building Tomorrow's Mobile Experiences Today", intro: 'At Mehwar Technology, we craft cutting-edge mobile applications that transform ideas into powerful digital experiences. From native iOS and Android to cross-platform Flutter and React Native, we deliver apps users love and businesses rely on.', features: [['Stunning UI/UX','Beautiful, intuitive interfaces crafted pixel-by-pixel for seamless user journeys across every screen size.'],['Native Performance','Lightning-fast apps with smooth animations, offline support, and instant responses on iOS and Android.'],['Cross-Platform','Reach every user with a single codebase — Flutter and React Native for maximum reach, minimum cost.'],['Secure & Reliable','Enterprise-grade encryption, secure APIs, biometric auth, and compliance-ready architecture.'],['Push & Real-Time','Intelligent notifications, live updates, and WebSocket integration to keep users engaged.'],['Analytics Built-In','Understand behavior with integrated analytics, crash reporting, and actionable insights.']], steps: [['Discovery','We map your goals, users, and market to define a winning mobile strategy.'],['Design','Interactive prototypes and polished UI designs validated before a single line of code.'],['Development','Agile sprints with clean architecture, automated testing, and continuous delivery.'],['Launch & Scale','App store deployment, monitoring, updates, and growth optimization.']] },
  { file: 'web-design.html', title: 'Web Application Design', accent: '#5578ff', lottie: 'https://assets9.lottiefiles.com/packages/lf20_w51pcehl.json', tagline: 'Stunning Web Experiences That Convert & Perform', intro: 'We design and build modern web applications that captivate audiences and drive business results. From responsive landing pages to complex SaaS platforms, every interface is engineered for speed, accessibility, and scale.', features: [['Responsive Design','Flawless experiences on desktop, tablet, and mobile with mobile-first responsive architecture.'],['Modern Frameworks','React, Next.js, Vue, and Node.js — we pick the right stack for your vision and scale.'],['UI/UX Excellence','User research, wireframes, and polished interfaces that reduce friction and boost conversions.'],['SEO & Performance','Core Web Vitals optimization, semantic HTML, and blazing load times out of the box.'],['CMS Integration','Headless CMS, admin dashboards, and content workflows your team can manage easily.'],['Accessibility','WCAG-compliant designs ensuring your platform is usable by everyone.']], steps: [['Research','User personas, competitor analysis, and information architecture planning.'],['Wireframe & Design','High-fidelity mockups with design systems for consistent brand expression.'],['Development','Component-driven frontends with scalable backend APIs and databases.'],['Deploy & Optimize','CDN deployment, monitoring, A/B testing, and continuous improvement.']] },
  { file: 'robotics-automation.html', title: 'Robotics & Automation', accent: '#e80368', lottie: 'https://assets3.lottiefiles.com/packages/lf20_4kx2q32n.json', custom: true, tagline: 'Intelligent Machines That Work Smarter, Not Harder', intro: 'Mehwar Technology pioneers robotics and automation solutions for industries, education, and research. We integrate hardware, embedded software, and AI to build autonomous systems that solve real-world challenges with precision.', features: [['Autonomous Navigation','SLAM, path planning, and sensor fusion for robots that navigate complex environments.'],['Industrial Automation','PLC integration, conveyor systems, and robotic arms for manufacturing efficiency.'],['Embedded Control','Real-time firmware on ARM, ESP32, and Raspberry Pi for reliable edge computing.'],['Computer Vision','Object detection, tracking, and quality inspection powered by deep learning models.'],['Educational Robotics','STEM kits, programmable platforms, and curriculum-ready robotics for learning.'],['Custom R&D','Bespoke robotic systems designed from concept to prototype to production.']], steps: [['Problem Analysis','Site assessment, requirements engineering, and feasibility studies.'],['System Design','Mechanical, electrical, and software architecture in unified planning.'],['Prototyping','Rapid iteration with 3D printing, simulation, and field testing.'],['Deployment','Installation, calibration, training, and ongoing maintenance support.']] },
  { file: 'custom-software.html', title: 'Custom Software Solutions', accent: '#e361ff', lottie: 'https://assets3.lottiefiles.com/packages/lf20_fcfjwiyb.json', tagline: 'Tailored Software Built Around Your Business', intro: 'Off-the-shelf software rarely fits perfectly. We build custom solutions — ERP systems, admin dashboards, workflow engines, and enterprise platforms — designed precisely for your operations, users, and growth trajectory.', features: [['Business Logic','Custom workflows, approval chains, and rules engines matching your processes.'],['Scalable Architecture','Microservices, modular monoliths, and cloud-native designs that grow with you.'],['Legacy Modernization','Migrate aging systems to modern stacks without disrupting operations.'],['Integration Hub','Connect CRM, ERP, payment gateways, and third-party tools seamlessly.'],['Admin Dashboards','Real-time analytics, role-based access, and intuitive management consoles.'],['Dedicated Support','Long-term partnership with maintenance, updates, and feature evolution.']], steps: [['Consultation','Deep dive into your business processes, pain points, and objectives.'],['Blueprint','Technical specification, architecture diagrams, and project roadmap.'],['Build','Iterative development with weekly demos and transparent progress tracking.'],['Deliver','Deployment, documentation, training, and post-launch support.']] },
  { file: 'secure-architecture.html', title: 'Secure Architecture', accent: '#47aeff', lottie: 'https://assets9.lottiefiles.com/packages/lf20_glp7w7on.json', custom: true, tagline: 'Fortress-Grade Security for Your Digital Assets', intro: 'Security is not an afterthought — it is the foundation. We architect systems with defense-in-depth strategies, zero-trust principles, and industry compliance standards to protect your data, users, and reputation.', features: [['Zero Trust Design','Identity verification, least-privilege access, and encrypted communications everywhere.'],['Penetration Testing','Proactive vulnerability assessments and remediation before attackers find flaws.'],['Compliance Ready','GDPR, HIPAA, SOC 2, and industry-specific regulatory alignment.'],['Encryption Everywhere','AES-256 at rest, TLS 1.3 in transit, and secure key management practices.'],['Threat Monitoring','SIEM integration, anomaly detection, and 24/7 incident response readiness.'],['Secure SDLC','Code reviews, dependency scanning, and security gates in every release pipeline.']], steps: [['Audit','Security assessment of existing systems, policies, and threat landscape.'],['Architecture','Design secure infrastructure with layered defenses and failover plans.'],['Hardening','Implementation of firewalls, WAF, IAM, and encryption standards.'],['Monitor','Continuous security monitoring, patching, and incident response drills.']] },
  { file: 'performance-optimization.html', title: 'Performance Optimization', accent: '#ffa76e', lottie: 'https://assets3.lottiefiles.com/packages/lf20_xlmz9xky.json', custom: true, tagline: 'Speed That Keeps Users Engaged & Revenue Growing', intro: 'Slow software loses users and revenue. We diagnose bottlenecks and optimize every layer — frontend rendering, API response times, database queries, and infrastructure — to deliver sub-second experiences at any scale.', features: [['Frontend Optimization','Code splitting, lazy loading, image optimization, and render performance tuning.'],['Backend Tuning','Query optimization, caching strategies, and async processing pipelines.'],['CDN & Edge','Global content delivery, edge computing, and geographic load balancing.'],['Load Testing','Stress tests simulating millions of users to find breaking points before launch.'],['Database Scaling','Indexing, sharding, read replicas, and query plan optimization.'],['Monitoring','Real-time APM, alerting, and performance dashboards for proactive fixes.']], steps: [['Profile','Benchmark current performance and identify critical bottlenecks.'],['Analyze','Deep dive into code, queries, network, and infrastructure metrics.'],['Optimize','Targeted fixes with measurable before/after performance gains.'],['Validate','Continuous monitoring and regression testing to maintain speed.']] },
  { file: 'business-intelligence.html', title: 'Business Intelligence', accent: '#11dbcf', lottie: 'https://assets5.lottiefiles.com/packages/lf20_qp1spzqv.json', tagline: 'Turn Data Into Decisions That Drive Growth', intro: 'Raw data is useless without insight. We build business intelligence solutions — interactive dashboards, automated reports, and predictive analytics — that empower leaders to make confident, data-driven decisions.', features: [['Live Dashboards','Real-time KPI tracking with drill-down capabilities and custom visualizations.'],['ETL Pipelines','Automated data extraction, transformation, and loading from any source.'],['Predictive Analytics','Machine learning models forecasting trends, demand, and risks.'],['Self-Service BI','Empower teams to explore data without depending on IT for every report.'],['Multi-Source Integration','Unify data from CRM, ERP, web analytics, and IoT sensors.'],['Executive Reporting','Automated PDF/email reports delivered on your schedule.']], steps: [['Data Audit','Inventory data sources, quality assessment, and KPI definition.'],['Model','Design data warehouse schema and ETL architecture.'],['Visualize','Build interactive dashboards tailored to each stakeholder role.'],['Evolve','Iterate with new data sources, metrics, and predictive models.']] },
  { file: 'ai-vision.html', title: 'AI & Vision Systems', accent: '#4233ff', lottie: 'https://assets1.lottiefiles.com/packages/lf20_1pxqjqps.json', tagline: 'Machines That See, Understand & Act Intelligently', intro: 'We develop AI and computer vision systems that perceive the world like humans — recognizing faces, detecting defects, reading documents, and making intelligent decisions in real time for security, manufacturing, and beyond.', features: [['Object Detection','YOLO, SSD, and custom CNN models for real-time object recognition.'],['Facial Recognition','Secure identity verification with liveness detection and privacy controls.'],['OCR & Document AI','Automated text extraction, form processing, and intelligent document routing.'],['Video Analytics','Surveillance intelligence, crowd analysis, and anomaly detection.'],['Edge AI','On-device inference for low-latency vision without cloud dependency.'],['Custom Model Training','Fine-tuned models on your proprietary datasets for domain-specific accuracy.']], steps: [['Use Case Definition','Identify vision tasks, accuracy requirements, and deployment constraints.'],['Data Pipeline','Collection, labeling, augmentation, and quality assurance of training data.'],['Model Development','Train, validate, and optimize models for production performance.'],['Deploy','Edge or cloud deployment with monitoring and continuous learning loops.']] },
  { file: 'iot-embedded.html', title: 'IoT & Embedded Systems', accent: '#b2904f', lottie: 'https://assets8.lottiefiles.com/packages/lf20_jcikwtux.json', tagline: 'Connected Devices That Bridge Physical & Digital Worlds', intro: 'From smart sensors to industrial IoT gateways, we build embedded systems that collect data, communicate reliably, and enable intelligent automation across homes, factories, agriculture, and cities.', features: [['Sensor Networks','Temperature, motion, GPS, and custom sensor integration with low-power design.'],['MQTT & LoRaWAN','Reliable protocols for long-range, low-bandwidth IoT communication.'],['Firmware Development','RTOS, bare-metal, and Linux embedded programming for ARM and ESP platforms.'],['Cloud Connectivity','AWS IoT, Azure IoT Hub, and custom backends for device management.'],['OTA Updates','Secure over-the-air firmware updates for deployed device fleets.'],['Edge Processing','Local data filtering and decision-making to reduce bandwidth and latency.']], steps: [['Hardware Selection','Component sourcing, PCB design review, and prototyping.'],['Firmware','RTOS development, driver integration, and power optimization.'],['Connectivity','Protocol implementation, cloud pairing, and security hardening.'],['Fleet Management','Deployment tools, monitoring dashboards, and maintenance workflows.']] },
  { file: 'api-integration.html', title: 'API Integration', accent: '#b20969', lottie: 'https://assets2.lottiefiles.com/packages/lf20_myejiggj.json', tagline: 'Seamless Connections Between Your Systems & the World', intro: 'Modern businesses run on connected systems. We design, build, and integrate RESTful APIs, GraphQL endpoints, and webhook architectures that unify your software ecosystem and enable powerful third-party integrations.', features: [['REST & GraphQL','Clean, documented APIs with versioning, pagination, and rate limiting.'],['Third-Party Integration','Payment gateways, CRM, ERP, social media, and SaaS tool connections.'],['Webhook Systems','Real-time event-driven architectures for instant data synchronization.'],['API Gateway','Centralized auth, throttling, logging, and routing for microservices.'],['Documentation','Interactive Swagger/OpenAPI docs and developer portals.'],['Middleware','Data transformation, protocol bridging, and legacy system adapters.']], steps: [['Map','Catalog existing systems, data flows, and integration requirements.'],['Design','API contracts, authentication strategy, and error handling standards.'],['Build','Development with automated testing and staging environments.'],['Connect','Production deployment, monitoring, and developer onboarding.']] },
  { file: 'cloud-deployment.html', title: 'Cloud Deployment', accent: '#ff5828', lottie: 'https://assets6.lottiefiles.com/packages/lf20_zrqdnbpg.json', tagline: 'Scale Infinitely with Confidence in the Cloud', intro: 'We architect and deploy cloud-native solutions on AWS, Azure, and Google Cloud — with containerization, auto-scaling, CI/CD pipelines, and infrastructure-as-code that ensures reliability, security, and cost efficiency.', features: [['AWS / Azure / GCP','Multi-cloud expertise with vendor-agnostic architecture recommendations.'],['Kubernetes & Docker','Container orchestration for portable, scalable application deployment.'],['CI/CD Pipelines','Automated build, test, and deploy workflows with GitHub Actions and Jenkins.'],['Infrastructure as Code','Terraform and CloudFormation for reproducible, version-controlled infra.'],['Auto-Scaling','Dynamic resource allocation that handles traffic spikes without over-provisioning.'],['Disaster Recovery','Multi-region backups, failover strategies, and 99.9% uptime SLAs.']], steps: [['Assessment','Current infrastructure audit and cloud migration strategy.'],['Architecture','Design cloud-native architecture with security and cost optimization.'],['Migrate','Phased migration with zero-downtime deployment strategies.'],['Operate','Monitoring, cost management, and continuous infrastructure improvement.']] },
  { file: 'rd-innovation.html', title: 'R&D and Innovation', accent: '#29cc61', lottie: 'https://assets9.lottiefiles.com/packages/lf20_touohxv0.json', tagline: "Pioneering Tomorrow's Breakthroughs Today", intro: 'Innovation is in our DNA. Our R&D division explores emerging technologies — AI, quantum-ready algorithms, novel interfaces, and experimental hardware — to keep Mehwar Technology and our clients at the cutting edge.', features: [['Proof of Concept','Rapid prototypes validating technical feasibility in weeks, not months.'],['Emerging Tech','Exploration of AI, blockchain, AR/VR, and next-gen computing paradigms.'],['Innovation Labs','Dedicated sandbox environments for experimentation without risk.'],['Patent Support','Documentation and technical reports supporting IP protection.'],['Academic Partnerships','Collaboration with universities and research institutions.'],['Future Roadmapping','Technology trend analysis and strategic innovation planning for clients.']], steps: [['Ideate','Brainstorm sessions, trend research, and opportunity identification.'],['Prototype','Build MVPs and technical proofs to validate assumptions.'],['Validate','User testing, performance benchmarks, and market fit analysis.'],['Commercialize','Transition successful innovations into production-ready products.']] }
];

const icons = ['⚡', '🎯', '🔧', '🛡️', '📊', '🚀'];
const root = path.join(__dirname, '..');

function page(s) {
  const featuresHtml = s.features.map(([h, p], i) => `
    <div class="feature-card" data-aos="fade-up" data-aos-delay="${100 + i * 50}">
      <span class="icon">${icons[i]}</span>
      <h3>${h}</h3>
      <p>${p}</p>
    </div>`).join('');

  const stepsHtml = s.steps.map(([h, p], i) => `
    <div class="process-step" data-step="${i + 1}" data-aos="fade-left" data-aos-delay="${i * 100}">
      <div><h4>${h}</h4><p>${p}</p></div>
    </div>`).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${s.title} - Mehwar Technology</title>
  <meta name="description" content="${s.intro.substring(0, 155)}...">
  <link rel="icon" type="image/x-icon" href="assets/img/favicon.ico">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/vendor/aos/aos.css" rel="stylesheet">
  <link href="assets/css/service-pages.css" rel="stylesheet">
  <link href="assets/css/smooth-scroll.css" rel="stylesheet">
  <link href="assets/css/mobile-responsive.css" rel="stylesheet">
  <script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>
  <style>:root { --sp-accent: ${s.accent}; }</style>
</head>
<body class="service-page">
  <div class="service-bg"><div class="orb orb-1"></div><div class="orb orb-2"></div></div>

  <nav class="service-nav">
    <a href="index.html" class="brand"><img src="assets/img/favicon.ico" alt=""> Mehwar Technology</a>
    <a href="index.html#features" class="back-btn">← All Services</a>
  </nav>

  <section class="service-hero">
    <lottie-player src="${s.lottie}" background="transparent" speed="1" loop autoplay></lottie-player>
    <h1>${s.title}</h1>
    <p class="tagline">${s.tagline}</p>
    <div class="scroll-hint"><i class="bi bi-chevron-down"></i></div>
  </section>

  <div class="service-wrap">
    <div class="glass-card" data-aos="fade-up">
      <h2 class="section-title">Why Choose Us</h2>
      <p>${s.intro}</p>
      <div class="features-grid">${featuresHtml}</div>
    </div>

    <div class="anim-strip" data-aos="zoom-in">
      <lottie-player src="${s.lottie}" background="transparent" speed="0.8" loop autoplay style="width:min(400px,90vw);height:220px;"></lottie-player>
    </div>

    <div class="glass-card" data-aos="fade-up">
      <h2 class="section-title">Our Process</h2>
      <div class="process-steps">${stepsHtml}</div>
    </div>

    <div class="cta-block" data-aos="fade-up">
      <h2>Ready to Get Started?</h2>
      <p>Let's build something extraordinary together. Contact Mehwar Technology today.</p>
      <a href="index.html#contact" class="cta-btn">Start Your Project</a>
    </div>
  </div>

  <script src="assets/vendor/aos/aos.js"></script>
  <script src="https://unpkg.com/lenis@1.1.18/dist/lenis.min.js"></script>
  <script src="assets/js/smooth-scroll.js"></script>
  <script src="assets/js/service-pages.js"></script>
</body>
</html>`;
}

services.forEach(s => {
  if (s.custom) return;
  fs.writeFileSync(path.join(root, s.file), page(s), 'utf8');
});
console.log('Created', services.length, 'service pages');
