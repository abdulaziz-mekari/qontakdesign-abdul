<template>
  <MpDrawer
    :isOpen="isOpen"
    placement="right"
    :isCloseOnOverlayClick="true"
    @close="$emit('close')"
  >
    <MpDrawerOverlay />
    <MpDrawerContent
      v-if="isOpen"
      :style="{ width: '684px', maxWidth: '100vw' }"
    >
      <!-- Header -->
      <MpDrawerHeader
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--mp-colors-border-default)',
          flexShrink: '0',
        }"
      >
        <MpText size="h3" weight="semiBold">New message</MpText>
        <MpDrawerCloseButton
          @click="$emit('close')"
          :style="{ position: 'static' }"
        />
      </MpDrawerHeader>

      <!-- Body -->
      <MpDrawerBody :style="{ padding: '0', overflowY: 'auto', flex: '1' }">
        <div
          :style="{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
          }"
        >
          <!-- Info banner -->
          <MpBanner status="info" :style="{ borderRadius: '8px' }">
            <MpBannerIcon id="banner-icon-wtm" />
            <MpBannerTitle>Utility messages only</MpBannerTitle>
            <MpBannerDescription>
              Interactive buttons are available in the first message only.
              Additional features depend on Meta's Utility guidelines.
              <MpTextlink href="#" size="label">Learn more</MpTextlink>
            </MpBannerDescription>
          </MpBanner>

          <!-- Sender and recipients -->
          <div
            :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }"
          >
            <MpText size="h3" weight="semiBold">Sender and recipients</MpText>

            <!-- Sender -->
            <MpFormControl>
              <MpFormLabel>
                Sender
                <span :style="{ color: 'var(--mp-colors-text-danger)' }"
                  >*</span
                >
              </MpFormLabel>
              <MpSelect
                v-model="form.sender"
                placeholder="Select sender account"
              >
                <option value="hummingbird-wa">
                  Hummingbird Official (WhatsApp)
                </option>
                <option value="hummingbird-ig">
                  Hummingbird Official (Instagram)
                </option>
              </MpSelect>
            </MpFormControl>

            <!-- Recipients -->
            <MpFormControl>
              <MpFormLabel>
                Recipients
                <span :style="{ color: 'var(--mp-colors-text-danger)' }"
                  >*</span
                >
              </MpFormLabel>
              <MpInputTag
                :data="form.recipients"
                :suggestions="filteredCustomers"
                suggestionKey="label"
                :maxTags="3"
                :isEnableCreateNewTag="false"
                :isShowSuggestions="true"
                :isShowIconChevronDown="false"
                widthContent="320px"
                placeholder="Search customer name or phone number"
                @change="onRecipientsChange"
                @search="onRecipientsSearch"
              >
                <template #default="item">
                  <div
                    :style="{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0',
                      width: '100%',
                    }"
                  >
                    <span
                      :style="{
                        fontSize: '14px',
                        lineHeight: '20px',
                        color: 'var(--mp-colors-text-default)',
                      }"
                      >{{ item.label }}</span
                    >
                    <span
                      :style="{
                        fontSize: '12px',
                        lineHeight: '16px',
                        color: 'var(--mp-colors-text-secondary)',
                      }"
                      >{{ item.phone }}</span
                    >
                  </div>
                </template>
              </MpInputTag>
              <MpFormHelpText>Select up to 3 customers</MpFormHelpText>
            </MpFormControl>
          </div>

          <!-- Message content -->
          <div
            :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }"
          >
            <div
              :style="{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                alignItems: 'flex-start',
              }"
            >
              <MpText size="h3" weight="semiBold">Message content</MpText>
              <MpSegmentedControl
                v-model="activeTab"
                :data="messageTabs"
                name="message-tab"
                class="segmented-hug"
              />
            </div>

            <!-- Header message -->
            <MpFormControl>
              <div
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }"
              >
                <MpFormLabel :style="{ margin: '0' }"
                  >Header message</MpFormLabel
                >
                <MpText size="label-small" color="text.secondary"
                  >{{ form.headerMessage.length }}/60</MpText
                >
              </div>
              <MpInput
                v-model="form.headerMessage"
                placeholder="Enter header message"
                :maxlength="60"
              />
            </MpFormControl>

            <!-- Body message -->
            <MpFormControl>
              <div
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }"
              >
                <MpFormLabel :style="{ margin: '0' }">
                  Body message
                  <span :style="{ color: 'var(--mp-colors-text-danger)' }"
                    >*</span
                  >
                </MpFormLabel>
                <MpText size="label-small" color="text.secondary"
                  >{{ bodyCharCount }}/550</MpText
                >
              </div>
              <MpRichTextEditor
                :value="form.bodyMessage"
                placeholder="Enter message"
                :maxlength="550"
                :options="bodyToolbarOptions"
                @change="onBodyChange"
              />
            </MpFormControl>

            <!-- Footer message -->
            <MpFormControl>
              <div
                :style="{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '4px',
                }"
              >
                <MpFormLabel :style="{ margin: '0' }"
                  >Footer message</MpFormLabel
                >
                <MpText size="label-small" color="text.secondary"
                  >{{ form.footerMessage.length }}/60</MpText
                >
              </div>
              <MpInput
                v-model="form.footerMessage"
                placeholder="Enter footer message"
                :maxlength="60"
              />
            </MpFormControl>
          </div>

          <!-- Interactive action -->
          <div
            :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }"
          >
            <MpText size="label" weight="semiBold">Interactive action</MpText>
            <MpFormControl>
              <MpFormLabel>Action type</MpFormLabel>
              <MpSelect
                v-model="form.actionType"
                placeholder="Select interactive type"
                :style="{ width: '330px' }"
              >
                <option value="buttons">Buttons</option>
                <option value="list">List</option>
              </MpSelect>
            </MpFormControl>
          </div>
        </div>
      </MpDrawerBody>

      <!-- Footer -->
      <MpDrawerFooter
        :style="{
          padding: '16px 24px',
          borderTop: '1px solid var(--mp-colors-border-default)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: '0',
        }"
      >
        <!-- Save as template -->
        <MpCheckbox v-model="form.saveAsTemplate">
          Save message as template
        </MpCheckbox>

        <!-- Actions -->
        <div :style="{ display: 'flex', alignItems: 'center', gap: '8px' }">
          <MpButton variant="ghost" @click="$emit('close')">Cancel</MpButton>
          <MpButton variant="outline">Preview</MpButton>
          <MpButton variant="primary" :isDisabled="!canSend"
            >Send message</MpButton
          >
        </div>
      </MpDrawerFooter>
    </MpDrawerContent>
  </MpDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  MpDrawer,
  MpDrawerOverlay,
  MpDrawerContent,
  MpDrawerHeader,
  MpDrawerBody,
  MpDrawerFooter,
  MpDrawerCloseButton,
  MpText,
  MpFormControl,
  MpFormLabel,
  MpFormHelpText,
  MpSelect,
  MpInput,
  MpInputTag,
  MpSegmentedControl,
  MpRichTextEditor,
  MpBanner,
  MpBannerIcon,
  MpBannerTitle,
  MpBannerDescription,
  MpTextlink,
  MpCheckbox,
  MpButton,
} from "@mekari/pixel3";

defineProps<{ isOpen: boolean }>();
defineEmits(["close"]);

// ── Form state ───────────────────────────────────────────────
const form = ref({
  sender: "",
  recipients: [] as { id: string; label: string }[],
  headerMessage: "",
  bodyMessage: "",
  footerMessage: "",
  actionType: "",
  saveAsTemplate: false,
});

// ── Recipients autocomplete ───────────────────────────────────
const recipientQuery = ref("");

const allCustomers = [
  { id: "1", label: "Raden Adjeng Setyawati", phone: "628578819201" },
  { id: "2", label: "Bambang Trihatmodjo", phone: "628956789123" },
  { id: "3", label: "Citra Kirana Putri", phone: "628781234567" },
  { id: "4", label: "Dian Sastrowardoyo", phone: "628129876543" },
  { id: "5", label: "Eko Prasetyo Nugroho", phone: "628562345678" },
  { id: "6", label: "Farah Amalia Lestari", phone: "628387654321" },
  { id: "7", label: "Gunawan Dwi Cahyo", phone: "628214321876" },
  { id: "8", label: "Hesti Purwadinata", phone: "628192837465" },
  { id: "9", label: "Indra Lesmana Wijaya", phone: "628573456789" },
  { id: "10", label: "Jessica Iskandar", phone: "628779876543" },
];

const filteredCustomers = computed(() => {
  if (!recipientQuery.value) return allCustomers;
  const q = recipientQuery.value.toLowerCase();
  return allCustomers.filter(
    (c) => c.label.toLowerCase().includes(q) || c.phone.includes(q),
  );
});

function onRecipientsChange(tags: { id: string; label: string }[]) {
  form.value.recipients = tags;
}

function onRecipientsSearch(query: string) {
  recipientQuery.value = query;
}

// ── Segmented control ────────────────────────────────────────
const activeTab = ref("compose");
const messageTabs = [
  { value: "compose", label: "Compose new message" },
  { value: "previous", label: "Use previously sent message" },
];

// ── Body message (RichTextEditor) ────────────────────────────
// options is ToolbarOption[][] — each inner array is a group separated by divider
const bodyToolbarOptions = [
  ["bold", "italic", "strike", "underline"],
  ["orderedList", "bulletList", "blockquote"],
  ["clear"],
];
const bodyCharCount = ref(0);

function onBodyChange(html: string, editor: any) {
  form.value.bodyMessage = html ?? "";
  const text = editor?.getText?.() ?? "";
  bodyCharCount.value = text.length;
}

// ── Can send ─────────────────────────────────────────────────
const canSend = computed(
  () =>
    form.value.sender &&
    form.value.recipients.length > 0 &&
    bodyCharCount.value > 0,
);
</script>

<style scoped>
/* Make each segmented control item hug its own text width */
.segmented-hug :deep(.mp-segmented-control__item) {
  --mp-segmented-control--flex: 0 0 auto;
}
</style>
