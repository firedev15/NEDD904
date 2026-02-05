const jumpGoals = document.getElementById('jump-goals');

jumpGoals.addEventListener('click', () => {
  document.getElementById('goal-types').scrollIntoView({ behavior: 'smooth' });
});

const goalForm = document.getElementById('goal-form');
const goalList = document.getElementById('goal-list');
const summaryText = document.getElementById('summary-text');
const progressBar = document.getElementById('progress-bar');
const progressPie = document.getElementById('progress-pie');
const commentList = document.getElementById('comment-list');

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
  if (commentList) {
    commentList.innerHTML = '';
  }
  if (goals.length === 0) {
    goalList.innerHTML = '<p class="goal-card__meta">Add your first performance goal to get started.</p>';
    if (commentList) {
      commentList.innerHTML = '<p class="goal-card__meta">No comments yet.</p>';
    }
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

    if (commentList && goal.comment) {
      const item = document.createElement('div');
      item.className = 'comment-item';
      item.textContent = `Week ${goal.week}: ${goal.comment}`;
      commentList.appendChild(item);
    }
  });

  if (commentList && commentList.children.length === 0) {
    commentList.innerHTML = '<p class="goal-card__meta">No comments yet.</p>';
  }

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
