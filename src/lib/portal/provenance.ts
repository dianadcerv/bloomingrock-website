/** Source provenance labeling — institutional vs gathered vs interpretation. */

export type InstitutionalProvenance = {
  type: "institutional";
  addedBy: string;
  addedAt: string;
};

export type ExtractedProvenance = {
  type: "extracted";
  /** e.g. "Extracted from email (Oct 8)" */
  label: string;
  sourceId?: string;
  jobId?: string;
};

export type InterpretationProvenance = {
  type: "interpretation";
};

export type ProvenanceMark =
  | InstitutionalProvenance
  | ExtractedProvenance
  | InterpretationProvenance;

export function sourceHref(jobId: string, sourceId: string) {
  return `/jobs/${jobId}#source-${sourceId}`;
}
