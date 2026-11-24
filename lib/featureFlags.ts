/**
 * Switches for parts of the inspection flow.
 *
 * Both of these are off at the client's request ("Final correction",
 * 24 Nov 2026, items A and B): used in the middle of an inspection, either one
 * cleared the unit inspection. They are switched off, not removed: while a
 * switch is `false` its button is not shown. Set it to `true` and the button
 * comes back, on every portal, and the summary page opens for an inspection
 * in progress again.
 *
 * The app has the same two switches in src/config/featureFlags.ts.
 */

/** "Export In Progress" on the property page. */
export const EXPORT_IN_PROGRESS_ENABLED: boolean = false

/** "Summary" on the unit page, and the summary of an inspection still in progress. */
export const IN_PROGRESS_SUMMARY_ENABLED: boolean = false
