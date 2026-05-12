export const pipelineStages = [
  {
    name: "Plan",
    description: "Create a task, define acceptance criteria, and open a branch for the change.",
    durationSeconds: 90,
    status: "ready"
  },
  {
    name: "Code",
    description: "Commit focused changes with tests so every pull request has a clear review path.",
    durationSeconds: 240,
    status: "ready"
  },
  {
    name: "Integrate",
    description: "Run linting, automated tests, and a production build in GitHub Actions.",
    durationSeconds: 180,
    status: "ready"
  },
  {
    name: "Deploy",
    description: "Publish the build artifact to GitHub Pages after the main branch is updated.",
    durationSeconds: 120,
    status: "pending"
  }
];

export function formatDuration(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
    throw new Error("Duration must be a non-negative number of seconds.");
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
}

export function getPipelineSummary(stages = pipelineStages) {
  const total = stages.length;
  const ready = stages.filter((stage) => stage.status === "ready").length;
  const percentage = total === 0 ? 0 : Math.round((ready / total) * 100);

  return {
    ready,
    total,
    percentage,
    label: `${ready}/${total} stages ready`
  };
}

export function getDeploymentMessage(branchName) {
  return branchName === "main"
    ? "Deployment enabled for main branch updates."
    : "Preview checks run here; deployment waits for main.";
}

function createStageCard(stage, index) {
  const card = document.createElement("article");
  card.className = "stage-card";

  const statusClass = stage.status === "ready" ? "ready" : "pending";

  card.innerHTML = `
    <div>
      <div class="stage-top">
        <span class="stage-number">${index + 1}</span>
        <span class="stage-state ${statusClass}">${stage.status}</span>
      </div>
      <h3>${stage.name}</h3>
      <p>${stage.description}</p>
    </div>
    <span class="stage-duration">${formatDuration(stage.durationSeconds)} expected</span>
  `;

  return card;
}

function renderPipeline() {
  const grid = document.querySelector("#pipeline-grid");
  const score = document.querySelector("#pipeline-score");
  const summary = document.querySelector("#pipeline-summary");
  const buildDate = document.querySelector("#build-date");

  if (!grid || !score || !summary || !buildDate) {
    return;
  }

  const pipelineSummary = getPipelineSummary();
  grid.replaceChildren(...pipelineStages.map(createStageCard));
  score.textContent = `${pipelineSummary.percentage}% ready`;
  summary.textContent = `${pipelineSummary.label}. ${getDeploymentMessage("main")}`;
  buildDate.textContent = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date());
}

if (typeof document !== "undefined") {
  renderPipeline();
}
