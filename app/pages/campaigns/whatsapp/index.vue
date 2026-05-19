<template>
  <div :class="pageClass">
    <MpFlex direction="column">

      <!-- Tabs -->
      <MpTabs id="campaign-tabs" v-model="currentTab" is-manual :is-show-border="false">
        <MpTabList :class="css({ px: '6', pb: '0', '& .mp-tab-list__list': { marginBottom: '0', paddingBottom: '0' } })">
          <MpTab>One-time campaign</MpTab>
          <MpTab>Recurring campaign</MpTab>
        </MpTabList>

        <MpTabPanels :class="css({ p: '0' })">
          <MpTabPanel>
            <div :class="css({ bg: 'background.stage', borderTopLeftRadius: 'md' })" :style="{ borderTop: '1px solid var(--mp-colors-border-default)', borderLeft: '1px solid var(--mp-colors-border-default)' }">
            <MpFlex direction="column" gap="4" p="6">

              <!-- Section header -->
              <MpFlex direction="column" gap="1">
                <MpText size="h2" weight="semiBold">One time campaign</MpText>
                <MpFlex gap="1" alignItems="center">
                  <MpText size="body" color="text.secondary">
                    Reach your customers by sending one-time WhatsApp campaign.
                  </MpText>
                  <MpText size="body" :class="css({ color: 'blue.600', cursor: 'pointer', _hover: { textDecoration: 'underline' } })">
                    Learn more
                  </MpText>
                </MpFlex>
              </MpFlex>

              <!-- Filter bar -->
              <MpFlex gap="3" alignItems="center">
                <div style="width: 240px; flex-shrink: 0">
                  <MpSelect v-model="categoryFilter" id="category-filter" placeholder="All categories" is-clearable>
                    <option value="marketing">Marketing</option>
                    <option value="utility">Utility</option>
                    <option value="authentication">Authentication</option>
                  </MpSelect>
                </div>

                <div style="width: 240px; flex-shrink: 0">
                  <MpSelect v-model="statusFilter" id="status-filter" placeholder="All status" is-clearable>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In progress</option>
                    <option value="partially_completed">Partially completed</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="canceled">Canceled</option>
                    <option value="stopped">Stopped - WhatsApp</option>
                    <option value="insufficient_balance">Insufficient balance</option>
                  </MpSelect>
                </div>

                <MpFlex flexGrow="1" justifyContent="flex-end">
                  <div style="width: 240px">
                    <MpInput
                      id="search-campaign"
                      v-model="searchQuery"
                      placeholder="Search campaign name"
                      left-icon="search"
                    />
                  </div>
                </MpFlex>
              </MpFlex>

              <!-- Table -->
              <div ref="tableContainerRef">
              <MpTableContainer>
                <MpTable is-hoverable>
                  <MpTableHead>
                    <MpTableRow>
                      <MpTableCell as="th">
                        <MpText size="label" weight="semiBold">Campaign name</MpText>
                      </MpTableCell>
                      <MpTableCell as="th">
                        <MpText size="label" weight="semiBold">Message template</MpText>
                      </MpTableCell>
                      <MpTableCell as="th">
                        <MpText size="label" weight="semiBold">Template category</MpText>
                      </MpTableCell>
                      <MpTableCell as="th">
                        <MpText size="label" weight="semiBold">Status</MpText>
                      </MpTableCell>
                      <MpTableCell as="th">
                        <MpText size="label" weight="semiBold">Recipient</MpText>
                      </MpTableCell>
                      <MpTableCell as="th">
                        <MpText size="label" weight="semiBold">Delivered</MpText>
                      </MpTableCell>
                      <MpTableCell as="th" :style="{ position: 'sticky', right: '0', background: 'var(--mp-colors-background-surface)', boxShadow: 'var(--mp-shadows-xs)', borderLeft: isTableOverflowing ? '1px solid var(--mp-colors-border-default)' : 'none' }" />
                    </MpTableRow>
                  </MpTableHead>

                  <MpTableBody>
                    <MpTableRow v-for="row in paginatedData" :key="row.id">
                      <MpTableCell as="td">
                        <MpText size="label" :class="css({ cursor: 'pointer', _hover: { color: 'text.link', textDecoration: 'underline' } })" @click="router.push(`/campaigns/whatsapp/${row.id}`)">{{ row.name }}</MpText>
                      </MpTableCell>
                      <MpTableCell as="td">
                        <MpText size="label">{{ row.template }}</MpText>
                      </MpTableCell>
                      <MpTableCell as="td">
                        <MpText size="label">{{ row.category }}</MpText>
                      </MpTableCell>
                      <MpTableCell as="td">
                        <MpBadge for="tableStatus" :type="statusVariant(row.status)">{{ row.status }}</MpBadge>
                      </MpTableCell>
                      <MpTableCell as="td">
                        <MpText size="label">{{ row.recipient.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}</MpText>
                      </MpTableCell>
                      <MpTableCell as="td">
                        <MpText size="label">{{ row.delivered.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') }}</MpText>
                      </MpTableCell>
                      <MpTableCell as="td" :style="{ position: 'sticky', right: '0', background: 'var(--mp-colors-background-stage)', boxShadow: 'var(--mp-shadows-xs)', borderLeft: isTableOverflowing ? '1px solid var(--mp-colors-border-default)' : 'none' }">
                        <MpButton variant="secondary" right-icon="chevrons-down" size="md">Actions</MpButton>
                      </MpTableCell>
                    </MpTableRow>
                  </MpTableBody>
                </MpTable>
              </MpTableContainer>
              </div>

              <!-- Pagination -->
              <MpFlex justifyContent="space-between" alignItems="center">
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

            </MpFlex>
            </div>
          </MpTabPanel>

          <MpTabPanel>
            <div :class="css({ bg: 'background.stage', borderTopLeftRadius: 'md' })" :style="{ borderTop: '1px solid var(--mp-colors-border-default)', borderLeft: '1px solid var(--mp-colors-border-default)' }">
            <MpFlex direction="column" gap="4" p="6">
              <MpText size="h2" weight="semiBold">Recurring campaign</MpText>
              <MpText size="body" color="text.secondary">No recurring campaigns yet.</MpText>
            </MpFlex>
            </div>
          </MpTabPanel>
        </MpTabPanels>
      </MpTabs>

    </MpFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCampaigns } from '~/composables/useCampaigns'
import {
  css,
  MpFlex,
  MpText,
  MpSelect,
  MpInput,
  MpTabs,
  MpTabList,
  MpTab,
  MpTabPanels,
  MpTabPanel,
  MpBadge,
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
  pageTitle: 'WhatsApp',
  pageActionLabel: 'Create campaign',
  pageActionVariant: 'primary',
  pageActionRoute: '/campaigns/whatsapp/create',
})

const router = useRouter()
const pageClass = css({ flexGrow: '1' })

// --- Sticky column overflow detection ---
const tableContainerRef = ref<HTMLElement | null>(null)
const isTableOverflowing = ref(false)

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  const wrapper = tableContainerRef.value as HTMLElement | null
  if (!wrapper) return
  const el = wrapper.querySelector('[data-pixel-component="MpTableContainer"]') ?? wrapper
  const check = () => { isTableOverflowing.value = el.scrollWidth > el.clientWidth }
  check()
  resizeObserver = new ResizeObserver(check)
  resizeObserver.observe(el)
})

onUnmounted(() => { resizeObserver?.disconnect() })

// --- Tabs ---
const currentTab = ref(0)

// --- Filters ---
const categoryFilter = ref<string | undefined>(undefined)
const statusFilter = ref<string | undefined>(undefined)
const searchQuery = ref('')

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

// --- Table data ---
const { campaigns: tableData } = useCampaigns()

// --- Pagination ---
const rowsPerPage = ref('10')
const currentPage = ref(1)
const totalRows = computed(() => tableData.length)
const totalPages = computed(() => Math.ceil(totalRows.value / Number(rowsPerPage.value)))
const showingStart = computed(() => (currentPage.value - 1) * Number(rowsPerPage.value) + 1)
const showingEnd = computed(() => Math.min(currentPage.value * Number(rowsPerPage.value), totalRows.value))
const paginatedData = computed(() =>
  tableData.slice(
    (currentPage.value - 1) * Number(rowsPerPage.value),
    currentPage.value * Number(rowsPerPage.value)
  )
)
const currentPageStr = computed({
  get: () => String(currentPage.value),
  set: (v) => { currentPage.value = Number(v) },
})
</script>
