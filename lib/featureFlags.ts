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
 * Two things are not behind them. An inspection that is 100% done: the
 * property page shows its button again then, as "View Report", and the summary
 * page opens for it. And Export in the unit page's header, where the client's
 * reference site has it: it opens the summary of the inspection in progress,
 * and comes back to the same building and unit.
 *
 * The app has the same two switches in src/config/featureFlags.ts.
 */

/** "Export In Progress" on the property page. */
export const EXPORT_IN_PROGRESS_ENABLED: boolean = false

/** "Summary" on the unit page, and the summary of an inspection still in progress. */
export const IN_PROGRESS_SUMMARY_ENABLED: boolean = false
