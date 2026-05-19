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
          <!-- One-time campaign panel -->
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
                      <MpTableCell as="th" />
                    </MpTableRow>
                  </MpTableHead>

                  <MpTableBody>
                    <MpTableRow v-for="row in paginatedData" :key="row.id">
                      <MpTableCell as="td">
                        <MpText size="label" :class="css({ cursor: 'pointer', _hover: { color: 'text.link', textDecoration: 'underline' } })">{{ row.name }}</MpText>
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
                        <MpText size="label">{{ row.recipient.toLocaleString('id-ID') }}</MpText>
                      </MpTableCell>
                      <MpTableCell as="td">
                        <MpText size="label">{{ row.delivered.toLocaleString('id-ID') }}</MpText>
                      </MpTableCell>
                      <MpTableCell as="td">
                        <MpButton variant="secondary" right-icon="chevrons-down" size="md">Actions</MpButton>
                      </MpTableCell>
                    </MpTableRow>
                  </MpTableBody>
                </MpTable>
              </MpTableContainer>

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

          <!-- Recurring campaign panel -->
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
import { ref, computed } from 'vue'
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

const pageClass = css({ flexGrow: '1' })

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
const tableData = [
  { id: 1,  name: 'promo akhir tahun',    template: 'promo_akhir_tahun',       category: 'Marketing', status: 'Scheduled',            recipient: 24256, delivered: 22120 },
  { id: 2,  name: 'corporate nitiative',  template: 'corporate_initiative',    category: 'Marketing', status: 'In progress',          recipient: 5559,  delivered: 5800  },
  { id: 3,  name: 'corporate nitiative',  template: 'influencer_instagram',    category: 'Marketing', status: 'Partially completed',  recipient: 2228,  delivered: 4400  },
  { id: 4,  name: 'influencer nstagram',  template: 'knowledge_exchange',      category: 'Marketing', status: 'Stopped - WhatsApp',   recipient: 7545,  delivered: 1300  },
  { id: 5,  name: 'knowledge exchange',   template: 'clearance_event',         category: 'Marketing', status: 'Insufficient balance', recipient: 4688,  delivered: 7300  },
  { id: 6,  name: 'clearance event',      template: 'industry_advancement',    category: 'Marketing', status: 'Failed',               recipient: 3697,  delivered: 9200  },
  { id: 7,  name: 'industry advancement', template: 'global_conference',       category: 'Marketing', status: 'Canceled',             recipient: 2473,  delivered: 8800  },
  { id: 8,  name: 'global conference',    template: 'limited_time_offer',      category: 'Utility',   status: 'Completed',            recipient: 1005,  delivered: 8100  },
  { id: 9,  name: 'limited time_offer',   template: 'loyalty_rewards',         category: 'Auth',      status: 'Completed',            recipient: 4297,  delivered: 4200  },
  { id: 10, name: 'loyalty rewards',      template: 'professional_development',category: 'Marketing', status: 'Completed',            recipient: 7873,  delivered: 4200  },
  { id: 11, name: 'flash sale november',  template: 'flash_sale_nov',          category: 'Marketing', status: 'Scheduled',            recipient: 3100,  delivered: 0     },
  { id: 12, name: 'year end promo',       template: 'year_end_promo',          category: 'Utility',   status: 'In progress',          recipient: 1500,  delivered: 600   },
  { id: 13, name: 'customer survey',      template: 'customer_survey',         category: 'Marketing', status: 'Completed',            recipient: 2000,  delivered: 1900  },
  { id: 14, name: 'product launch',       template: 'product_launch',          category: 'Marketing', status: 'Failed',               recipient: 800,   delivered: 0     },
  { id: 15, name: 'otp verification',     template: 'otp_verify',              category: 'Auth',      status: 'Completed',            recipient: 12000, delivered: 11900 },
]

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
