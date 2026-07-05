(function () {
  'use strict';

  const leaders = [
    {
      id: 'shafeeque',
      name: 'Mohammed Shafeeque',
      title: 'Co-Founder & Full Stack Developer',
      image: 'assets/img/team/team-1.jpg',
      bio: [
        'Mohammed Shafeeque is a visionary technologist and co-founder of Mehwar Technology, driving the company\'s technical excellence from the ground up. With deep expertise across the full software stack, he architects scalable solutions that power everything from mobile apps to enterprise platforms.',
        'His passion lies in turning complex business challenges into elegant, user-friendly digital products. Shafeeque leads development teams with a hands-on approach, ensuring every project meets the highest standards of code quality, performance, and security.',
        'Under his technical leadership, Mehwar Technology has delivered innovative solutions spanning cross-platform mobile development, cloud-native architectures, and intelligent automation systems that help clients stay ahead in a rapidly evolving digital landscape.'
      ],
      social: {
        twitter: 'https://x.com/shafeeqshazah',
        linkedin: 'https://in.linkedin.com/in/mohammed-shafeeque-870765195',
        instagram: 'https://www.instagram.com/mohammed_shafeeq_ue/',
        website: 'http://mohammed-shafeeque-ishwaramangala-d.vercel.app/'
      }
    },
    {
      id: 'raahil',
      name: 'Mohammed Raahil',
      title: 'Co-Founder & Chief Operating Officer (COO)',
      image: 'assets/img/team/team-2.jpeg',
      bio: [
        'Mohammed Raahil serves as Co-Founder and Chief Operating Officer, orchestrating Mehwar Technology\'s day-to-day operations with precision and strategic foresight. He ensures seamless coordination between teams, clients, and projects to deliver exceptional results on time, every time.',
        'With a strong background in business operations and client relations, Raahil bridges the gap between technical innovation and business value. He oversees project lifecycles, resource planning, and quality assurance processes that keep Mehwar Technology running at peak efficiency.',
        'His leadership philosophy centers on transparency, accountability, and building lasting partnerships. Raahil\'s operational expertise has been instrumental in scaling Mehwar Technology from a startup vision into a trusted technology partner for businesses across industries.'
      ],
      social: {
        facebook: 'https://www.facebook.com/share/14HxRjDvws7/',
        instagram: 'https://www.instagram.com/raahil_mhd',
        linkedin: 'https://www.linkedin.com/in/mohammed-raahil-a6063a253'
      }
    },
    {
      id: 'muhsin',
      name: 'Muhsin Shareef P.L',
      title: 'Co-Founder & Chief Product Officer (CPO)',
      image: 'assets/img/team/team-3.jpg',
      bio: [
        'Muhsin Shareef P.L is the Co-Founder and Chief Product Officer at Mehwar Technology, shaping the product vision and user experience across all digital offerings. He combines creative design thinking with deep market understanding to build products that users love and businesses rely on.',
        'From initial concept to final launch, Muhsin guides product strategy, UX/UI design, and feature prioritization. His eye for detail ensures every interface is intuitive, accessible, and aligned with modern design standards while serving real user needs.',
        'As CPO, Muhsin champions innovation and user-centric development, fostering a culture where great ideas are nurtured from prototype to production. His product leadership has been key to Mehwar Technology\'s reputation for delivering polished, market-ready solutions.'
      ],
      social: {
        instagram: 'https://www.instagram.com/_x_reef',
        linkedin: 'https://www.linkedin.com/in/muhammad-muhsin-shareef-p-l-062539253'
      }
    },
    {
      id: 'anwar',
      name: 'Muhammad Anwar A.K',
      title: 'Co-Founder & Chief Technology Officer (CTO)',
      image: 'assets/img/team/team-4.jpg',
      bio: [
        'Muhammad Anwar A.K is Co-Founder and Chief Technology Officer, leading Mehwar Technology\'s technology strategy and innovation roadmap. He specializes in emerging technologies including AI, robotics, IoT, and cloud infrastructure that define the future of digital transformation.',
        'With extensive experience in system architecture and R&D, Anwar drives the company\'s most ambitious technical initiatives — from intelligent automation platforms to cutting-edge vision systems and embedded solutions for industrial applications.',
        'As CTO, he mentors engineering teams, establishes technical standards, and ensures Mehwar Technology remains at the forefront of technological advancement. His forward-thinking approach empowers the company to tackle complex challenges with confidence and creativity.'
      ],
      social: {
        instagram: 'https://www.instagram.com/nwaranu89/',
        linkedin: 'https://www.linkedin.com/in/muhammad-anwar-ak'
      }
    }
  ];

  const profileEl = document.getElementById('leaderProfile');
  const listEl = document.getElementById('leaderList');
  if (!profileEl || !listEl) return;

  let activeIndex = 0;

  function renderProfile(index) {
    const leader = leaders[index];
    profileEl.classList.add('switching');
    setTimeout(() => {
      profileEl.innerHTML = `
        <div class="leader-top">
          <div class="leader-portrait-wrap">
            <div class="l-frame">
              <img src="${leader.image}" alt="${leader.name}">
            </div>
          </div>
          <div class="leader-info">
            <h2>${leader.name}</h2>
            <span class="title">${leader.title}</span>
          </div>
        </div>
        <div class="leader-bio">
          ${leader.bio.map(p => `<p>${p}</p>`).join('')}
        </div>
        <div class="leader-social">
          ${leader.social.linkedin ? `<a href="${leader.social.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>` : ''}
          ${leader.social.twitter ? `<a href="${leader.social.twitter}" target="_blank" rel="noopener" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>` : ''}
          ${leader.social.instagram ? `<a href="${leader.social.instagram}" target="_blank" rel="noopener" aria-label="Instagram"><i class="bi bi-instagram"></i></a>` : ''}
          ${leader.social.facebook ? `<a href="${leader.social.facebook}" target="_blank" rel="noopener" aria-label="Facebook"><i class="bi bi-facebook"></i></a>` : ''}
          ${leader.social.website ? `<a href="${leader.social.website}" target="_blank" rel="noopener" aria-label="Website"><i class="bi bi-globe"></i></a>` : ''}
        </div>
        <div class="leader-mobile-cta">
          <a href="index.html#contact" class="leader-contact-btn">Contact Us</a>
        </div>
      `;
      profileEl.classList.remove('switching');
    }, 200);
  }

  function renderList() {
    listEl.innerHTML = leaders.map((leader, i) => `
      <li class="leader-list-item${i === activeIndex ? ' active' : ''}" data-index="${i}" role="button" tabindex="0" aria-selected="${i === activeIndex}">
        <div class="leader-avatar">
          <img src="${leader.image}" alt="${leader.name}">
        </div>
        <div class="leader-list-text">
          <h4>${leader.name}</h4>
          <span>${leader.title}</span>
        </div>
      </li>
    `).join('');

    listEl.querySelectorAll('.leader-list-item').forEach(item => {
      const select = () => {
        activeIndex = parseInt(item.dataset.index, 10);
        listEl.querySelectorAll('.leader-list-item').forEach(el => {
          el.classList.toggle('active', el === item);
          el.setAttribute('aria-selected', el === item);
        });
        renderProfile(activeIndex);
      };
      item.addEventListener('click', select);
      item.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(); }
      });
    });
  }

  renderList();
  renderProfile(0);
})();
