import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { WorkflowStep } from "./demo-data.ts";

type WorkflowChangeProposal = {
  id: string;
  jobId: string;
  kind: "add-step" | "remove-step";
  status: "pending" | "approved" | "rejected-in-discussion";
  stepLabel: string;
  stepId?: string;
  targetStepId?: string;
  targetStepLabel?: string;
};

function applyProposalsToSteps(
  jobId: string,
  baseSteps: WorkflowStep[],
  proposals: WorkflowChangeProposal[],
) {
  const jobProposals = proposals.filter((p) => p.jobId === jobId);
  let steps = baseSteps.map((s) => ({ ...s }));
  for (const p of jobProposals) {
    if (p.status !== "approved" || p.kind !== "remove-step" || !p.targetStepId) continue;
    steps = steps.filter((s) => s.id !== p.targetStepId);
  }
  for (const p of jobProposals) {
    if (p.status !== "approved" || p.kind !== "add-step") continue;
    const id = p.stepId ?? `approved-${p.id}`;
    if (steps.some((s) => s.id === id)) continue;
    steps.push({
      id,
      label: p.stepLabel,
      kind: "added",
      done: false,
    });
  }
  const items: { type: string; step?: WorkflowStep; pendingRemoval?: boolean }[] = [];
  for (const step of steps) {
    const pendingRemove = jobProposals.find(
      (p) =>
        p.status === "pending" &&
        p.kind === "remove-step" &&
        p.targetStepId === step.id,
    );
    items.push({ type: "step", step, pendingRemoval: Boolean(pendingRemove) });
  }
  const pendingAdds = jobProposals.filter((p) => p.status === "pending" && p.kind === "add-step");
  for (let i = 0; i < pendingAdds.length; i++) {
    items.push({ type: "pending-add" });
  }
  return items;
}

const base: WorkflowStep[] = [
  { id: "a", label: "Step A", kind: "minimum", done: false },
  { id: "b", label: "Step B", kind: "added", done: false },
];

describe("applyProposalsToSteps", () => {
  it("shows pending add as pending-add item", () => {
    const proposals: WorkflowChangeProposal[] = [
      {
        id: "p1",
        jobId: "j1",
        kind: "add-step",
        status: "pending",
        stepLabel: "QA review",
      },
    ];
    const items = applyProposalsToSteps("j1", base, proposals);
    assert.ok(items.some((i) => i.type === "pending-add"));
    assert.equal(items.filter((i) => i.type === "step").length, 2);
  });

  it("marks pending removal on existing step", () => {
    const proposals: WorkflowChangeProposal[] = [
      {
        id: "p2",
        jobId: "j1",
        kind: "remove-step",
        status: "pending",
        stepLabel: "",
        targetStepId: "b",
        targetStepLabel: "Step B",
      },
    ];
    const items = applyProposalsToSteps("j1", base, proposals);
    const stepB = items.find((i) => i.type === "step" && i.step?.id === "b");
    assert.ok(stepB?.pendingRemoval);
  });

  it("applies approved add and remove", () => {
    const proposals: WorkflowChangeProposal[] = [
      {
        id: "p3",
        jobId: "j1",
        kind: "remove-step",
        status: "approved",
        stepLabel: "",
        targetStepId: "b",
      },
      {
        id: "p4",
        jobId: "j1",
        kind: "add-step",
        status: "approved",
        stepLabel: "Final QA",
        stepId: "qa",
      },
    ];
    const items = applyProposalsToSteps("j1", base, proposals);
    const labels = items
      .filter((i) => i.type === "step" && i.step)
      .map((i) => i.step!.label);
    assert.deepEqual(labels, ["Step A", "Final QA"]);
  });
});
