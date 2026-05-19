<template>
  <div :class="pageClass">
    <MpFlex
      direction="column"
      gap="6"
      p="6"
      :class="css({ bg: 'background.stage', flexGrow: '1', borderTopLeftRadius: 'md' })"
      :style="{ borderTop: '1px solid var(--mp-colors-border-default)', borderLeft: '1px solid var(--mp-colors-border-default)' }"
    >

      <!-- Campaign information -->
      <MpFlex direction="column" pb="2">
        <MpText size="h2" weight="semiBold" :class="css({ pb: '3' })">Campaign information</MpText>
        <MpFlex gap="6" alignItems="flex-start" :style="{ width: '100%' }">

          <!-- Left column -->
          <MpFlex direction="column" :style="{ flex: '1' }">
            <MpFlex v-for="row in leftRows" :key="row.label" alignItems="flex-start">
              <!-- Label cell -->
              <MpFlex direction="column" gap="1" alignItems="flex-start" :style="{ width: '192px', flexShrink: '0' }">
                <MpFlex gap="1" alignItems="flex-start" py="2">
                  <MpText size="label" color="text.secondary">{{ row.label }}</MpText>
                </MpFlex>
              </MpFlex>
              <!-- Value cell -->
              <MpFlex direction="column" gap="1" alignItems="flex-start" :style="{ flex: '1' }">
                <MpFlex gap="1" alignItems="flex-start" py="2">
                  <MpBadge v-if="row.badge" for="additionalInformation" :type="row.badgeType">{{ row.value }}</MpBadge>
                  <MpFlex v-else-if="row.sub" direction="column">
                    <MpFlex gap="1" alignItems="baseline">
                      <MpText size="label">{{ row.value }}</MpText>
                      <MpText v-if="row.valueSuffix" size="label" color="text.secondary">{{ row.valueSuffix }}</MpText>
                    </MpFlex>
                    <MpText size="label-small" color="text.secondary">{{ row.sub }}</MpText>
                  </MpFlex>
                  <MpText v-else size="label">{{ row.value }}</MpText>
                </MpFlex>
              </MpFlex>
            </MpFlex>
          </MpFlex>

          <!-- Right column -->
          <MpFlex direction="column" :style="{ flex: '1' }">
            <MpFlex v-for="row in rightRows" :key="row.label" alignItems="flex-start">
              <MpFlex direction="column" gap="1" alignItems="flex-start" :style="{ width: '192px', flexShrink: '0' }">
                <MpFlex gap="1" alignItems="flex-start" py="2">
                  <MpText size="label" color="text.secondary">{{ row.label }}</MpText>
                </MpFlex>
              </MpFlex>
              <MpFlex direction="column" gap="1" alignItems="flex-start" :style="{ flex: '1' }">
                <MpFlex gap="1" alignItems="flex-start" py="2">
                  <MpFlex v-if="row.sub" direction="column">
                    <MpText size="label">{{ row.value }}</MpText>
                    <MpText size="label-small" color="text.secondary">{{ row.sub }}</MpText>
                  </MpFlex>
                  <MpText v-else size="label">{{ row.value }}</MpText>
                </MpFlex>
              </MpFlex>
            </MpFlex>
          </MpFlex>

        </MpFlex>
      </MpFlex>

      <!-- Campaign statistics -->
      <MpFlex direction="column" alignItems="flex-start">
        <MpText size="h2" weight="semiBold">Campaign statistics</MpText>
        <MpFlex :style="{ height: '12px' }" />
        <!-- Stats Bar: outer bordered container -->
        <MpFlex
          gap="2"
          p="4"
          alignItems="center"
          justifyContent="center"
          :style="{
            width: '100%',
            border: '1px solid var(--mp-colors-border-default)',
            borderRadius: '6px',
          }"
        >
          <!-- Each stat item -->
          <MpFlex
            v-for="stat in statistics"
            :key="stat.label"
            gap="4"
            alignItems="center"
            p="4"
            :class="css({ bg: 'background.neutral', borderRadius: 'md', flex: '1' })"
          >
            <MpFlex direction="column" alignItems="flex-start" :style="{ flex: '1' }">
              <MpText size="label" color="text.secondary">{{ stat.label }}</MpText>
              <MpFlex gap="2" alignItems="center">
                <!-- Double-check icon (custom SVG from Figma, color via --fill-0) -->
                <svg
                  v-if="stat.icon === 'double-check'"
                  width="20" height="20"
                  viewBox="0 0 14.8328 15.7393"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  :style="{ flexShrink: '0' }"
                >
                  <path d="M13.5301 4.48226C13.81 4.17697 14.2844 4.15656 14.5897 4.43636C14.8949 4.71626 14.9154 5.19063 14.6356 5.49593L5.46959 15.4959C5.33139 15.6467 5.13695 15.7346 4.93248 15.7391C4.72822 15.7434 4.53112 15.6638 4.38658 15.5194L0.219589 11.3524C-0.0731419 11.0595 -0.0732504 10.5847 0.219589 10.2918C0.512443 9.99918 0.987291 9.99916 1.28014 10.2918L4.89244 13.9041L13.5301 4.48226Z" :fill="stat.iconColor" />
                  <path d="M13.5301 0.243001C13.81 -0.0622607 14.2844 -0.082568 14.5897 0.197102C14.895 0.476997 14.9155 0.951333 14.6356 1.25667L5.46959 11.2567C5.33137 11.4073 5.13689 11.4954 4.93248 11.4998C4.72829 11.5041 4.53105 11.4245 4.38658 11.2801L0.219589 7.11312C-0.0729391 6.82028 -0.0729866 6.34538 0.219589 6.05257C0.512397 5.75994 0.987273 5.76002 1.28014 6.05257L4.89244 9.66488L13.5301 0.243001Z" :fill="stat.iconColor" />
                </svg>
                <!-- Standard Pixel icons -->
                <MpIcon v-else-if="stat.icon" :name="stat.icon" size="sm" :color="stat.iconColor" />
                <MpText size="h2" weight="semiBold" color="text.link">{{ stat.display }}</MpText>
              </MpFlex>
            </MpFlex>
          </MpFlex>
        </MpFlex>
      </MpFlex>

      <!-- Campaign logs -->
      <MpFlex direction="column" gap="4">
        <MpText size="h2" weight="semiBold">Campaign logs</MpText>

        <MpTableContainer>
          <MpTable is-hoverable>
            <MpTableHead>
              <MpTableRow>
                <MpTableCell as="th"><MpText size="label" weight="semiBold">Customer name</MpText></MpTableCell>
                <MpTableCell as="th"><MpText size="label" weight="semiBold">Customer number</MpText></MpTableCell>
                <MpTableCell as="th"><MpText size="label" weight="semiBold">Sent date</MpText></MpTableCell>
                <MpTableCell as="th"><MpText size="label" weight="semiBold">Send status</MpText></MpTableCell>
                <MpTableCell as="th" />
              </MpTableRow>
            </MpTableHead>
            <MpTableBody>
              <MpTableRow v-for="log in paginatedLogs" :key="log.id">
                <MpTableCell as="td"><MpText size="label">{{ log.name }}</MpText></MpTableCell>
                <MpTableCell as="td"><MpText size="label">{{ log.phone }}</MpText></MpTableCell>
                <MpTableCell as="td"><MpText size="label">{{ log.sentDate }}</MpText></MpTableCell>
                <MpTableCell as="td">
                  <MpBadge for="tableStatus" :type="logStatusVariant(log.status)">{{ log.status }}</MpBadge>
                </MpTableCell>
                <MpTableCell as="td">
                  <MpButton variant="secondary" size="md">View message</MpButton>
                </MpTableCell>
              </MpTableRow>
            </MpTableBody>
          </MpTable>
        </MpTableContainer>

        <!-- Pagination -->
        <MpFlex justifyContent="space-between" alignItems="center">
          <MpFlex gap="2" alignItems="center">
            <MpText size="body-small" color="text.secondary">Show per page</MpText>
            <MpSelect v-model="rowsPerPage" id="log-rows-per-page" size="sm" :style="{ width: '72px' }">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </MpSelect>
          </MpFlex>
          <MpFlex gap="3" alignItems="center">
            <MpText size="body-small" color="text.secondary">
              {{ showingStart }}-{{ showingEnd }} of {{ totalLogs }}
            </MpText>
            <MpFlex gap="2" alignItems="center">
              <MpButton variant="ghost" left-icon="chevron-left" size="sm" aria-label="Previous" :is-disabled="currentPage <= 1" @click="currentPage--" />
              <MpFlex gap="1" alignItems="center">
                <MpSelect v-model="currentPageStr" id="log-page-select" size="sm" :style="{ width: '60px' }">
                  <option v-for="p in totalPages" :key="p" :value="String(p)">{{ p }}</option>
                </MpSelect>
                <MpText size="body-small" color="text.secondary">of {{ totalPages }} pages</MpText>
              </MpFlex>
              <MpButton variant="ghost" left-icon="chevron-right" size="sm" aria-label="Next" :is-disabled="currentPage >= totalPages" @click="currentPage++" />
            </MpFlex>
          </MpFlex>
        </MpFlex>
      </MpFlex>

    </MpFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useCampaigns } from '~/composables/useCampaigns'
import {
  css,
  MpFlex,
  MpText,
  MpBadge,
  MpIcon,
  MpSelect,
  MpButton,
  MpTableContainer,
  MpTable,
  MpTableHead,
  MpTableBody,
  MpTableRow,
  MpTableCell,
} from '@mekari/pixel3'

definePageMeta({
  layout: 'default',
  pageTitle: 'Campaign details',
  hidePageAction: true,
  pageBreadcrumb: {
    label: 'WhatsApp',
    route: '/campaigns/whatsapp',
  },
})

const route = useRoute()
const pageClass = css({ flexGrow: '1' })

function formatNumber(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

const { findById } = useCampaigns()
const campaign = computed(() => findById(route.params.id as string))

// --- Status badge ---
type BadgeVariant = 'information' | 'warning' | 'announcement' | 'critical' | 'completed'

function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    'Scheduled':            'information',
    'In progress':          'warning',
    'Partially completed':  'announcement',
    'Stopped - WhatsApp':   'critical',
    'Insufficient balance': 'critical',
    'Failed':               'critical',
    'Canceled':             'critical',
    'Completed':            'completed',
  }
  return map[status] ?? 'announcement'
}

// --- Campaign information ---
const leftRows = computed(() => {
  const c = campaign.value
  if (!c) return []
  return [
    { label: 'Campaign name', value: c.name },
    { label: 'Status',        value: c.status, badge: true, badgeType: statusVariant(c.status) },
    { label: 'Audience',      value: c.audience, valueSuffix: c.audienceSuffix, sub: c.audienceSub },
    { label: 'Integration',   value: c.integration },
  ]
})

const rightRows = computed(() => {
  const c = campaign.value
  if (!c) return []
  return [
    { label: 'Template message', value: c.template },
    { label: 'Created by',       value: c.createdBy },
    { label: 'Created at',       value: c.createdAt, sub: c.createdAtSub },
  ]
})

// --- Campaign statistics ---
const statistics = computed(() => {
  const c = campaign.value
  if (!c) return []
  const s = c.stats
  return [
    { label: 'Read',      icon: 'double-check',    iconColor: 'var(--mp-colors-chart-cat01-bold)', display: formatNumber(s.read),      value: s.read      },
    { label: 'Delivered', icon: 'double-check',    iconColor: 'var(--mp-colors-icon-default)',     display: formatNumber(s.delivered), value: s.delivered },
    { label: 'Sent',      icon: 'check',           iconColor: 'icon.default',                      display: formatNumber(s.sent),      value: s.sent      },
    { label: 'Pending',   icon: 'time',            iconColor: 'icon.default',                      display: formatNumber(s.pending),   value: s.pending   },
    { label: 'Failed',    icon: 'warning-circular', iconColor: 'icon.danger',                      display: formatNumber(s.failed),    value: s.failed    },
  ]
})

// --- Campaign logs ---
type LogStatus = 'Delivered' | 'Sent' | 'Pending' | 'Failed'

function logStatusVariant(status: LogStatus): BadgeVariant {
  const map: Record<LogStatus, BadgeVariant> = {
    Delivered: 'completed',
    Sent:      'information',
    Pending:   'warning',
    Failed:    'critical',
  }
  return map[status] ?? 'information'
}

const logs = [
  { id: 1,  name: 'Desy Stefany Fatri',    phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 2,  name: 'Nasrudin',              phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 3,  name: 'Muhammad Syalir',       phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 4,  name: 'Aryo Agung Berandi',    phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 5,  name: 'Albert Marbehasta',     phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 6,  name: 'Eko Sudaryanto',        phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 7,  name: 'Moch Habib Mahfud',     phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 8,  name: 'Hedi Kusnadi',          phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 9,  name: 'Agus Yiama Diansjah',   phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 10, name: 'Rizki Agung Wawana',    phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 11, name: 'Budi Santoso',          phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Sent'      as LogStatus },
  { id: 12, name: 'Siti Rahayu',           phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Pending'   as LogStatus },
  { id: 13, name: 'Ahmad Fauzi',           phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 14, name: 'Dewi Kusuma',           phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Failed'    as LogStatus },
  { id: 15, name: 'Rendi Prasetyo',        phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 16, name: 'Ika Wahyuni',           phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
  { id: 17, name: 'Firman Hidayat',        phone: '081281605043X', sentDate: '5 Nov 2024, 08:00', status: 'Delivered' as LogStatus },
]

const rowsPerPage = ref('10')
const currentPage = ref(1)
const totalLogs = computed(() => logs.length)
const totalPages = computed(() => Math.ceil(totalLogs.value / Number(rowsPerPage.value)))
const showingStart = computed(() => (currentPage.value - 1) * Number(rowsPerPage.value) + 1)
const showingEnd = computed(() => Math.min(currentPage.value * Number(rowsPerPage.value), totalLogs.value))
const paginatedLogs = computed(() =>
  logs.slice(
    (currentPage.value - 1) * Number(rowsPerPage.value),
    currentPage.value * Number(rowsPerPage.value)
  )
)
const currentPageStr = computed({
  get: () => String(currentPage.value),
  set: (v) => { currentPage.value = Number(v) },
})
</script>
