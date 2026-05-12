import assert from "node:assert/strict";
import test from "node:test";

import {
  formatDuration,
  getDeploymentMessage,
  getPipelineSummary,
  pipelineStages
} from "../src/app.js";

test("pipeline has the expected starter stages", () => {
  assert.deepEqual(
    pipelineStages.map((stage) => stage.name),
    ["Plan", "Code", "Integrate", "Deploy"]
  );
});

test("pipeline summary counts ready stages and percentage", () => {
  const summary = getPipelineSummary([
    { status: "ready" },
    { status: "pending" },
    { status: "ready" },
    { status: "ready" }
  ]);

  assert.equal(summary.ready, 3);
  assert.equal(summary.total, 4);
  assert.equal(summary.percentage, 75);
  assert.equal(summary.label, "3/4 stages ready");
});

test("duration formatter returns readable values", () => {
  assert.equal(formatDuration(45), "45s");
  assert.equal(formatDuration(90), "1m 30s");
  assert.equal(formatDuration(3660), "1h 1m");
});

test("deployment message is branch-aware", () => {
  assert.equal(getDeploymentMessage("main"), "Deployment enabled for main branch updates.");
  assert.equal(getDeploymentMessage("feature/login"), "Preview checks run here; deployment waits for main.");
});
