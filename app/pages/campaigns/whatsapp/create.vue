<template>
  <div :class="pageClass">
    <MpFlex direction="column" gap="4" :class="css({ bg: 'background.stage', flexGrow: '1', borderTopLeftRadius: 'md' })" :style="{ borderTop: '1px solid var(--mp-colors-border-default)', borderLeft: '1px solid var(--mp-colors-border-default)' }">

      <!-- Banner -->
      <MpBanner v-if="showBanner" variant="info" :class="css({ mx: '6', mt: '6' })">
        <MpBannerIcon />
        <MpBannerTitle>New feature: Meta Marketing Messages Lite API</MpBannerTitle>
        <MpBannerDescription>
          Boost WhatsApp campaign delivery and reliability with new Meta API, built for higher reach, smarter targeting, and better conversions.
        </MpBannerDescription>
        <MpBannerLink id="banner-link-wtm">
          <MpText as="a" href="#" target="_blank" color="text.link" is-text-link>Get started</MpText>
          <MpText as="a" href="#" target="_blank" color="text.link" is-text-link>Learn more</MpText>
        </MpBannerLink>
        <MpBannerCloseButton @click="showBanner = false" />
      </MpBanner>

      <!-- 12-column grid: left 7 | spacer 1 | right 4 -->
      <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '24px', padding: '0 24px 24px' }">

        <!-- Left: columns 1–7 -->
        <MpFlex direction="column" gap="8" :style="{ gridColumn: '1 / 8', minWidth: '0' }">

          <!-- Campaign setup -->
          <MpFlex direction="column" gap="6">
            <MpText size="h2" weight="semiBold">Campaign setup</MpText>

            <!-- Campaign name: full 7 cols -->
            <MpFormControl id="campaign-name" is-required>
              <MpFormLabel>Campaign name</MpFormLabel>
              <MpInput v-model="form.campaignName" id="campaign-name-input" placeholder="Enter campaign name" />
            </MpFormControl>

            <!-- Sender -->
            <MpFormControl id="sender" is-required>
              <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '24px', alignItems: 'flex-start' }">
                <div :style="{ gridColumn: '1 / 4', minWidth: '240px', maxWidth: '280px' }">
                  <MpFormLabel>Sender</MpFormLabel>
                  <div :style="{ position: 'relative' }" v-click-outside="() => showSenderDropdown = false">
                    <MpSelect v-model="form.sender" id="sender-select" placeholder="Select sender" is-clearable>
                      <option value="sender_a">Central Perk Indonesia</option>
                      <option value="sender_b">Central Perk Support</option>
                    </MpSelect>
                    <!-- Split overlay: full when empty, text+arrow areas when value set (to allow clear button) -->
                    <div v-if="!form.sender"
                      :style="{ position: 'absolute', inset: '0', cursor: 'pointer', zIndex: '2' }"
                      @click="showSenderDropdown = !showSenderDropdown"
                    />
                    <template v-else>
                      <div :style="{ position: 'absolute', top: '0', bottom: '0', left: '0', right: '3.5rem', cursor: 'pointer', zIndex: '2' }" @click="showSenderDropdown = !showSenderDropdown" />
                      <div :style="{ position: 'absolute', top: '0', bottom: '0', right: '0', width: '1.75rem', cursor: 'pointer', zIndex: '2' }" @click="showSenderDropdown = !showSenderDropdown" />
                    </template>
                    <div v-if="showSenderDropdown" :style="{
                      position: 'absolute', top: 'calc(100% + 4px)', left: '0', right: '0', zIndex: '100',
                      backgroundColor: 'var(--mp-colors-background-stage)',
                      border: '1px solid var(--mp-colors-border-bold)',
                      borderRadius: '6px',
                      boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)',
                      padding: '8px 0',
                    }">
                      <div
                        v-for="sender in senders"
                        :key="sender.value"
                        @click="selectSender(sender)"
                        @mouseenter="hoveredSender = sender.value"
                        @mouseleave="hoveredSender = null"
                        :style="{
                          padding: '8px 12px', cursor: 'pointer',
                          backgroundColor: hoveredSender === sender.value ? 'var(--mp-colors-background-neutral-hovered)' : 'transparent',
                        }"
                      >
                        <MpText size="label">{{ sender.name }}</MpText>
                        <MpText size="label-small" color="text.secondary">{{ sender.phone }}</MpText>
                      </div>
                    </div>
                  </div>
                </div>
                <MpFlex v-if="form.sender" direction="column" gap="1" :style="{ gridColumn: '4 / 6', alignItems: 'flex-start' }">
                  <MpText size="label" weight="semiBold">Status</MpText>
                  <MpBadge for="tableStatus" type="completed" size="md">Connected</MpBadge>
                </MpFlex>
                <MpFlex v-if="form.sender" direction="column" gap="1" :style="{ gridColumn: '6 / 8', alignItems: 'flex-start' }">
                  <MpText size="label" weight="semiBold">Rating quality</MpText>
                  <MpBadge for="tableStatus" type="completed" size="md">High</MpBadge>
                </MpFlex>
              </div>
            </MpFormControl>

            <!-- Audience -->
            <MpFormControl id="audience" is-required>
              <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '24px', alignItems: 'flex-start' }">
                <div :style="{ gridColumn: '1 / 4', minWidth: '240px', maxWidth: '280px' }">
                  <MpFormLabel>Audience</MpFormLabel>
                  <div :style="{ position: 'relative' }" v-click-outside="closeAudienceDropdown">
                    <!-- MpSelect for visual appearance -->
                    <MpSelect v-model="form.audience" id="audience-select" placeholder="Select audience" is-clearable>
                      <option v-for="list in recipientLists" :key="list.value" :value="list.value">{{ list.name }}</option>
                      <option v-for="seg in customerSegments" :key="seg.value" :value="seg.value">{{ seg.name }}</option>
                    </MpSelect>
                    <!-- Split overlay: full when empty, text+arrow when value set (allows clear button) -->
                    <div v-if="!form.audience"
                      :style="{ position: 'absolute', inset: '0', cursor: 'pointer', zIndex: '2' }"
                      @click="showAudienceDropdown = !showAudienceDropdown"
                    />
                    <template v-else>
                      <div :style="{ position: 'absolute', top: '0', bottom: '0', left: '0', right: '3.5rem', cursor: 'pointer', zIndex: '2' }" @click="showAudienceDropdown = !showAudienceDropdown" />
                      <div :style="{ position: 'absolute', top: '0', bottom: '0', right: '0', width: '1.75rem', cursor: 'pointer', zIndex: '2' }" @click="showAudienceDropdown = !showAudienceDropdown" />
                    </template>
                    <!-- Level 1: audience type -->
                    <div
                      v-if="showAudienceDropdown"
                      :style="{
                        position: 'absolute', top: 'calc(100% + 4px)', left: '0', zIndex: '100',
                        width: '280px',
                        backgroundColor: 'var(--mp-colors-background-stage)',
                        border: '1px solid var(--mp-colors-border-bold)',
                        borderRadius: '6px',
                        boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)',
                        padding: '8px 0',
                      }"
                    >
                      <div
                        @click.stop="audienceType = 'recipient'"
                        :style="{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 12px', cursor: 'pointer',
                          backgroundColor: audienceType === 'recipient' ? 'var(--mp-colors-background-neutral-hovered)' : 'transparent',
                        }"
                      >
                        <MpText size="label" :style="{ flex: '1' }">From recipient lists</MpText>
                        <MpIcon name="chevrons-right" size="sm" color="icon.default" />
                      </div>
                      <div
                        @click.stop="audienceType = 'segment'"
                        :style="{
                          display: 'flex', alignItems: 'center', gap: '8px',
                          padding: '8px 12px', cursor: 'pointer',
                          backgroundColor: audienceType === 'segment' ? 'var(--mp-colors-background-neutral-hovered)' : 'transparent',
                        }"
                      >
                        <MpText size="label" :style="{ flex: '1' }">From customer segments</MpText>
                        <MpBadge for="additionalInformation" type="critical" size="sm">NEW</MpBadge>
                        <MpIcon name="chevrons-right" size="sm" color="icon.default" />
                      </div>

                      <!-- Level 2: customer segments (cascades right) -->
                      <div
                        v-if="audienceType === 'segment'"
                        :style="{
                          position: 'absolute', top: '0', left: 'calc(100% + 4px)', zIndex: '101',
                          width: '320px',
                          backgroundColor: 'var(--mp-colors-background-stage)',
                          border: '1px solid var(--mp-colors-border-bold)',
                          borderRadius: '6px',
                          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)',
                        }"
                      >
                        <div :style="{ padding: '12px 12px 8px' }">
                          <div :style="{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 12px',
                            border: '1px solid rgba(29,31,36,0.16)',
                            borderRadius: '6px',
                            backgroundColor: 'var(--mp-colors-background-neutral)',
                          }">
                            <MpIcon name="search" size="sm" color="icon.subtle" />
                            <input
                              v-model="segmentSearch"
                              placeholder="Search customer segments"
                              :style="{
                                flex: '1', border: 'none', outline: 'none', background: 'transparent',
                                fontSize: '14px', color: 'var(--mp-colors-text-default)', fontFamily: 'inherit',
                              }"
                              @click.stop
                            />
                          </div>
                        </div>
                        <div v-if="filteredCustomerSegments.length > 0" :style="{ maxHeight: '220px', overflowY: 'auto', paddingBottom: '8px' }">
                          <div
                            v-for="seg in filteredCustomerSegments"
                            :key="seg.value"
                            @click.stop="!seg.disabled && selectAudience(seg)"
                            @mouseenter="!seg.disabled && (hoveredAudience = seg.value)"
                            @mouseleave="hoveredAudience = null"
                            :style="{
                              display: 'flex', alignItems: 'center', gap: '8px',
                              padding: '8px 12px',
                              cursor: seg.disabled ? 'not-allowed' : 'pointer',
                              backgroundColor: seg.disabled
                                ? 'var(--mp-colors-background-disabled)'
                                : hoveredAudience === seg.value ? 'var(--mp-colors-background-neutral-hovered)' : 'transparent',
                            }"
                          >
                            <MpText
                              size="label"
                              :style="{
                                flex: '1',
                                color: seg.disabled ? 'rgba(29,31,36,0.32)' : 'var(--mp-colors-text-default)',
                              }"
                            >{{ seg.name }}</MpText>
                            <MpText size="label-small" color="text.secondary">{{ seg.count }}</MpText>
                          </div>
                        </div>
                        <!-- Search not found -->
                        <div v-else-if="segmentSearch" :style="{ padding: '12px', paddingBottom: '20px' }">
                          <MpText size="body-small" color="text.secondary">"{{ segmentSearch }}" not found</MpText>
                        </div>
                        <!-- Empty state: no segments at all -->
                        <div v-else :style="{ padding: '8px 0 0' }">
                          <div :style="{ padding: '8px 12px' }">
                            <MpText size="label">You have no customer segment yet</MpText>
                            <MpText size="label-small" color="text.secondary">Created customer segment will appear here</MpText>
                          </div>
                          <div :style="{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            padding: '8px 12px',
                            borderTop: '1px solid var(--mp-colors-border-default)',
                            cursor: 'pointer',
                          }">
                            <MpIcon name="add" size="sm" color="icon.link" />
                            <MpText size="label" weight="semiBold" :style="{ color: 'var(--mp-colors-text-link)' }">Create segment</MpText>
                          </div>
                        </div>
                      </div>

                      <!-- Level 2: recipient list (cascades right) -->
                      <div
                        v-if="audienceType === 'recipient'"
                        :style="{
                          position: 'absolute', top: '0', left: 'calc(100% + 4px)', zIndex: '101',
                          width: '320px',
                          backgroundColor: 'var(--mp-colors-background-stage)',
                          border: '1px solid var(--mp-colors-border-bold)',
                          borderRadius: '6px',
                          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -2px rgba(0,0,0,0.05)',
                        }"
                      >
                        <div :style="{ padding: '12px 12px 8px' }">
                          <div :style="{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '8px 12px',
                            border: '1px solid rgba(29,31,36,0.16)',
                            borderRadius: '6px',
                            backgroundColor: 'var(--mp-colors-background-neutral)',
                          }">
                            <MpIcon name="search" size="sm" color="icon.subtle" />
                            <input
                              v-model="audienceSearch"
                              placeholder="Search recipient list"
                              :style="{
                                flex: '1', border: 'none', outline: 'none', background: 'transparent',
                                fontSize: '14px', color: 'var(--mp-colors-text-default)', fontFamily: 'inherit',
                              }"
                              @click.stop
                            />
                          </div>
                        </div>
                        <div v-if="filteredRecipientLists.length > 0" :style="{ maxHeight: '220px', overflowY: 'auto', paddingBottom: '8px' }">
                          <div
                            v-for="list in filteredRecipientLists"
                            :key="list.value"
                            @click.stop="selectAudience(list)"
                            @mouseenter="hoveredAudience = list.value"
                            @mouseleave="hoveredAudience = null"
                            :style="{
                              display: 'flex', alignItems: 'center', gap: '8px',
                              padding: '8px 12px', cursor: 'pointer',
                              backgroundColor: hoveredAudience === list.value ? 'var(--mp-colors-background-neutral-hovered)' : 'transparent',
                            }"
                          >
                            <MpText size="label" :style="{ flex: '1' }">{{ list.name }}</MpText>
                            <MpText size="label-small" color="text.secondary">{{ list.count }}</MpText>
                          </div>
                        </div>
                        <!-- Search not found -->
                        <div v-else :style="{ padding: '12px', paddingBottom: '20px' }">
                          <MpText size="body-small" color="text.secondary">"{{ audienceSearch }}" not found</MpText>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <MpFlex v-if="form.audience" direction="column" gap="1" :style="{ gridColumn: '4 / 8', alignItems: 'flex-start' }">
                  <MpText size="label" weight="semiBold">Estimated audience size</MpText>
                  <MpText v-if="(selectedAudience as any)?.total" size="body-small" color="text.secondary">
                    <span :style="{ color: 'var(--mp-colors-text-primary)', fontWeight: '600' }">{{ selectedAudience?.count }}</span>
                    customers in WhatsApp
                  </MpText>
                  <MpText v-else size="body-small" color="text.secondary">
                    <span :style="{ color: 'var(--mp-colors-text-primary)', fontWeight: '600' }">{{ selectedAudience?.count }}</span>
                    matched customers info have filled phone numbers.
                  </MpText>
                </MpFlex>
              </div>
            </MpFormControl>

            <!-- Message template -->
            <MpFormControl id="message-template" is-required>
              <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '24px', alignItems: 'flex-start' }">
                <div :style="{ gridColumn: '1 / 4', minWidth: '240px', maxWidth: '280px' }">
                  <MpFormLabel>Message template</MpFormLabel>
                  <MpSelect v-model="form.template" id="template-select" placeholder="Select message template" is-clearable>
                    <option value="promo_akhir_tahun">promo_akhir_tahun</option>
                    <option value="corporate_initiative">corporate_initiative</option>
                    <option value="loyalty_rewards">loyalty_rewards</option>
                    <option value="flash_sale_nov">flash_sale_nov</option>
                  </MpSelect>
                </div>
                <MpFlex v-if="form.template" direction="column" gap="1" :style="{ gridColumn: '4 / 8', alignItems: 'flex-start' }">
                  <MpText size="label" weight="semiBold">Template quality</MpText>
                  <MpBadge for="tableStatus" type="completed" size="md">High</MpBadge>
                </MpFlex>
              </div>
            </MpFormControl>
          </MpFlex>

          <!-- Content -->
          <MpFlex direction="column" gap="4">
            <MpText size="h2" weight="semiBold">Content</MpText>
            <div
              :class="css({ bg: 'background.surface', borderRadius: 'md' })"
              :style="{ padding: '20px', border: '1px solid var(--mp-colors-border-default)' }"
            >
              <MpFlex direction="column" gap="2">
                <MpText size="label" weight="semiBold">Message</MpText>
                <MpText size="body" color="text.secondary">Select a template to start</MpText>
              </MpFlex>
            </div>
          </MpFlex>

          <!-- Additional setup -->
          <MpFlex direction="column" gap="5" pb="4">
            <MpText size="h2" weight="semiBold" :style="{ paddingBottom: '16px' }">Additional setup</MpText>

            <MpFormControl id="campaign-assignment" :style="{ paddingBottom: '16px' }">
              <MpFormLabel>Campaign assignment</MpFormLabel>
              <MpCheckbox
                id="select-division"
                :is-checked="form.selectDivision"
                @change="(v: boolean) => form.selectDivision = v"
              >
                Select division
              </MpCheckbox>
            </MpFormControl>

            <MpFormControl id="sending-options">
              <MpFormLabel>Sending options</MpFormLabel>
              <MpFlex direction="column" gap="3">
                <MpRadio v-model="form.sendingOption" value="send_now" name="sending-option">Send now</MpRadio>
                <MpRadio v-model="form.sendingOption" value="send_later" name="sending-option">Send later</MpRadio>
                <MpRadio v-model="form.sendingOption" value="recurring" name="sending-option">Send as recurring campaign</MpRadio>
              </MpFlex>
            </MpFormControl>
          </MpFlex>

          <!-- Actions -->
          <MpFlex gap="3">
            <MpButton variant="ghost" @click="handleCancel">Cancel</MpButton>
            <MpButton variant="primary" @click="handleSend">Send campaign</MpButton>
          </MpFlex>

        </MpFlex>

        <!-- Right: columns 9–12 (column 8 = spacer) -->
        <MpFlex direction="column" gap="6" :style="{ gridColumn: '9 / 13' }">

          <!-- Balance -->
          <MpFlex direction="column" gap="1" :class="css({ bg: 'background.surface', p: '6', borderRadius: 'md' })">
            <MpText size="h2" weight="semiBold">Rp12.512.000</MpText>
            <MpText size="body-small" color="text.secondary">WhatsApp balance</MpText>
            <div :style="{ marginTop: '8px' }">
              <MpButton variant="secondary" size="sm">Top up</MpButton>
            </div>
          </MpFlex>

          <!-- Preview -->
          <MpFlex direction="column" gap="3">
            <MpFlex direction="column" gap="1">
              <MpText size="h2" weight="semiBold">Preview</MpText>
              <MpText size="body-small" color="text.secondary">
                See how your campaign will look like from your customer's side
              </MpText>
            </MpFlex>
            <div
              :style="{
                backgroundColor: '#ddd8ce',
                borderRadius: '8px',
                padding: '16px',
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }"
            >
              <div
                :style="{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px 0 8px 8px',
                  padding: '10px 12px',
                  maxWidth: '200px',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
                }"
              >
                <MpText size="body-small" color="text.secondary">Select a template to start</MpText>
                <MpFlex justifyContent="flex-end" :style="{ marginTop: '4px' }">
                  <MpText size="body-small" color="text.secondary">09:45</MpText>
                </MpFlex>
              </div>
            </div>
          </MpFlex>

        </MpFlex>

      </div>
    </MpFlex>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  css,
  MpFlex,
  MpText,
  MpInput,
  MpSelect,
  MpButton,
  MpFormControl,
  MpFormLabel,
  MpBanner,
  MpBannerIcon,
  MpBannerTitle,
  MpBannerDescription,
  MpBannerLink,
  MpBannerCloseButton,
  MpCheckbox,
  MpRadio,
  MpBadge,
  MpIcon,
} from '@mekari/pixel3'

definePageMeta({
  layout: 'default',
  pageTitle: 'Create campaign',
  hidePageAction: true,
  pageBreadcrumb: {
    label: 'WhatsApp',
    route: '/campaigns/whatsapp',
  },
})

const router = useRouter()
const pageClass = css({ flexGrow: '1' })

const showBanner = ref(true)

const form = ref({
  campaignName: '',
  sender: undefined as string | undefined,
  audience: undefined as string | undefined,
  template: undefined as string | undefined,
  selectDivision: false,
  sendingOption: 'send_now',
})

// Sender dropdown
const senders = [
  { value: 'sender_a', name: 'Central Perk Indonesia', phone: '6281234567890' },
  { value: 'sender_b', name: 'Central Perk Support', phone: '6288811225566' },
]
const showSenderDropdown = ref(false)
const hoveredSender = ref<string | null>(null)
const selectedSender = computed(() => senders.find(s => s.value === form.value.sender) ?? null)

function selectSender(sender: { value: string; name: string; phone: string }) {
  form.value.sender = sender.value
  showSenderDropdown.value = false
}

// Audience dropdown
const recipientLists = [
  { value: 'most_valuable', name: 'Most valuable customers', count: '12.345', total: '14.000' },
  { value: 'least_purchase', name: 'Least purchase customers', count: '19.876', total: '22.000' },
  { value: 'inactive', name: 'Inactive customers', count: '15.678', total: '18.000' },
  { value: 'abandoned_cart', name: 'Latest abandoned cart', count: '7.890', total: '9.000' },
  { value: 'recently_purchase', name: 'Recently purchase customers', count: '22.222', total: '25.000' },
  { value: 'giveaway_ramadan', name: 'Give away ramadhan 2024', count: '3.141', total: '4.000' },
]
const customerSegments = [
  { value: 'top_tier', name: 'Top-tier customers', count: '8.765', disabled: false },
  { value: 'lowest_spending', name: 'Lowest spending customers', count: '14.999', disabled: false },
  { value: 'dormant', name: 'Dormant customers', count: '1.050', disabled: false },
  { value: 'recently_abandoned', name: 'Recently abandoned carts', count: '0', disabled: true },
  { value: 'just_purchased', name: 'Customers who just made a purchase', count: '12.890', disabled: false },
  { value: 'ramadan_giveaway', name: 'Ramadan 2024 giveaway', count: '6.789', disabled: false },
  { value: 'new_prospects', name: 'New prospects', count: '4.567', disabled: false },
]

const showAudienceDropdown = ref(false)
const audienceType = ref<'recipient' | 'segment' | null>(null)
const audienceSearch = ref('')
const segmentSearch = ref('')
const hoveredAudience = ref<string | null>(null)

const selectedAudience = computed(() =>
  recipientLists.find(l => l.value === form.value.audience)
    ?? customerSegments.find(s => s.value === form.value.audience)
    ?? null
)

const filteredRecipientLists = computed(() =>
  audienceSearch.value
    ? recipientLists.filter(l => l.name.toLowerCase().includes(audienceSearch.value.toLowerCase()))
    : recipientLists
)

const filteredCustomerSegments = computed(() =>
  segmentSearch.value
    ? customerSegments.filter(s => s.name.toLowerCase().includes(segmentSearch.value.toLowerCase()))
    : customerSegments
)

function selectAudience(item: { value: string; name: string; count: string }) {
  form.value.audience = item.value
  showAudienceDropdown.value = false
  audienceType.value = null
  audienceSearch.value = ''
  segmentSearch.value = ''
}

watch(() => form.value.sender, (val) => {
  if (!val) showSenderDropdown.value = false
})

watch(() => form.value.audience, (val) => {
  if (!val) {
    showAudienceDropdown.value = false
    audienceType.value = null
    audienceSearch.value = ''
    segmentSearch.value = ''
  }
})

function closeAudienceDropdown() {
  showAudienceDropdown.value = false
  audienceType.value = null
  audienceSearch.value = ''
  segmentSearch.value = ''
}

const vClickOutside = {
  mounted(el: HTMLElement, binding: { value: () => void }) {
    (el as any)._clickOutsideHandler = (event: Event) => {
      if (!el.contains(event.target as Node)) binding.value()
    }
    document.addEventListener('click', (el as any)._clickOutsideHandler, true)
  },
  unmounted(el: HTMLElement) {
    document.removeEventListener('click', (el as any)._clickOutsideHandler, true)
  },
}

function handleCancel() {
  router.push('/campaigns/whatsapp')
}

function handleSend() {
  router.push('/campaigns/whatsapp')
}
</script>
