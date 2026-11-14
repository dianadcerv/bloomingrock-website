const GENERIC_VISITOR_MESSAGE =
  "Something went sideways sending that. Try once more, or email me directly.";

export { GENERIC_VISITOR_MESSAGE as genericFormErrorMessage };

export function logServerError(scope: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`[${scope}]`, error.message);
    if (process.env.NODE_ENV !== "production") {
      console.error(error.stack);
    }
    return;
  }
  console.error(`[${scope}]`, String(error));
}