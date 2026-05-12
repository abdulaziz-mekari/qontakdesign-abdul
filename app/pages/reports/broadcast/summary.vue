<template>
  <div :class="pageClass">
    <MpFlex direction="column" gap="6" paddingRight="6">

      <!-- Filter Bar (3 filters < 4 → width 240px each, shown as placeholder state) -->
      <MpFlex gap="3" alignItems="center">
        <div style="width: 240px; flex-shrink: 0">
          <MpSelect v-model="timezone" id="timezone-select" placeholder="(UTC+07:00)" is-full-width is-clearable @clear="timezone = undefined">
            <option value="utc8">(UTC+08:00)</option>
            <option value="utc0">(UTC+00:00)</option>
            <option value="utc-5">(UTC-05:00)</option>
          </MpSelect>
        </div>

        <div style="width: 240px; flex-shrink: 0">
          <MpSelect v-model="statusFilter" id="status-select" placeholder="All status" is-full-width is-clearable @clear="statusFilter = undefined">
            <option value="sent">Sent</option>
            <option value="delivered">Delivered</option>
            <option value="read">Read</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </MpSelect>
        </div>

        <!-- Advance Date Picker -->
        <MpFlex ref="datePickerTarget" width="240px" flex-shrink="0">
          <MpPopover id="date-picker-advance-popover" :is-manual="true" :is-open="isPopoverOpen">
            <MpPopoverTrigger>
              <MpInputGroup size="md">
                <MpInput
                  id="date-picker-advance-input"
                  placeholder="Today"
                  :value="getFormattedValue"
                  is-clearable
                  is-read-only
                  @focus="handleOpenPopover"
                  @clear="handleClearDate"
                />
                <MpInputRightAddon id="date-picker-advance-input-right-addon">
                  <MpIcon name="calendar" size="sm" @focus="handleOpenPopover" />
                </MpInputRightAddon>
              </MpInputGroup>
            </MpPopoverTrigger>

            <MpPopoverContent>
              <MpFlex width="412px">
                <MpFlex direction="column" :width="isShowDatePicker ? '136px' : 'full'">
                  <MpPopoverList :class="menuListClasses">
                    <MpText
                      size="label-small"
                      :color="isNextTheme ? 'text.secondary' : 'gray.400'"
                      :class="css({ pt: 2, pb: 1, px: 3, letterSpacing: '2px', width: 'full' })"
                    >
                      TIME RANGE
                    </MpText>
                    <MpPopoverListItem :is-active="selectionTimeRange === 'Today'" @click="handleSelectTimeRange('Today')" :class="menuClasses">Today</MpPopoverListItem>
                    <MpPopoverListItem :is-active="selectionTimeRange === 'Last 7 days'" @click="handleSelectTimeRange('Last 7 days')" :class="menuClasses">Last 7 days</MpPopoverListItem>
                    <MpPopoverListItem :is-active="selectionTimeRange === 'Last 30 days'" @click="handleSelectTimeRange('Last 30 days')" :class="menuClasses">Last 30 days</MpPopoverListItem>
                  </MpPopoverList>
                  <div :class="css({ px: 3 })">
                    <MpDivider id="date-picker-advance-divider" />
                  </div>
                  <MpPopoverList :class="menuListClasses">
                    <MpPopoverListItem :is-active="selectionTimeRange === 'Per day'" @click="handleSelectTimeRange('Per day')" :class="menuClasses">Per day</MpPopoverListItem>
                    <MpPopoverListItem :is-active="selectionTimeRange === 'Per week'" @click="handleSelectTimeRange('Per week')" :class="menuClasses">Per week</MpPopoverListItem>
                    <MpPopoverListItem :is-active="selectionTimeRange === 'Per month'" @click="handleSelectTimeRange('Per month')" :class="menuClasses">Per month</MpPopoverListItem>
                    <MpPopoverListItem :is-active="selectionTimeRange === 'Custom'" @click="handleSelectTimeRange('Custom')" :class="menuClasses">Custom</MpPopoverListItem>
                  </MpPopoverList>
                </MpFlex>

                <MpFlex v-if="isShowDatePicker" direction="column" width="276px" p="3">
                  <MpDatePicker
                    id="date-picker-advance"
                    :model-value="dateValue"
                    :type="datePickerType"
                    :is-range="selectionTimeRange === 'Custom'"
                    :is-keep-alive="false"
                    :is-inline="true"
                    @update:modelValue="handleChangeDate"
                  />
                </MpFlex>
              </MpFlex>
            </MpPopoverContent>
          </MpPopover>
        </MpFlex>
      </MpFlex>

      <!-- Stats Card -->
      <div :class="cardClass" style="position: relative">
        <div :class="statsGridClass">
          <MpFlex
            v-for="stat in allStats"
            :key="stat.label"
            direction="column"
            gap="1"
            style="min-width: 0"
          >
            <MpFlex gap="2" alignItems="baseline">
              <MpText
                size="h2"
                weight="semiBold"
                :style="{ fontVariantNumeric: 'tabular-nums', lineHeight: '32px' }"
              >{{ stat.value }}</MpText>
              <MpText
                v-if="stat.rate"
                size="body"
                color="text.secondary"
              >{{ stat.rate }}</MpText>
            </MpFlex>
            <MpFlex gap="1" alignItems="center">
              <MpText size="label" color="text.secondary" :style="{ whiteSpace: 'nowrap' }">{{ stat.label }}</MpText>
              <MpIcon name="info" size="sm" color="text.secondary" />
            </MpFlex>
          </MpFlex>
        </div>

        <!-- Download icon button -->
        <MpButton
          variant="ghost"
          left-icon="download"
          size="sm"
          aria-label="Download stats"
          :style="{ position: 'absolute', top: '16px', right: '16px' }"
        />
      </div>

      <!-- Line Chart Card -->
      <div :class="cardClass">
        <MpFlex justifyContent="space-between" alignItems="center" style="margin-bottom: 16px">
          <MpText size="h2" weight="semiBold">Status count per date</MpText>
          <MpButton
            variant="ghost"
            left-icon="download"
            size="sm"
            aria-label="Download chart"
          />
        </MpFlex>

        <MpBanner
          v-if="hasAnomaly && !chartIsEmpty"
          variant="info"
          is-inline
          :class="css({ mb: '4' })"
        >
          <MpBannerIcon id="banner-icon-wtm" />
          Large spike detected. Smaller values may appear compressed.
        </MpBanner>

        <div v-if="chartIsEmpty" :class="css({ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '340px' })">
          <MpFlex direction="column" alignItems="center" gap="2">
            <MpIcon name="bar-chart" size="xl" color="text.secondary" />
            <MpText size="body" color="text.secondary">No data available for the selected period</MpText>
          </MpFlex>
        </div>
        <div v-else ref="chartContainerRef">
          <MpChart
            id="broadcast-activity-chart"
            type="line"
            :data="chartData"
            :options="chartOptions"
            height-chart="340px"
            width-chart="100%"
            legend-position="bottom"
            legend-direction="horizontal"
          />
        </div>
      </div>

      <!-- Data Table Card -->
      <div :class="cardClass">

        <!-- Table Header -->
        <MpFlex justifyContent="space-between" alignItems="flex-start" style="margin-bottom: 16px">
          <MpFlex direction="column" gap="1">
            <MpText size="h2" weight="semiBold">List of sent campaign</MpText>
            <MpText size="body-small" color="text.secondary">Each status is automatically updated.</MpText>
          </MpFlex>
          <MpButton variant="secondary" size="sm">Download</MpButton>
        </MpFlex>

        <!-- Table -->
        <MpTableContainer>
          <MpTable is-hoverable>
            <MpTableHead>
              <MpTableRow>
                <MpTableCell as="th">
                  <MpFlex gap="1" alignItems="center">
                    <MpText size="label" weight="semiBold">Sent time</MpText>
                    <MpIcon name="info" size="sm" color="text.secondary" />
                  </MpFlex>
                </MpTableCell>
                <MpTableCell as="th">
                  <MpText size="label" weight="semiBold">Broadcast name</MpText>
                </MpTableCell>
                <MpTableCell as="th">
                  <MpText size="label" weight="semiBold">Template</MpText>
                </MpTableCell>
                <MpTableCell as="th">
                  <MpText size="label" weight="semiBold">Channel</MpText>
                </MpTableCell>
                <MpTableCell as="th">
                  <MpText size="label" weight="semiBold">Customer</MpText>
                </MpTableCell>
                <MpTableCell as="th">
                  <MpText size="label" weight="semiBold">Status</MpText>
                </MpTableCell>
              </MpTableRow>
            </MpTableHead>
            <MpTableBody>
              <MpTableRow v-for="row in tableData" :key="row.id">
                <MpTableCell as="td">
                  <MpText size="label">{{ row.sentTime }}</MpText>
                </MpTableCell>
                <MpTableCell as="td">
                  <MpText size="label">{{ row.broadcastName }}</MpText>
                </MpTableCell>
                <MpTableCell as="td">
                  <MpFlex direction="column" gap="0">
                    <MpText size="label">{{ row.templateName }}</MpText>
                    <MpText size="label-small" color="text.secondary">{{ row.templateCategory }}</MpText>
                  </MpFlex>
                </MpTableCell>
                <MpTableCell as="td">
                  <MpFlex direction="column" gap="0">
                    <MpText size="label">{{ row.channelName }}</MpText>
                    <MpText size="label-small" color="text.secondary">{{ row.channelNumber }}</MpText>
                  </MpFlex>
                </MpTableCell>
                <MpTableCell as="td">
                  <MpFlex direction="column" gap="0">
                    <MpText size="label">{{ row.customerName }}</MpText>
                    <MpText size="label-small" color="text.secondary">{{ row.customerHandle }}</MpText>
                  </MpFlex>
                </MpTableCell>
                <MpTableCell as="td">
                  <MpText size="label">{{ row.status }}</MpText>
                </MpTableCell>
              </MpTableRow>
            </MpTableBody>
          </MpTable>
        </MpTableContainer>

        <!-- Pagination -->
        <MpFlex justifyContent="space-between" alignItems="center" style="margin-top: 16px">
          <MpFlex gap="2" alignItems="center">
            <MpText size="body-small" color="text.secondary">Rows per page</MpText>
            <MpSelect v-model="rowsPerPage" id="rows-per-page" size="sm" :style="{ width: '72px' }">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </MpSelect>
          </MpFlex>

          <MpFlex gap="3" alignItems="center">
            <MpText size="body-small" color="text.secondary">
              Showing {{ showingStart }}-{{ showingEnd }} of {{ totalRows }}
            </MpText>

            <MpFlex gap="2" alignItems="center">
              <MpButton
                variant="ghost"
                left-icon="chevron-left"
                size="sm"
                aria-label="Previous page"
                :is-disabled="currentPage <= 1"
                @click="currentPage--"
              />
              <MpFlex gap="1" alignItems="center">
                <MpSelect v-model="currentPageStr" id="page-select" size="sm" :style="{ width: '60px' }">
                  <option v-for="p in totalPages" :key="p" :value="String(p)">{{ p }}</option>
                </MpSelect>
                <MpText size="body-small" color="text.secondary">of {{ totalPages }} pages</MpText>
              </MpFlex>
              <MpButton
                variant="ghost"
                left-icon="chevron-right"
                size="sm"
                aria-label="Next page"
                :is-disabled="currentPage >= totalPages"
                @click="currentPage++"
              />
            </MpFlex>
          </MpFlex>
        </MpFlex>

      </div>
    </MpFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  css,
  MpFlex,
  MpText,
  MpButton,
  MpSelect,
  MpIcon,
  MpDatePicker,
  MpInput,
  MpInputGroup,
  MpInputRightAddon,
  MpPopover,
  MpPopoverTrigger,
  MpPopoverContent,
  MpPopoverList,
  MpPopoverListItem,
  MpDivider,
  MpBanner,
  MpBannerIcon,
  MpChart,
  MpTableContainer,
  MpTable,
  MpTableHead,
  MpTableBody,
  MpTableRow,
  MpTableCell,
} from '@mekari/pixel3'
import { onClickOutside, usePixelTheme } from '@mekari/pixel3-utils'
definePageMeta({ layout: 'default', pageTitle: 'Broadcast summary', hidePageAction: true })

const pageClass = css({ flexGrow: '1' })

// --- Card style ---
const cardClass = css({
  bg: 'background.stage',
  borderWidth: '1px',
  borderColor: 'border.default',
  rounded: 'md',
  p: '6',
  width: 'full',
})

// --- Filters ---
const timezone = ref<string | undefined>(undefined)
const statusFilter = ref<string | undefined>(undefined)

// --- Advance Date Picker ---
const DATE_PICKER_TYPES = ['Per day', 'Per week', 'Per month', 'Custom']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const { isNextTheme } = usePixelTheme()
const activeTimeRange = ref('Today')
const dateValue = ref<Date | Date[]>(new Date())
const datePickerTarget = ref(null)
const isPopoverOpen = ref(false)
const selectionTimeRange = ref('')
const datePickerType = ref()

const menuClasses = computed(() => css({ borderRadius: isNextTheme.value ? 'md' : 'none' }))
const menuListClasses = computed(() => css({ pt: 3, pb: 2, px: isNextTheme.value ? 2 : 0 }))
const isShowDatePicker = computed(() => DATE_PICKER_TYPES.includes(selectionTimeRange.value))

const getFormattedValue = computed(() => {
  if (!dateValue.value) return ''
  const fmt = (d: Date) => formatDate(d)
  const a = activeTimeRange.value
  if (a === 'Today') return `Today (${fmt(dateValue.value as Date)})`
  if (a === 'Last 7 days' || a === 'Last 30 days' || a === 'Per week' || a === 'Custom') {
    const [from, to] = dateValue.value as Date[]
    return `${a} (${fmt(from)} - ${fmt(to)})`
  }
  if (a === 'Per day' || a === 'Per month') return `${a} (${fmt(dateValue.value as Date)})`
  return ''
})

function handleSelectTimeRange(timeRange: string) {
  selectionTimeRange.value = timeRange
  if (timeRange === 'Today') handleSelectShortcut(0)
  if (timeRange === 'Last 7 days') handleSelectShortcut(-7)
  if (timeRange === 'Last 30 days') handleSelectShortcut(-30)
  if (timeRange === 'Per day') datePickerType.value = 'date'
  if (timeRange === 'Per week') datePickerType.value = 'week'
  if (timeRange === 'Per month') datePickerType.value = 'month'
  if (timeRange === 'Custom') datePickerType.value = ''
}

function handleSelectShortcut(val: number) {
  dateValue.value = val === 0 ? new Date() : [getDateOffset(val), new Date()]
  handleChangeDate(dateValue.value as Date)
}

function handleChangeDate(val: Date) {
  dateValue.value = val
  activeTimeRange.value = selectionTimeRange.value
  handleClosePopover()
}

function handleOpenPopover() { isPopoverOpen.value = true }
function handleClosePopover() { isPopoverOpen.value = false }
function handleClearDate() {
  activeTimeRange.value = 'Today'
  dateValue.value = new Date()
  selectionTimeRange.value = ''
  datePickerType.value = undefined
}

onClickOutside(datePickerTarget, handleClosePopover)

function formatDate(date: Date) {
  const d = new Date(date)
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`
}

function getDateOffset(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

// --- Demo data per time range ---
const DEMO_DATA: Record<string, {
  labels: string[]
  datasets: { delivered: number[]; sent: number[]; read: number[]; pending: number[]; failed: number[] }
  reply: number
}> = {
  Today: {
    labels: ['13 May'],
    datasets: { delivered: [10], sent: [0], read: [62], pending: [0], failed: [718] },
    reply: 32,
  },
  'Last 7 days': {
    labels: ['7 May', '8 May', '9 May', '10 May', '11 May', '12 May', '13 May'],
    datasets: {
      delivered: [12, 8, 20, 1255, 15, 5, 10],
      sent:      [5,  3, 10, 1280, 8,  2, 0],
      read:      [8,  6, 15, 1220, 12, 3, 7],
      pending:   [0,  2, 5,  180,  3,  1, 0],
      failed:    [20, 15, 18, 245,  22, 10, 15],
    },
    reply: 128,
  },
}

const activeData = computed(() => DEMO_DATA[activeTimeRange.value] ?? DEMO_DATA['Today'])

// --- Stats ---
const statsGridClass = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '6',
  width: 'full',
  '@media (max-width: 768px)': { gridTemplateColumns: 'repeat(2, 1fr)' },
  '@media (max-width: 480px)': { gridTemplateColumns: '1fr' },
})

const allStats = computed(() => {
  const d = activeData.value.datasets
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0)
  const totalDelivered = sum(d.delivered)
  const totalSent      = sum(d.sent)
  const totalRead      = sum(d.read)
  const totalPending   = sum(d.pending)
  const totalFailed    = sum(d.failed)
  const totalReply     = activeData.value.reply
  const totalBroadcast = totalDelivered + totalSent + totalRead + totalPending + totalFailed
  const readBase  = totalRead + totalDelivered
  const readRate  = readBase > 0 ? ((totalRead / readBase) * 100).toFixed(2) : '0.00'
  const replyRate = totalBroadcast > 0 ? ((totalReply / totalBroadcast) * 100).toFixed(2) : '0.00'
  return [
    { value: totalBroadcast.toLocaleString(), rate: null,              label: 'Total broadcast messages' },
    { value: totalDelivered.toLocaleString(), rate: null,              label: 'Total delivered' },
    { value: totalSent.toLocaleString(),      rate: null,              label: 'Total sent' },
    { value: totalPending.toLocaleString(),   rate: null,              label: 'Total pending' },
    { value: totalRead.toLocaleString(),      rate: `(${readRate}%)`,  label: 'Total read (read rate)' },
    { value: totalReply.toLocaleString(),     rate: `(${replyRate}%)`, label: 'Total reply (reply rate)' },
    { value: totalFailed.toLocaleString(),    rate: null,              label: 'Total failed' },
  ]
})

// --- Chart data ---
function resolveChartToken(varName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || fallback
}

const CHART_COLORS = {
  delivered: resolveChartToken('--mp-colors-chart-cat03-bold', '#8270DB'),
  sent:      resolveChartToken('--mp-colors-chart-cat01-bold', '#387CEB'),
  read:      resolveChartToken('--mp-colors-chart-cat07-bold', '#649B11'),
  pending:   resolveChartToken('--mp-colors-chart-cat04-bold', '#E46910'),
  failed:    resolveChartToken('--mp-colors-chart-cat06-bold', '#E2483D'),
}

const makeDataset = (label: string, color: string, data: number[]) => ({
  label, data, borderColor: color, backgroundColor: color,
  tension: 0, pointRadius: 4, pointBackgroundColor: color, pointBorderWidth: 0,
})

const chartData = computed(() => {
  const d = activeData.value
  return {
    labels: d.labels,
    datasets: [
      makeDataset('Delivered', CHART_COLORS.delivered, d.datasets.delivered),
      makeDataset('Sent',      CHART_COLORS.sent,      d.datasets.sent),
      makeDataset('Read',      CHART_COLORS.read,      d.datasets.read),
      makeDataset('Pending',   CHART_COLORS.pending,   d.datasets.pending),
      makeDataset('Failed',    CHART_COLORS.failed,    d.datasets.failed),
    ],
  }
})

// --- Chart: container width tracking for adaptive X ticks ---
const chartContainerRef = ref<HTMLElement | null>(null)
const chartContainerWidth = ref(800)
let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  if (chartContainerRef.value) {
    resizeObserver = new ResizeObserver(entries => {
      chartContainerWidth.value = entries[0]?.contentRect.width ?? chartContainerWidth.value
    })
    resizeObserver.observe(chartContainerRef.value)
    chartContainerWidth.value = chartContainerRef.value.offsetWidth
  }
})
onUnmounted(() => resizeObserver?.disconnect())

// --- Chart: Y-axis auto-scaling helpers ---
function getNiceStep(rawStep: number): number {
  if (rawStep <= 0) return 1
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const frac = rawStep / mag
  const niceFrac = frac <= 1 ? 1 : frac <= 2 ? 2 : frac <= 5 ? 5 : 10
  return niceFrac * mag
}

function computeYAxis(maxValue: number): { min: number; max: number; stepSize: number } {
  if (maxValue <= 7) return { min: 0, max: maxValue || 1, stepSize: 1 }
  let step = getNiceStep(maxValue / 6)
  let ceiling = Math.ceil(maxValue / step) * step
  let guard = 0
  while (ceiling / step > 8 && guard++ < 10) {
    step = getNiceStep(step * 1.5)
    ceiling = Math.ceil(maxValue / step) * step
  }
  return { min: 0, max: ceiling, stepSize: step }
}

function formatKValue(value: number): string {
  if (value >= 1000) return `${value / 1000}K`
  return String(value)
}

// --- Chart: derived state ---
const chartAllValues = computed(() => chartData.value.datasets.flatMap(d => d.data))
const chartIsEmpty = computed(() => chartAllValues.value.every(v => v === 0))

const hasAnomaly = computed(() => {
  for (const dataset of chartData.value.datasets) {
    const values = (dataset.data as number[]).filter(v => v > 0)
    if (values.length < 2) continue
    const sorted = [...values].sort((a, b) => a - b)
    const median = sorted[Math.floor(sorted.length / 2)]
    const max = sorted[sorted.length - 1]
    const secondMax = sorted[sorted.length - 2]
    if (max > 10 * median || max > 5 * secondMax) return true
  }
  return false
})
const chartYAxis = computed(() => computeYAxis(Math.max(0, ...chartAllValues.value)))
const chartDateRangeDays = computed(() => chartData.value.labels.length)

const chartOptions = computed(() => {
  const width = chartContainerWidth.value
  const days = chartDateRangeDays.value
  const showEveryDay = width >= 900 || days <= 14
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'nearest' as const, intersect: true },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
    scales: {
      x: {
        offset: true,
        grid: { display: false },
        ticks: {
          color: '#656F80',
          font: { size: 12 },
          ...(showEveryDay ? {} : { maxTicksLimit: Math.ceil(days / 5) + 1 }),
        },
      },
      y: {
        min: chartYAxis.value.min,
        max: chartYAxis.value.max,
        ticks: {
          stepSize: chartYAxis.value.stepSize,
          color: '#656F80',
          font: { size: 12 },
          callback: (value: number) => formatKValue(value),
        },
        grid: { color: '#EAECF0' },
      },
    },
  }
})

// --- Table ---
const tableData = [
  { id: 1,  sentTime: '19 Aug 2022, 11:13', broadcastName: 'Promo harbolnas 2023', templateName: 'harbolnas 2023', templateCategory: 'Marketing',      channelName: 'Central Perk Official', channelNumber: '62857555860', customerName: 'Geraldine Abel',         customerHandle: 'geraldingabel',      status: 'Sent' },
  { id: 2,  sentTime: '18 Aug 2022, 17:32', broadcastName: 'Promo harbolnas 2023', templateName: 'harbolnas 2023', templateCategory: 'Marketing',      channelName: 'Central Perk Official', channelNumber: '62857555860', customerName: 'Muhammad Soleh',         customerHandle: '',                   status: 'Sent' },
  { id: 3,  sentTime: '7 Jan 2022, 05:55',  broadcastName: 'Promo harbolnas 2023', templateName: 'harbolnas 2023', templateCategory: 'Marketing',      channelName: 'Central Perk Official', channelNumber: '62857555860', customerName: 'Eko Sudariyanto',        customerHandle: '628121456634362',    status: 'Delivered' },
  { id: 4,  sentTime: '3 Nov 2022, 17:17',  broadcastName: 'Promo harbolnas 2023', templateName: 'harbolnas 2023', templateCategory: 'Marketing',      channelName: 'Central Perk Official', channelNumber: '62857555860', customerName: 'Moh Saifudin Afandi',    customerHandle: 'saufidin',           status: 'Pending' },
  { id: 5,  sentTime: '22 Jul 2022, 09:45', broadcastName: 'OTP',                  templateName: 'otp_password',   templateCategory: 'Authentication', channelName: 'Central Perk Official', channelNumber: '62857555860', customerName: 'Indra Pangestu',         customerHandle: 'indrap',             status: 'Pending' },
  { id: 6,  sentTime: '2 Feb 2022, 18:10',  broadcastName: 'Abandoned cart follow up', templateName: 'cart_reminder', templateCategory: 'Utility',    channelName: 'Central Perk HR',       channelNumber: '62857555860', customerName: 'Aryo Agung Benardi',     customerHandle: 'aryo_agung',         status: 'Delivered' },
  { id: 7,  sentTime: '29 Jul 2022, 10:08', broadcastName: 'Abandoned cart follow up', templateName: 'cart_reminder', templateCategory: 'Utility',    channelName: 'Central Perk Official', channelNumber: '62857555860', customerName: 'Albert Martadinata',     customerHandle: '628121456634162',    status: 'Read' },
  { id: 8,  sentTime: '2 Sep 2022, 08:10',  broadcastName: 'Promo harbolnas 2023', templateName: 'harbolnas 2023', templateCategory: 'Marketing',      channelName: 'Central Perk HR',       channelNumber: '62857555860', customerName: 'Josafat Bambang Suryadi',customerHandle: '-',                  status: 'Failed' },
  { id: 9,  sentTime: '9 Apr 2022, 09:44',  broadcastName: 'Promo harbolnas 2023', templateName: 'harbolnas 2023', templateCategory: 'Marketing',      channelName: 'Central Perk HR',       channelNumber: '62857555860', customerName: 'Moch Habibi Mahfud',     customerHandle: '628121456634433',    status: 'Delivered' },
  { id: 10, sentTime: '11 Nov 2022, 01:10', broadcastName: 'OTP',                  templateName: 'otp_password',   templateCategory: 'Authentication', channelName: 'Central Perk Official', channelNumber: '62857555860', customerName: 'Auliana Fitri',          customerHandle: 'aulianaf',           status: 'Failed' },
]


// --- Pagination ---
const rowsPerPage = ref('10')
const currentPage = ref(1)
const totalRows = 242

const totalPages = computed(() => Math.ceil(totalRows / Number(rowsPerPage.value)))
const showingStart = computed(() => (currentPage.value - 1) * Number(rowsPerPage.value) + 1)
const showingEnd = computed(() => Math.min(currentPage.value * Number(rowsPerPage.value), totalRows))
const currentPageStr = computed({
  get: () => String(currentPage.value),
  set: (v) => { currentPage.value = Number(v) },
})
</script>
