const pages = ['home', 'portfolio'];
const headings = { home: 'home-heading', portfolio: 'portfolio-heading' };
const views = { home: document.getElementById('home-view'), portfolio: document.getElementById('portfolio-view') };
function renderPage(focusHeading = false) {
  const requested = location.hash.slice(1);
  const page = pages.includes(requested) ? requested : 'home';
  for (const name of pages) views[name].hidden = name !== page;
  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.title = page === 'portfolio' ? 'Portfolio | Thomas Connell' : 'Thomas Connell | Portfolio';
  if (focusHeading && requested !== 'main') {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.getElementById(headings[page]).focus({ preventScroll: true });
  }
}
renderPage();
window.addEventListener('hashchange', () => renderPage(true));
document.getElementById('year').textContent = new Date().getFullYear();
const projects = {
  username: {
    category: 'User research & interface design',
    title: 'Username Creator and Checker',
    description: 'I interviewed three participants and watched them try existing username checker websites. Their feedback helped me plan a simpler layout: one search bar, related name ideas, and clear availability results.',
    role: 'Individual course project',
    methods: 'Interviews, contextual inquiry, website comparison',
    note: 'Research and design stage. The illustration uses example results.'
  },
  paths: {
    category: 'Community based design',
    title: 'Paths after Information Science',
    description: 'Our team is exploring how to help Information Science students understand which jobs, internships, and graduate programs could fit them. It’s a question I relate to as a student with a lot of possible paths ahead.',
    role: 'Team project with Michael Chow and Max Matys-Gleason',
    methods: 'Community conversations and project development',
    note: 'In progress · Community Based Design at CU Boulder.'
  }
};
const dialog = document.getElementById('project-dialog');
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
  const project = projects[button.dataset.project];
  document.getElementById('dialog-category').textContent = project.category;
  document.getElementById('dialog-title').textContent = project.title;
  document.getElementById('dialog-description').textContent = project.description;
  document.getElementById('dialog-note').textContent = project.note;
  const details = document.getElementById('dialog-details');
  details.replaceChildren();
  for (const [heading, text] of [['My role', project.role], ['Approach', project.methods]]) {
    const section = document.createElement('div');
    const title = document.createElement('h3');
    const value = document.createElement('p');
    title.textContent = heading;
    value.textContent = text;
    section.append(title, value);
    details.append(section);
  }
  dialog.showModal();
}));
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  const bounds = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) dialog.close();
});
