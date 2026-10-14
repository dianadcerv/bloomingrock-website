"use client";

import { OpenQuestion, StatusPill } from "@/components/portal/PortalUi";
import type { DemoShopRecord, ShopLifecyclePhase } from "@/lib/portal/admin-demo-data";
import {
  allowedNextPhases,
  canLeaveOnboarding,
  LIFECYCLE_STEPS,
  phaseLabel,
  planLabel,
} from "@/lib/portal/admin-shops-store";
import { PROTOTYPE_OPEN_QUESTIONS } from "@/lib/portal/open-questions";

function stepIndex(phase: ShopLifecyclePhase) {
  return LIFECYCLE_STEPS.findIndex((s) => s.id === phase);
}

export function ShopLifecycleHeader({
  shop,
  onPhaseChange,
}: {
  shop: DemoShopRecord;
  onPhaseChange: (phase: ShopLifecyclePhase) => void;
}) {
  const currentIdx = stepIndex(shop.phase);
  const leavingOnboarding = shop.phase === "onboarding";
  const exitOk = canLeaveOnboarding(shop);
  const nextOptions = allowedNextPhases(shop.phase);

  return (
    <section className="portal-lifecycle-header" aria-labelledby="lifecycle-heading">
      <div className="portal-lifecycle-header__meta">
        <div>
          <h2 id="lifecycle-heading">Lifecycle</h2>
          <p>
            Plan: <strong>{planLabel(shop.engagement)}</strong>
            <span className="look-field__hint"> — billing/delivery type, not a lifecycle phase.</span>
          </p>
          <p>
            Phase: <strong>{phaseLabel(shop.phase)}</strong>
          </p>
        </div>
        <label className="look-field portal-lifecycle-header__change">
          <span className="look-field__label">Superadmin: change phase</span>
          <select
            className="look-field__input"
            value={shop.phase}
            onChange={(e) => onPhaseChange(e.target.value as ShopLifecyclePhase)}
          >
            {LIFECYCLE_STEPS.map((step) => (
              <option key={step.id} value={step.id}>
                {step.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ol className="portal-lifecycle-progress" aria-label="Lifecycle progress">
        {LIFECYCLE_STEPS.map((step, i) => {
          const state =
            i < currentIdx ? "complete" : i === currentIdx ? "current" : "upcoming";
          return (
            <li
              key={step.id}
              className={`portal-lifecycle-progress__step portal-lifecycle-progress__step--${state}`}
            >
              <span className="portal-lifecycle-progress__dot" aria-hidden />
              <span className="portal-lifecycle-progress__label">{step.label}</span>
              <span className="portal-lifecycle-progress__hint">{step.hint}</span>
            </li>
          );
        })}
      </ol>

      {leavingOnboarding ? (
        <div className="portal-lifecycle-exit">
          <h3>To leave Onboarding</h3>
          <ul className="portal-plain">
            <li>
              Workflow set up for at least one product —{" "}
              <StatusPill tone={shop.exitCriteria.workflowSetUp ? "ok" : "missing"}>
                {shop.exitCriteria.workflowSetUp ? "Met" : "Not met"}
              </StatusPill>
            </li>
            <li>
              Successful first project —{" "}
              <StatusPill tone={shop.exitCriteria.firstProjectSuccess ? "ok" : "missing"}>
                {shop.exitCriteria.firstProjectSuccess ? "Met" : "Not met"}
              </StatusPill>
            </li>
          </ul>
          {!exitOk ? (
            <p className="look-field__hint">
              Demo: superadmin can still move phase; production would gate until both criteria are
              met. Next allowed: {nextOptions.map(phaseLabel).join(" or ")}.
            </p>
          ) : (
            <p className="look-field__hint">
              Criteria met — can move to {nextOptions.map(phaseLabel).join(" or ")}.
            </p>
          )}
        </div>
      ) : null}

      {shop.phase === "ongoing-success" ? (
        <p className="look-field__hint">
          From Ongoing Success, superadmin can move back to Build-out for more template work (demo).
        </p>
      ) : null}

      <OpenQuestion>{PROTOTYPE_OPEN_QUESTIONS.managedServicePricing}</OpenQuestion>
    </section>
  );
}
