<template>
  <MpDrawer :isOpen="isOpen" placement="right" :isCloseOnOverlayClick="true" @close="$emit('close')">
    <MpDrawerOverlay />
    <MpDrawerContent :style="{ width: '684px', maxWidth: '100vw' }">
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
        <MpDrawerCloseButton @click="$emit('close')" :style="{ position: 'static' }" />
      </MpDrawerHeader>

      <!-- Body -->
      <MpDrawerBody :style="{ padding: '0', overflowY: 'auto', flex: '1' }">
        <div :style="{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }">

          <!-- Info banner -->
          <MpBanner status="info" :style="{ borderRadius: '8px' }">
            <MpBannerTitle>Utility messages only</MpBannerTitle>
            <MpBannerDescription>
              Interactive buttons are available in the first message only. Additional features depend on Meta's Utility guidelines.
              <MpTextlink href="#" size="label">Learn more</MpTextlink>
            </MpBannerDescription>
          </MpBanner>

          <!-- Sender and recipients -->
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <MpText size="label" weight="semiBold">Sender and recipients</MpText>

            <!-- Sender -->
            <MpFormControl>
              <MpFormLabel>
                Sender
                <span :style="{ color: 'var(--mp-colors-text-danger)' }">*</span>
              </MpFormLabel>
              <MpSelect v-model="form.sender" placeholder="Select sender account">
                <option value="hummingbird-wa">Hummingbird Official (WhatsApp)</option>
                <option value="hummingbird-ig">Hummingbird Official (Instagram)</option>
              </MpSelect>
            </MpFormControl>

            <!-- Recipients -->
            <MpFormControl>
              <MpFormLabel>
                Recipients
                <span :style="{ color: 'var(--mp-colors-text-danger)' }">*</span>
              </MpFormLabel>
              <MpInputTag
                :data="form.recipients"
                :suggestions="filteredCustomers"
                suggestionKey="label"
                :maxTags="3"
                :isEnableCreateNewTag="false"
                :isShowSuggestions="true"
                :isShowIconChevronDown="false"
                placeholder="Search customer name or phone number"
                @change="onRecipientsChange"
                @search="onRecipientsSearch"
              />
              <MpFormHelpText>Select up to 3 customers</MpFormHelpText>
            </MpFormControl>
          </div>

          <!-- Message content -->
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <MpText size="label" weight="semiBold">Message content</MpText>

            <!-- Tab toggle -->
            <div :style="{ display: 'flex', gap: '0', borderRadius: '6px', border: '1px solid var(--mp-colors-border-default)', overflow: 'hidden', width: 'fit-content' }">
              <button
                v-for="tab in messageTabs"
                :key="tab.value"
                :style="tabButtonStyle(tab.value === activeTab)"
                @click="activeTab = tab.value"
              >{{ tab.label }}</button>
            </div>

            <!-- Header message -->
            <MpFormControl>
              <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }">
                <MpFormLabel :style="{ margin: '0' }">Header message</MpFormLabel>
                <MpText size="label-small" color="text.secondary">{{ form.headerMessage.length }}/60</MpText>
              </div>
              <MpInput
                v-model="form.headerMessage"
                placeholder="Enter header message"
                :maxlength="60"
              />
            </MpFormControl>

            <!-- Body message -->
            <MpFormControl>
              <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }">
                <MpFormLabel :style="{ margin: '0' }">
                  Body message
                  <span :style="{ color: 'var(--mp-colors-text-danger)' }">*</span>
                </MpFormLabel>
                <MpText size="label-small" color="text.secondary">{{ form.bodyMessage.length }}/550</MpText>
              </div>
              <!-- Toolbar -->
              <div :style="bodyToolbarStyle">
                <button v-for="tool in bodyTools" :key="tool" :style="toolbarBtnStyle" :title="tool">
                  <span :style="toolbarIconStyle(tool)">{{ toolbarLabel(tool) }}</span>
                </button>
                <div :style="{ width: '1px', height: '16px', backgroundColor: 'var(--mp-colors-border-default)', margin: '0 4px' }" />
                <button :style="toolbarBtnStyle" title="Add variable">
                  <MpText size="label-small" color="text.secondary">{} Add variable</MpText>
                </button>
              </div>
              <MpTextarea
                v-model="form.bodyMessage"
                placeholder="Enter message"
                :maxlength="550"
                :rows="4"
                :style="{ borderTopLeftRadius: '0', borderTopRightRadius: '0', borderTop: 'none' }"
              />
            </MpFormControl>

            <!-- Footer message -->
            <MpFormControl>
              <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }">
                <MpFormLabel :style="{ margin: '0' }">Footer message</MpFormLabel>
                <MpText size="label-small" color="text.secondary">{{ form.footerMessage.length }}/60</MpText>
              </div>
              <MpInput
                v-model="form.footerMessage"
                placeholder="Enter footer message"
                :maxlength="60"
              />
            </MpFormControl>
          </div>

          <!-- Interactive action -->
          <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
            <MpText size="label" weight="semiBold">Interactive action</MpText>
            <MpFormControl>
              <MpFormLabel>Action type</MpFormLabel>
              <MpSelect v-model="form.actionType" placeholder="Select interactive type" :style="{ width: '330px' }">
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
          <MpButton variant="primary" :isDisabled="!canSend">Send message</MpButton>
        </div>
      </MpDrawerFooter>
    </MpDrawerContent>
  </MpDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  MpDrawer, MpDrawerOverlay, MpDrawerContent, MpDrawerHeader,
  MpDrawerBody, MpDrawerFooter, MpDrawerCloseButton,
  MpText, MpFormControl, MpFormLabel, MpFormHelpText,
  MpSelect, MpInput, MpTextarea, MpInputTag,
  MpBanner, MpBannerTitle, MpBannerDescription, MpTextlink,
  MpCheckbox, MpButton,
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
  { id: "1", label: "Indra Pangestu", phone: "+62 812-3456-7890" },
  { id: "2", label: "Bambang Pratama", phone: "+62 813-2345-6789" },
  { id: "3", label: "Wulan Fitriani", phone: "+62 811-3456-7890" },
  { id: "4", label: "Eka Surya", phone: "+62 814-5678-9012" },
  { id: "5", label: "Siti Aisyah Putri", phone: "+62 815-6789-0123" },
  { id: "6", label: "Maya Sari", phone: "+62 816-7890-1234" },
  { id: "7", label: "Rudi Setiawan", phone: "+62 817-8901-2345" },
  { id: "8", label: "Indra Gunawan", phone: "+62 818-9012-3456" },
];

const filteredCustomers = computed(() => {
  if (!recipientQuery.value) return allCustomers;
  const q = recipientQuery.value.toLowerCase();
  return allCustomers.filter(
    (c) => c.label.toLowerCase().includes(q) || c.phone.includes(q)
  );
});

function onRecipientsChange(tags: { id: string; label: string }[]) {
  form.value.recipients = tags;
}

function onRecipientsSearch(query: string) {
  recipientQuery.value = query;
}

// ── Tab toggle ───────────────────────────────────────────────
const activeTab = ref("compose");
const messageTabs = [
  { value: "compose", label: "Compose new message" },
  { value: "previous", label: "Use previously sent message" },
];

// ── Body toolbar ─────────────────────────────────────────────
const bodyTools = ["bold", "italic", "strikethrough", "code", "ol", "ul", "inline-code", "quote", "clear"];

function toolbarLabel(tool: string): string {
  const map: Record<string, string> = {
    bold: "B", italic: "I", strikethrough: "S", code: "T",
    ol: "≡", ul: "≡", "inline-code": "<>", quote: "\"\"", clear: "✗",
  };
  return map[tool] ?? tool;
}

function toolbarIconStyle(tool: string) {
  const isBold = tool === "bold";
  const isItalic = tool === "italic";
  return {
    fontWeight: isBold ? "700" : "400",
    fontStyle: isItalic ? "italic" : "normal",
    fontSize: "13px",
    color: "var(--mp-colors-text-default)",
    lineHeight: "1",
  };
}

// ── Can send ─────────────────────────────────────────────────
const canSend = computed(
  () =>
    form.value.sender &&
    form.value.recipients.length > 0 &&
    form.value.bodyMessage.trim().length > 0
);

// ── Styles ───────────────────────────────────────────────────
function tabButtonStyle(isActive: boolean) {
  return {
    padding: "7px 16px",
    fontSize: "14px",
    fontWeight: isActive ? "600" : "400",
    color: isActive ? "var(--mp-colors-text-selected)" : "var(--mp-colors-text-default)",
    backgroundColor: isActive ? "var(--mp-colors-background-brand-selected)" : "transparent",
    border: "none",
    cursor: "pointer",
    transition: "background-color 150ms ease",
  };
}

const bodyToolbarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "2px",
  padding: "6px 10px",
  border: "1px solid var(--mp-colors-border-form)",
  borderBottom: "none",
  borderTopLeftRadius: "6px",
  borderTopRightRadius: "6px",
  backgroundColor: "var(--mp-colors-background-surface)",
};

const toolbarBtnStyle = {
  padding: "4px 6px",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  borderRadius: "4px",
  display: "flex",
  alignItems: "center",
};
</script>
