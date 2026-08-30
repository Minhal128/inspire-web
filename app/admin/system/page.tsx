"use client"

import { useEffect, useMemo, useState } from "react"
import AdminDashboardLayout from "@/components/AdminDashboardLayout"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { adminAPI } from "@/lib/api"
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ClipboardList,
  Clock,
  Gauge,
  RefreshCw,
  TrendingUp,
  Users,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts"

/* ---------------------------------------------------------------------------
 * PALETTE
 *
 * Taken unchanged from the dataviz skill's validated reference instance
 * (references/palette.md). The eight categorical slots are used in their
 * documented order and are NOT re-stepped or re-ordered: this environment
 * forbids running node, so scripts/validate_palette.js could not be re-run,
 * and shipping a re-stepped-but-unvalidated palette is precisely what the
 * skill forbids.
 *
 * The brand teal #006795 is used only as a SINGLE-hue series (one colour for
 * every mark in its chart), where the adjacent-pair CVD checks do not apply
 * and the only gate is contrast against the chart surface: #006795 on white
 * is ~5.9:1, comfortably past the 3:1 floor. Brand teal and categorical slot 1
 * blue never appear inside the same chart.
 * ------------------------------------------------------------------------ */
const BRAND = "#006795"
const BRAND_TRACK = "rgba(0, 103, 149, 0.14)" // lighter step of the same hue, for meter tracks
const BRAND_CURSOR = "rgba(0, 103, 149, 0.06)"

// Chart chrome & ink (recessive by design - the data is the only loud thing).
const VIZ = {
  surface: "#FFFFFF",
  grid: "#E1E0D9",
  axis: "#C3C2B7",
  muted: "#898781",
  ink: "#0B0B0B",
  inkSecondary: "#52514E",
}

// Categorical slots, fixed order. Never cycled, never generated past slot 8.
const CATEGORICAL = [
  "#2a78d6", // 1 blue
  "#eb6834", // 2 orange
  "#1baf7a", // 3 aqua
  "#eda100", // 4 yellow
  "#e87ba4", // 5 magenta
  "#008300", // 6 green
  "#4a3aa7", // 7 violet
  "#e34948", // 8 red
]
const FOLD_GRAY = "#898781" // "Other" / unspecified - never a generated 9th hue

// The role enum in inspire-backend/models/User.js. Colour follows the entity,
// never its rank, so a role keeps its hue when the counts reorder the bars.
const ROLE_ORDER = ["admin", "management", "inspector", "other"]

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const numberFormatter = new Intl.NumberFormat("en-US")
const formatNumber = (value: number) => numberFormatter.format(Number.isFinite(value) ? value : 0)

// Resolve a promise into a never-rejecting envelope so Promise.all can carry a
// partial failure instead of blanking the whole page.
function settle<T>(promise: Promise<T>) {
  return promise.then(
    (data) => ({ ok: true as const, data, error: null as any }),
    (error: any) => ({ ok: false as const, data: null as any, error })
  )
}

function titleCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}

/* ------------------------------- primitives ------------------------------ */

function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  meter,
}: {
  icon: any
  label: string
  value: string
  hint?: string
  meter?: number | null
}) {
  const pct = meter == null ? null : Math.max(0, Math.min(100, meter))
  return (
    <Card className="bg-white rounded-lg shadow-sm border-gray-100 gap-0 py-0 p-4">
      <div className="flex items-start justify-between gap-3">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-tight">{label}</span>
        <span className="shrink-0 rounded-lg bg-cyan-50 border border-cyan-100/50 p-1.5">
          <Icon className="w-4 h-4" style={{ color: BRAND }} />
        </span>
      </div>
      {/* Proportional figures on stat values - tabular-nums is for columns only. */}
      <div className="mt-3 text-2xl font-black text-gray-900 leading-none">{value}</div>
      {hint ? <div className="mt-1.5 text-xs font-semibold text-gray-500">{hint}</div> : null}
      {pct == null ? null : (
        <div className="mt-3 h-1.5 w-full rounded-full overflow-hidden" style={{ backgroundColor: BRAND_TRACK }}>
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: BRAND }} />
        </div>
      )}
    </Card>
  )
}

// Values lead, labels follow. Labels are API data and are inserted as React
// text nodes - never as an HTML string.
function VizTooltip({ active, payload, unit }: any) {
  if (!active || !payload || payload.length === 0) return null
  const entry = payload[0]
  const swatch = entry?.payload?.fill || entry?.color || BRAND
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 shadow-lg">
      <div className="flex items-center gap-2">
        <span className="h-[2px] w-4 rounded-full shrink-0" style={{ backgroundColor: swatch }} />
        <span className="text-sm font-black" style={{ color: VIZ.ink }}>
          {formatNumber(Number(entry?.value))}
        </span>
      </div>
      <div className="mt-0.5 text-[11px] font-semibold" style={{ color: VIZ.inkSecondary }}>
        {String(entry?.payload?.label ?? "")} &middot; {unit}
      </div>
    </div>
  )
}

// recharts measures the DOM, so it must never run during SSR. The page is
// "use client", but a client component still renders once on the server - this
// gate holds the frame until after hydration, and gives ResponsiveContainer the
// explicit parent height it needs to resolve to.
function ChartFrame({
  mounted,
  height,
  isEmpty,
  ariaLabel,
  children,
}: {
  mounted: boolean
  height: number
  isEmpty: boolean
  ariaLabel: string
  children: React.ReactElement
}) {
  if (!mounted) {
    return (
      <div
        style={{ height }}
        className="flex items-center justify-center text-xs font-semibold text-gray-400"
        aria-hidden="true"
      >
        Preparing chart...
      </div>
    )
  }
  if (isEmpty) {
    return (
      <div
        style={{ height }}
        className="flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-gray-200 bg-[#FAFCFD]"
      >
        <span className="text-sm font-bold text-gray-500">No data yet</span>
        <span className="text-xs font-semibold text-gray-400">Nothing has been recorded for this breakdown.</span>
      </div>
    )
  }
  return (
    <div style={{ height }} role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  caption,
  children,
}: {
  title: string
  subtitle?: string
  caption?: string
  children: React.ReactNode
}) {
  return (
    <Card className="bg-white rounded-lg shadow-sm border-gray-100 overflow-hidden gap-0 py-0">
      <div className="p-4 border-b border-gray-100 bg-[#F8FAFC]">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        {subtitle ? <p className="mt-0.5 text-xs font-semibold text-gray-500">{subtitle}</p> : null}
      </div>
      <div className="p-4">{children}</div>
      {caption ? (
        <div className="px-4 pb-4 -mt-1 text-[11px] font-semibold text-gray-400 leading-snug">{caption}</div>
      ) : null}
    </Card>
  )
}

/* --------------------------------- page ---------------------------------- */

export default function SystemStatsPage() {
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dashStats, setDashStats] = useState<any>(null)
  const [sysStats, setSysStats] = useState<any>(null)
  const [dashError, setDashError] = useState<string | null>(null)
  const [sysError, setSysError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    loadStats(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadStats = async (initial = false) => {
    if (initial) setLoading(true)
    else setRefreshing(true)

    try {
      // Both requests go out together. Each is pre-settled, so Promise.all can
      // never reject and one failing endpoint cannot blank the other's section.
      const [dashboard, system] = await Promise.all([
        settle(adminAPI.getDashboardStats()),
        settle(adminAPI.getSystemStats()),
      ])

      const failures: string[] = []

      if (dashboard.ok && dashboard.data?.success) {
        setDashStats(dashboard.data.stats || null)
        setDashError(null)
      } else {
        const message = dashboard.error?.message || "Failed to load dashboard statistics"
        setDashStats(null)
        setDashError(message)
        failures.push("dashboard statistics")
      }

      if (system.ok && system.data?.success) {
        setSysStats(system.data.stats || null)
        setSysError(null)
      } else {
        const message = system.error?.message || "Failed to load system statistics"
        setSysStats(null)
        setSysError(message)
        failures.push("system statistics")
      }

      if (failures.length === 2) {
        toast.error("Failed to load system stats", { position: "top-right" })
      } else if (failures.length === 1) {
        toast.error(`Partially loaded - could not load ${failures[0]}`, { position: "top-right" })
      } else if (!initial) {
        toast.success("System stats refreshed", { position: "top-right", autoClose: 2000 })
      }
    } catch (error: any) {
      // Defensive only: settle() means Promise.all itself cannot reject.
      console.error("Error loading system stats:", error)
      setDashError(error?.message || "Failed to load statistics")
      setSysError(error?.message || "Failed to load statistics")
      toast.error("Failed to load system stats", { position: "top-right" })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  /* --------------------------- data shaping ------------------------------ */
  // Every breakdown below is a MongoDB $group result: an ARRAY of
  // { _id, count } - not a keyed object. inspectionsByMonth nests its _id as
  // { year, month } and arrives sorted NEWEST FIRST, capped at 12 buckets.

  const roleRows = useMemo(() => {
    const raw: any[] = Array.isArray(sysStats?.usersByRole) ? sysStats.usersByRole : []

    // Roles outside the model enum get slots in a stable alphabetical order so
    // a hue never moves when the counts move.
    const extras = Array.from(
      new Set(
        raw
          .map((row) => (row?._id == null ? "" : String(row._id)))
          .filter((role) => role !== "" && !ROLE_ORDER.includes(role))
      )
    ).sort()

    return raw
      .map((row) => {
        const key = row?._id == null || row._id === "" ? "" : String(row._id)
        const known = ROLE_ORDER.indexOf(key)
        const extra = extras.indexOf(key)
        let fill = FOLD_GRAY
        if (known >= 0) fill = CATEGORICAL[known]
        else if (extra >= 0 && ROLE_ORDER.length + extra < CATEGORICAL.length) {
          fill = CATEGORICAL[ROLE_ORDER.length + extra]
        }
        return {
          label: key ? titleCase(key) : "Unspecified",
          count: Number(row?.count) || 0,
          fill,
        }
      })
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
  }, [sysStats])

  const stateRows = useMemo(() => {
    const raw: any[] = Array.isArray(sysStats?.propertiesByState) ? sysStats.propertiesByState : []
    // The backend does not sort this aggregate - ranking happens here.
    return raw
      .map((row) => ({
        label: row?._id == null || row._id === "" ? "Unspecified" : String(row._id),
        count: Number(row?.count) || 0,
      }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
  }, [sysStats])

  const stateTotal = useMemo(() => stateRows.reduce((sum, row) => sum + row.count, 0), [stateRows])
  const stateChartRows = useMemo(() => stateRows.slice(0, 10), [stateRows])

  const monthTrend = useMemo(() => {
    const raw: any[] = Array.isArray(sysStats?.inspectionsByMonth) ? sysStats.inspectionsByMonth : []
    let undated = 0
    const rows = raw
      .filter((row) => {
        const year = row?._id?.year
        const month = row?._id?.month
        if (year == null || month == null) {
          undated += Number(row?.count) || 0
          return false
        }
        return true
      })
      .map((row) => {
        const year = Number(row._id.year)
        const month = Number(row._id.month)
        return {
          year,
          month,
          label: `${MONTH_NAMES[month - 1] || "?"} '${String(year).slice(-2)}`,
          count: Number(row?.count) || 0,
        }
      })
      // Backend sorts newest-first; a trend must read oldest -> newest.
      .sort((a, b) => a.year - b.year || a.month - b.month)
    return { rows, undated }
  }, [sysStats])

  const trendDot = (props: any) => {
    const { cx, cy, index, value } = props
    if (cx == null || cy == null) return <g key={`dot-${index}`} />
    const isLast = index === monthTrend.rows.length - 1
    return (
      <g key={`dot-${index}`}>
        {/* 2px surface ring keeps markers legible where they cross the line. */}
        <circle cx={cx} cy={cy} r={isLast ? 4 : 3} fill={BRAND} stroke={VIZ.surface} strokeWidth={2} />
        {isLast ? (
          <text x={cx} y={cy - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill={VIZ.inkSecondary}>
            {formatNumber(Number(value))}
          </text>
        ) : null}
      </g>
    )
  }

  const activeInspectors = Number(dashStats?.activeInspectors) || 0
  const totalInspectors = Number(dashStats?.totalInspectors) || 0
  const averageScore = Number(dashStats?.averageScore) || 0
  const totalInspections = Number(dashStats?.totalInspections) || 0
  const completedInspections = Number(dashStats?.completedInspections) || 0
  const pendingInspections = Number(dashStats?.pendingInspections) || 0

  const roleChartHeight = Math.max(200, roleRows.length * 44 + 48)
  const stateChartHeight = Math.max(200, stateChartRows.length * 40 + 48)

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-[#E8F4F8] p-3 sm:p-4 md:p-6 text-black">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-gray-900">System Stats</h1>
              <p className="mt-1 text-xs font-semibold text-gray-500">
                Platform-wide totals and breakdowns across properties, inspections and users.
              </p>
            </div>
            <Button
              onClick={() => loadStats(false)}
              disabled={loading || refreshing}
              className="bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-60"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>

          {/* Partial-failure notice: one endpoint down never blanks the other. */}
          {!loading && (dashError || sysError) ? (
            <Card className="bg-[#FEF2F3] rounded-lg shadow-sm border-[#F84B5F]/30 gap-0 py-0 p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-[#F84B5F]" />
                <div className="text-xs font-semibold text-gray-700 leading-relaxed">
                  {dashError && sysError
                    ? "Both statistics endpoints failed. Nothing could be loaded."
                    : "Part of this page could not be loaded. Everything else below is live."}
                  <ul className="mt-1 list-disc pl-4 text-gray-500">
                    {dashError ? <li>Dashboard statistics: {dashError}</li> : null}
                    {sysError ? <li>System statistics: {sysError}</li> : null}
                  </ul>
                </div>
              </div>
            </Card>
          ) : null}

          {/* --------------------------- KPI row --------------------------- */}
          {loading ? (
            <Card className="bg-white rounded-lg shadow-sm border-gray-100 gap-0 py-0">
              <div className="p-8 text-center text-gray-500">Loading system stats...</div>
            </Card>
          ) : !dashStats ? (
            <Card className="bg-white rounded-lg shadow-sm border-gray-100 gap-0 py-0">
              <div className="p-8 text-center">
                <p className="text-gray-500">No dashboard statistics found.</p>
                <Button
                  onClick={() => loadStats(false)}
                  className="mt-4 bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all"
                >
                  Try again
                </Button>
              </div>
            </Card>
          ) : (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 transition-opacity ${
                refreshing ? "opacity-60" : "opacity-100"
              }`}
            >
              <StatTile
                icon={Building2}
                label="Total properties"
                value={formatNumber(Number(dashStats.totalProperties) || 0)}
                hint="Across every portfolio"
              />
              <StatTile
                icon={ClipboardList}
                label="Total inspections"
                value={formatNumber(totalInspections)}
                hint="All statuses"
              />
              <StatTile
                icon={CheckCircle2}
                label="Completed"
                value={formatNumber(completedInspections)}
                hint={
                  totalInspections > 0
                    ? `${Math.round((completedInspections / totalInspections) * 100)}% of all inspections`
                    : "No inspections yet"
                }
              />
              <StatTile
                icon={Clock}
                label="Pending"
                value={formatNumber(pendingInspections)}
                hint="Scheduled, not started"
              />
              <StatTile
                icon={Users}
                label="Active inspectors"
                value={`${formatNumber(activeInspectors)} / ${formatNumber(totalInspectors)}`}
                hint={totalInspectors > 0 ? "Active of total inspectors" : "No inspectors registered"}
                meter={totalInspectors > 0 ? (activeInspectors / totalInspectors) * 100 : null}
              />
              <StatTile
                icon={Gauge}
                label="Average score"
                value={formatNumber(averageScore)}
                hint="Mean inspection score"
                meter={Math.max(0, Math.min(100, averageScore))}
              />
            </div>
          )}

          {/* ---------------------------- charts --------------------------- */}
          {loading ? null : !sysStats ? (
            <Card className="bg-white rounded-lg shadow-sm border-gray-100 gap-0 py-0">
              <div className="p-8 text-center">
                <p className="text-gray-500">No system statistics found.</p>
                <Button
                  onClick={() => loadStats(false)}
                  className="mt-4 bg-[#006795] hover:bg-[#0A5670] text-white font-semibold px-4 py-2 rounded-lg text-sm shadow-sm transition-all"
                >
                  Try again
                </Button>
              </div>
            </Card>
          ) : (
            <div className={`space-y-4 md:space-y-6 transition-opacity ${refreshing ? "opacity-60" : "opacity-100"}`}>
              {/* Trend over time - single series, so no legend box: the title
                  already names what is plotted. Endpoint is direct-labelled. */}
              <ChartCard
                title="Inspections by month"
                subtitle={`Scheduled inspections per month${
                  monthTrend.rows.length ? ` - last ${monthTrend.rows.length} recorded ${monthTrend.rows.length === 1 ? "month" : "months"}` : ""
                }`}
                caption={
                  monthTrend.rows.length
                    ? `The backend returns only the 12 most recent months that contain inspections, so months with none are absent from the axis rather than plotted as zero.${
                        monthTrend.undated
                          ? ` ${formatNumber(monthTrend.undated)} inspection(s) have no scheduled date and are not plotted.`
                          : ""
                      }`
                    : undefined
                }
              >
                <ChartFrame
                  mounted={mounted}
                  height={320}
                  isEmpty={monthTrend.rows.length === 0}
                  ariaLabel="Line chart of inspections scheduled per month"
                >
                  <LineChart data={monthTrend.rows} margin={{ top: 24, right: 28, bottom: 4, left: 0 }}>
                    <CartesianGrid vertical={false} stroke={VIZ.grid} strokeWidth={1} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: VIZ.muted, fontSize: 11 }}
                      tickLine={false}
                      axisLine={{ stroke: VIZ.axis }}
                      minTickGap={12}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      allowDecimals={false}
                      width={44}
                      tick={{ fill: VIZ.muted, fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value: any) => formatNumber(Number(value))}
                    />
                    <RechartsTooltip
                      cursor={{ stroke: VIZ.axis, strokeWidth: 1 }}
                      content={<VizTooltip unit="inspections" />}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke={BRAND}
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      dot={trendDot}
                      activeDot={{ r: 5, fill: BRAND, stroke: VIZ.surface, strokeWidth: 2 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ChartFrame>
              </ChartCard>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Identity, not magnitude ordering: each role keeps a fixed
                    categorical hue, and the axis prints the role name so
                    identity is never carried by colour alone. */}
                <ChartCard
                  title="Users by role"
                  subtitle={
                    sysStats?.totalUsers != null
                      ? `${formatNumber(Number(sysStats.totalUsers) || 0)} users across ${roleRows.length} role${
                          roleRows.length === 1 ? "" : "s"
                        }`
                      : "Distribution of accounts across roles"
                  }
                >
                  <ChartFrame
                    mounted={mounted}
                    height={roleChartHeight}
                    isEmpty={roleRows.length === 0}
                    ariaLabel="Bar chart of user accounts by role"
                  >
                    <BarChart data={roleRows} layout="vertical" margin={{ top: 4, right: 48, bottom: 4, left: 4 }}>
                      <CartesianGrid horizontal={false} stroke={VIZ.grid} strokeWidth={1} />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fill: VIZ.muted, fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: VIZ.axis }}
                        tickFormatter={(value: any) => formatNumber(Number(value))}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={104}
                        tick={{ fill: VIZ.inkSecondary, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: VIZ.axis }}
                      />
                      <RechartsTooltip cursor={{ fill: BRAND_CURSOR }} content={<VizTooltip unit="users" />} />
                      <Bar dataKey="count" barSize={18} maxBarSize={24} radius={[0, 4, 4, 0]} isAnimationActive={false}>
                        {roleRows.map((row, index) => (
                          <Cell key={`${row.label}-${index}`} fill={row.fill} />
                        ))}
                        {/* Value rides outside the bar end, so it can never be
                            clipped by a short bar. */}
                        <LabelList
                          dataKey="count"
                          position="right"
                          offset={8}
                          fill={VIZ.inkSecondary}
                          fontSize={11}
                          fontWeight={700}
                          formatter={(value: any) => formatNumber(Number(value))}
                        />
                      </Bar>
                    </BarChart>
                  </ChartFrame>
                </ChartCard>

                {/* Ranked magnitude - one series, one hue. */}
                <ChartCard
                  title="Properties by state"
                  subtitle={
                    stateRows.length
                      ? `${formatNumber(stateTotal)} properties across ${stateRows.length} state${
                          stateRows.length === 1 ? "" : "s"
                        }`
                      : "Ranked property count per state"
                  }
                  caption={
                    stateRows.length > stateChartRows.length
                      ? `Showing the top ${stateChartRows.length} of ${stateRows.length} states. Every state is listed in the table below.`
                      : undefined
                  }
                >
                  <ChartFrame
                    mounted={mounted}
                    height={stateChartHeight}
                    isEmpty={stateChartRows.length === 0}
                    ariaLabel="Bar chart of properties per state, ranked highest to lowest"
                  >
                    <BarChart
                      data={stateChartRows}
                      layout="vertical"
                      margin={{ top: 4, right: 48, bottom: 4, left: 4 }}
                    >
                      <CartesianGrid horizontal={false} stroke={VIZ.grid} strokeWidth={1} />
                      <XAxis
                        type="number"
                        allowDecimals={false}
                        tick={{ fill: VIZ.muted, fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: VIZ.axis }}
                        tickFormatter={(value: any) => formatNumber(Number(value))}
                      />
                      <YAxis
                        type="category"
                        dataKey="label"
                        width={104}
                        tick={{ fill: VIZ.inkSecondary, fontSize: 12 }}
                        tickLine={false}
                        axisLine={{ stroke: VIZ.axis }}
                      />
                      <RechartsTooltip cursor={{ fill: BRAND_CURSOR }} content={<VizTooltip unit="properties" />} />
                      <Bar
                        dataKey="count"
                        fill={BRAND}
                        barSize={18}
                        maxBarSize={24}
                        radius={[0, 4, 4, 0]}
                        isAnimationActive={false}
                      >
                        <LabelList
                          dataKey="count"
                          position="right"
                          offset={8}
                          fill={VIZ.inkSecondary}
                          fontSize={11}
                          fontWeight={700}
                          formatter={(value: any) => formatNumber(Number(value))}
                        />
                      </Bar>
                    </BarChart>
                  </ChartFrame>
                </ChartCard>
              </div>

              {/* ------------------------ table view ----------------------- */}
              {/* The chart's WCAG-clean twin: every state, not just the top 10,
                  reachable without hovering anything. */}
              <Card className="bg-white rounded-lg shadow-sm overflow-hidden gap-0 py-0">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-[#F8FAFC]">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-bold text-gray-900">Properties by state</h3>
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                      {stateRows.length} {stateRows.length === 1 ? "state" : "states"}
                    </span>
                  </div>
                  <TrendingUp className="w-4 h-4 text-gray-300" />
                </div>

                {stateRows.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">No properties found.</div>
                ) : (
                  <>
                    {/* md+ : a real table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#F8FAFC] border-b">
                          <tr>
                            <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Rank
                            </th>
                            <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              State/Province
                            </th>
                            <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Properties
                            </th>
                            <th className="text-center py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Share
                            </th>
                            <th className="text-left py-4 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                              Distribution
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {stateRows.map((row, index) => {
                            const share = stateTotal > 0 ? (row.count / stateTotal) * 100 : 0
                            return (
                              <tr key={`${row.label}-${index}`} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6 text-center font-black text-xs text-gray-400 tabular-nums">
                                  {index + 1}
                                </td>
                                <td className="py-4 px-6 text-center">
                                  <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight">
                                    {row.label}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-center font-black text-gray-900 text-sm tabular-nums">
                                  {formatNumber(row.count)}
                                </td>
                                <td className="py-4 px-6 text-center font-bold text-xs text-gray-500 tabular-nums">
                                  {share.toFixed(1)}%
                                </td>
                                <td className="py-4 px-6">
                                  <div
                                    className="h-1.5 w-full rounded-full overflow-hidden"
                                    style={{ backgroundColor: BRAND_TRACK }}
                                  >
                                    <div
                                      className="h-full rounded-full"
                                      style={{ width: `${share}%`, backgroundColor: BRAND }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* below md : stacked cards */}
                    <div className="md:hidden divide-y divide-gray-50">
                      {stateRows.map((row, index) => {
                        const share = stateTotal > 0 ? (row.count / stateTotal) * 100 : 0
                        return (
                          <div key={`${row.label}-mobile-${index}`} className="p-4">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs text-gray-400 tabular-nums">{index + 1}</span>
                                <span className="bg-green-50 text-green-700 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tight">
                                  {row.label}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-black text-gray-900 text-sm tabular-nums">
                                  {formatNumber(row.count)}
                                </div>
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                  {share.toFixed(1)}% share
                                </div>
                              </div>
                            </div>
                            <div
                              className="mt-3 h-1.5 w-full rounded-full overflow-hidden"
                              style={{ backgroundColor: BRAND_TRACK }}
                            >
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${share}%`, backgroundColor: BRAND }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  )
}
