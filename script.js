const timelineData = {
  1: {
    stage: 'Demonstration',
    title: 'Week 1 · Co-construct the learning goal',
    text: 'Teacher and students co-construct a learning goal while the teacher explains why goal setting matters.',
  },
  2: {
    stage: 'Guided Application',
    title: 'Week 2 · Set performance goals together',
    text: 'Teacher guides students to set weekly performance goals and monitors achievement.',
  },
  3: {
    stage: 'Guided Application',
    title: 'Week 3 · Practice tracking progress',
    text: 'Teacher continues to support goal setting and checks progress with students.',
  },
  4: {
    stage: 'Guided Application',
    title: 'Week 4 · Build confidence',
    text: 'Teacher and students refine performance goals and reflect on evidence of progress.',
  },
  5: {
    stage: 'Fading Support',
    title: 'Week 5 · Students set performance goals',
    text: 'Students set their weekly goals; teacher monitors achievement and gives lighter feedback.',
  },
  6: {
    stage: 'Fading Support',
    title: 'Week 6 · Student ownership grows',
    text: 'Students set and monitor goals with check-ins focused on autonomy.',
  },
  7: {
    stage: 'Fading Support',
    title: 'Week 7 · Independent monitoring',
    text: 'Students independently set and monitor performance goals.',
  },
  8: {
    stage: 'Fading Support',
    title: 'Week 8 · Sustain routines',
    text: 'Students keep goal routines consistent with minimal teacher input.',
  },
  9: {
    stage: 'Fading Support',
    title: 'Week 9 · Prepare for evaluation',
    text: 'Students evaluate their own progress and plan final adjustments.',
  },
  10: {
    stage: 'Evaluation',
    title: 'Week 10 · Evaluate the learning goal',
    text: 'Students and teacher evaluate achievement of the learning goal and reflect on outcomes.',
  },
};

const mappingData = {
  'self-eval': {
    title: 'Goals of Self‑Evaluation of Progress',
    text: 'Students monitor and evaluate achievement of both learning and performance goals.',
    cite: 'Schunk & Ertmer, 1999',
  },
  'self-efficacy': {
    title: 'Self‑efficacy',
    text: 'Learning goals support increases in self‑efficacy for learning.',
    cite: 'Schunk, 2012',
  },
  social: {
    title: 'Social comparisons',
    text: 'Students are motivated when they observe peers achieving identical goals (Wishful Identification).',
    cite: 'Schunk & Usher, 2019 · Lim et al., 2020',
  },
  values: {
    title: 'Values',
    text: 'Highlighting the importance of goals and visualizing the link from performance goals to the final learning goal supports values.',
    cite: 'Bandura, 1986',
  },
  outcome: {
    title: 'Outcome Expectation',
    text: 'Performance goals are key stepping stones for learning goals, such as weekly reading supporting final assignments.',
    cite: 'Bandura, 1986',
  },
  attributions: {
    title: 'Attributions',
    text: 'Reviewing goals shows students they are responsible for their learning outcomes.',
    cite: 'Schunk & Usher, 2019',
  },
};

const panel = document.getElementById('timeline-panel');
const steps = document.querySelectorAll('.step');

function renderWeek(week) {
  const data = timelineData[week];
  if (!data) return;

  panel.innerHTML = `
    <div class="chip">${data.stage}</div>
    <h3>${data.title}</h3>
    <p>${data.text}</p>
  `;

  steps.forEach((step) => {
    step.classList.toggle('is-active', step.dataset.week === String(week));
  });
}

steps.forEach((step) => {
  step.addEventListener('click', () => renderWeek(step.dataset.week));
});

renderWeek(1);

const jumpTimeline = document.getElementById('jump-timeline');
const jumpGoals = document.getElementById('jump-goals');
const jumpJustifications = document.getElementById('jump-justifications');

jumpTimeline.addEventListener('click', () => {
  document.getElementById('timeline').scrollIntoView({ behavior: 'smooth' });
});

jumpGoals.addEventListener('click', () => {
  document.getElementById('goal-types').scrollIntoView({ behavior: 'smooth' });
});

if (jumpJustifications) {
  jumpJustifications.addEventListener('click', () => {
    document.getElementById('justifications').scrollIntoView({ behavior: 'smooth' });
  });
}

const mappingPanel = document.getElementById('mapping-panel');
const mappingItems = document.querySelectorAll('.mapping__item');

function renderMapping(key) {
  const data = mappingData[key];
  if (!data) return;
  mappingPanel.innerHTML = `
    <h3>${data.title}</h3>
    <p>${data.text}</p>
    <span class="cite">${data.cite}</span>
  `;

  mappingItems.forEach((item) => {
    item.classList.toggle('is-active', item.dataset.just === key);
  });
}

mappingItems.forEach((item) => {
  item.addEventListener('click', () => renderMapping(item.dataset.just));
});

renderMapping('self-eval');

const goalForm = document.getElementById('goal-form');
const goalList = document.getElementById('goal-list');
const summaryText = document.getElementById('summary-text');
const progressBar = document.getElementById('progress-bar');
const progressPie = document.getElementById('progress-pie');

const storageKey = 'scaffolded-goal-tracker';

function loadGoals() {
  const raw = localStorage.getItem(storageKey);
  return raw ? JSON.parse(raw) : [];
}

function saveGoals(goals) {
  localStorage.setItem(storageKey, JSON.stringify(goals));
}

function updateSummary(goals) {
  if (goals.length === 0) {
    summaryText.textContent = 'No goals tracked yet.';
    progressBar.style.width = '0%';
    if (progressPie) {
      progressPie.style.background = 'conic-gradient(var(--accent) 0deg, var(--accent) 0deg, #efe9e1 0deg)';
    }
    return;
  }

  const completed = goals.filter((goal) => goal.completed).length;
  const percentage = Math.round((completed / goals.length) * 100);
  summaryText.textContent = `${completed} of ${goals.length} performance goals completed (${percentage}%).`;
  progressBar.style.width = `${percentage}%`;
  if (progressPie) {
    const degrees = Math.round((percentage / 100) * 360);
    progressPie.style.background = `conic-gradient(var(--accent) 0deg, var(--accent) ${degrees}deg, #efe9e1 ${degrees}deg)`;
  }
}

function renderGoals() {
  const goals = loadGoals();
  goalList.innerHTML = '';
  if (goals.length === 0) {
    goalList.innerHTML = '<p class="goal-card__meta">Add your first performance goal to get started.</p>';
    updateSummary(goals);
    return;
  }

  goals.forEach((goal) => {
    const card = document.createElement('div');
    card.className = 'goal-card';
    card.innerHTML = `
      <div class="goal-card__header">
        <span>Week ${goal.week}</span>
        <span class="goal-card__meta">${goal.completed ? 'Completed' : 'In progress'}</span>
      </div>
      <div>
        <strong>Learning goal:</strong> ${goal.learning}
      </div>
      <div>
        <strong>Performance goal:</strong> ${goal.performance}
      </div>
      ${goal.comment ? `<div class="goal-card__comment">Comment: ${goal.comment}</div>` : ''}
      <div class="goal-card__actions">
        <button class="btn btn--ghost btn--small" data-action="toggle" data-id="${goal.id}">
          ${goal.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button class="btn btn--danger btn--small" data-action="delete" data-id="${goal.id}">Remove</button>
      </div>
    `;
    goalList.appendChild(card);
  });

  updateSummary(goals);
}

function addGoal(event) {
  event.preventDefault();
  const formData = new FormData(goalForm);
  const learning = formData.get('learning-goal').trim();
  const performance = formData.get('performance-goal').trim();
  const comment = (formData.get('goal-comment') || '').trim();
  const week = formData.get('week');

  if (!learning || !performance) return;

  const goals = loadGoals();
  goals.unshift({
    id: Date.now().toString(),
    learning,
    performance,
    week,
    comment,
    completed: false,
  });
  saveGoals(goals);
  goalForm.reset();
  renderGoals();
}

function handleGoalAction(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const { action, id } = button.dataset;
  const goals = loadGoals();
  const index = goals.findIndex((goal) => goal.id === id);
  if (index === -1) return;

  if (action === 'toggle') {
    goals[index].completed = !goals[index].completed;
  }

  if (action === 'delete') {
    goals.splice(index, 1);
  }

  saveGoals(goals);
  renderGoals();
}

if (goalForm) {
  goalForm.addEventListener('submit', addGoal);
  goalList.addEventListener('click', handleGoalAction);
  renderGoals();
}
