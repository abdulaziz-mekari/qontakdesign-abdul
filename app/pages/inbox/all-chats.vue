<template>
  <div
    :style="{
      display: 'flex',
      flex: '1',
      minHeight: '0',
      overflow: 'hidden',
      height: `calc(100svh - ${TOPBAR_HEIGHT})`,
    }"
  >
    <!-- ── Conversation list panel ────────────────────────────── -->
    <div :style="listPanelStyle">
      <!-- Header -->
      <div :style="listHeaderStyle">
        <MpText size="h2" weight="semiBold" :style="{ flex: '1' }"
          >All inboxes</MpText
        >
      </div>

      <!-- Filter bar -->
      <div :style="filterBarStyle">
        <div :style="filterDropdownStyle" :class="hoverClass">
          <MpText size="label-small" :style="{ flex: '1' }">Newest</MpText>
          <MpIcon name="chevrons-down" size="sm" color="icon.default" />
        </div>
        <div :style="filterIconStyle" :class="hoverClass">
          <MpIcon name="done" size="sm" color="icon.default" />
        </div>
        <div :style="filterIconStyle" :class="hoverClass">
          <MpIcon name="filter" size="sm" color="icon.default" />
        </div>
      </div>

      <!-- Conversation items -->
      <div :style="{ flex: '1', overflowY: 'auto' }">
        <div
          v-for="(conv, i) in conversations"
          :key="conv.id"
          :style="convItemStyle(i === activeConv, hoveredConv === i)"
          @click="activeConv = i"
          @mouseenter="hoveredConv = i"
          @mouseleave="hoveredConv = null"
        >
          <!-- Avatar / Checkbox -->
          <div
            :style="{
              flexShrink: '0',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
          >
            <div
              v-if="
                hoveredConv === i &&
                (conv.status === 'Unassigned' || conv.status === 'Assigned')
              "
              :style="checkboxStyle"
            />
            <div v-else :style="channelIconContainerStyle(conv.channel)">
              <div :style="channelIconInnerStyle(conv.channel)">
                <img
                  :src="CHANNEL_ASSETS[conv.channel]?.src"
                  style="
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    display: block;
                    max-width: none;
                  "
                  alt=""
                />
              </div>
            </div>
          </div>

          <!-- Content -->
          <div :style="{ flex: '1', minWidth: '0' }">
            <div
              :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2px',
              }"
            >
              <MpText
                size="label"
                weight="semiBold"
                :style="{
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  maxWidth: '140px',
                }"
              >
                {{ conv.name }}
              </MpText>
              <div
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexShrink: '0',
                }"
              >
                <span v-if="conv.sla" :style="slaStyle">⏰ {{ conv.sla }}</span>
                <MpText
                  size="label-small"
                  color="text.secondary"
                  :style="{ whiteSpace: 'nowrap' }"
                  >{{ conv.time }}</MpText
                >
              </div>
            </div>
            <div
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '4px',
              }"
            >
              <MpText
                size="label"
                weight="regular"
                color="text.secondary"
                :style="{
                  flex: '1',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }"
              >
                {{ conv.lastMessage }}
              </MpText>
              <div v-if="conv.unread" :style="unreadDotStyle" />
            </div>
            <div
              :style="{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }"
            >
              <MpText size="label-small" color="text.secondary">{{
                conv.channelName
              }}</MpText>
              <span :style="statusBadgeStyle(conv.status)">{{
                conv.status
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Chat / empty state area ───────────────────────────── -->
    <div
      :style="{
        flex: '1',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: 'var(--mp-colors-background-neutral)',
        gap: '12px',
      }"
    >
      <div :style="{ fontSize: '72px', lineHeight: '1' }">💬</div>
      <MpText size="label" weight="semiBold"
        >Conversation will appear here</MpText
      >
      <MpText size="label-small" color="text.secondary"
        >Please select a conversation from the list on the left first.</MpText
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { MpText, MpIcon, css } from "@mekari/pixel3";
import { TOPBAR_HEIGHT } from "~/composables/usePixelLayout";

definePageMeta({ layout: "default", hidePageHeader: true });

const activeConv = ref<number | null>(null);
const hoveredConv = ref<number | null>(null);

// ── Mock conversations ───────────────────────────────────────
const conversations = [
  {
    id: 1,
    name: "Indra Pangestu",
    time: "17:30",
    lastMessage: "Saya mau komplain soal mesi...",
    channel: "whatsapp",
    channelName: "Hummingbird Official",
    status: "Unassigned",
    unread: true,
    sla: null,
  },
  {
    id: 2,
    name: "Bambang Pratama",
    time: "16:54",
    lastMessage: "Apakah mesin kopi ini bisa...",
    channel: "telegram",
    channelName: "Hummingbird Official",
    status: "Unassigned",
    unread: true,
    sla: null,
  },
  {
    id: 3,
    name: "Wulan Fitriani",
    time: "16:50",
    lastMessage: "Selamat pagi",
    channel: "whatsapp",
    channelName: "Hummingbird Official",
    status: "Assigned",
    unread: false,
    sla: null,
  },
  {
    id: 4,
    name: "Eka Surya",
    time: "16:15",
    lastMessage: "↩ Kami akan kirim katalog...",
    channel: "whatsapp",
    channelName: "Hummingbird Official",
    status: "Assigned",
    unread: false,
    sla: null,
  },
  {
    id: 5,
    name: "Siti Aisyah Putri",
    time: "15:30",
    lastMessage: "Berapa lama pengiriman untu...",
    channel: "instagram",
    channelName: "Hummingbird Official",
    status: "Assigned",
    unread: true,
    sla: null,
  },
  {
    id: 6,
    name: "Maya Sari",
    time: "14:45",
    lastMessage: "↩ Garansi mesin kopi ini...",
    channel: "whatsapp",
    channelName: "Hummingbird Official",
    status: "Assigned",
    unread: false,
    sla: null,
  },
  {
    id: 7,
    name: "Rudi Setiawan",
    time: "",
    lastMessage: "Apakah bisa COD untuk pesana...",
    channel: "whatsapp",
    channelName: "Hummingbird Official",
    status: "Assigned",
    unread: false,
    sla: "30m",
  },
  {
    id: 8,
    name: "Indra Gunawan",
    time: "13:35",
    lastMessage: "↩ Kami sarankan untuk rutin...",
    channel: "twitter",
    channelName: "Hummingbird Official",
    status: "Assigned",
    unread: false,
    sla: null,
  },
  {
    id: 9,
    name: "Ade Putra",
    time: "12:50",
    lastMessage: "↩ Ada masalah, mesin tiba-tiba...",
    channel: "whatsapp",
    channelName: "Hummingbird Official",
    status: "Assigned",
    unread: false,
    sla: null,
  },
];

// ── Channel icons (from Figma node 5599-55278) ───────────────
const CHANNEL_ASSETS: Record<
  string,
  {
    bg?: string;
    gradient?: string;
    src: string;
    top: string;
    right: string;
    bottom: string;
    left: string;
  }
> = {
  whatsapp: {
    bg: "#40c351",
    src: "/channels/whatsapp.svg",
    top: "20.83%",
    right: "22.92%",
    bottom: "25%",
    left: "22.92%",
  },
  telegram: {
    bg: "#34aadf",
    src: "/channels/telegram.svg",
    top: "27.08%",
    right: "27.08%",
    bottom: "27.08%",
    left: "18.75%",
  },
  instagram: {
    gradient:
      "radial-gradient(circle at 30% 107%, #fdf497 0%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
    src: "/channels/instagram.svg",
    top: "22.92%",
    right: "22.92%",
    bottom: "22.92%",
    left: "22.92%",
  },
  twitter: {
    bg: "#1d2125",
    src: "/channels/twitter.svg",
    top: "25%",
    right: "25.53%",
    bottom: "25%",
    left: "25.54%",
  },
};

function channelIconContainerStyle(channel: string) {
  const ch = CHANNEL_ASSETS[channel];
  const base = {
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    overflow: "hidden",
    position: "relative" as const,
    flexShrink: "0" as const,
  };
  if (ch?.gradient) {
    return { ...base, background: ch.gradient };
  }
  return { ...base, backgroundColor: ch?.bg ?? "#999" };
}

function channelIconInnerStyle(channel: string) {
  const ch = CHANNEL_ASSETS[channel];
  if (!ch) return {};
  return {
    position: "absolute" as const,
    top: ch.top,
    right: ch.right,
    bottom: ch.bottom,
    left: ch.left,
  };
}

// ── Status badge styles ──────────────────────────────────────
function statusBadgeStyle(status: string) {
  const isUnassigned = status === "Unassigned";
  return {
    fontSize: "10px",
    fontWeight: "500",
    lineHeight: "1",
    padding: "2px 6px",
    borderRadius: "4px",
    backgroundColor: isUnassigned
      ? "var(--mp-colors-background-info-subtlest)"
      : "transparent",
    color: isUnassigned
      ? "var(--mp-colors-text-info)"
      : "var(--mp-colors-text-secondary)",
  };
}

// ── Layout styles ────────────────────────────────────────────
const listPanelStyle = {
  width: "280px",
  flexShrink: "0",
  display: "flex",
  flexDirection: "column" as const,
  borderRight: "1px solid var(--mp-colors-border-default)",
  backgroundColor: "var(--mp-colors-background-stage)",
  overflow: "hidden",
};

const listHeaderStyle = {
  padding: "16px 16px 12px",
  display: "flex",
  alignItems: "center",
  borderBottom: "1px solid var(--mp-colors-border-default)",
};

const filterBarStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "8px 16px",
  borderBottom: "1px solid var(--mp-colors-border-default)",
};

const filterDropdownStyle = {
  display: "flex",
  alignItems: "center",
  gap: "4px",
  padding: "6px 8px",
  borderRadius: "6px",
  cursor: "pointer",
  border: "1px solid var(--mp-colors-border-default)",
  flex: "1",
};

const filterIconStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "32px",
  height: "32px",
  borderRadius: "6px",
  cursor: "pointer",
};

function convItemStyle(isActive: boolean, isHovered: boolean) {
  let bg = "transparent";
  if (isActive) bg = "var(--mp-colors-background-brand-selected)";
  else if (isHovered) bg = "var(--mp-colors-background-neutral-hovered)";
  return {
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    padding: "8px 16px",
    cursor: "pointer",
    backgroundColor: bg,
    borderBottom: "1px solid var(--mp-colors-border-default)",
    position: "relative" as const,
    transition: "background-color 150ms ease",
  };
}

const checkboxStyle = {
  width: "20px",
  height: "20px",
  borderRadius: "4px",
  border: "2px solid var(--mp-colors-border-default)",
  backgroundColor: "var(--mp-colors-background-surface)",
  flexShrink: "0",
};

const unreadDotStyle = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "var(--mp-colors-background-danger-bold)",
  flexShrink: "0",
};

const slaStyle = {
  fontSize: "10px",
  fontWeight: "500",
  color: "var(--mp-colors-text-warning)",
  backgroundColor: "var(--mp-colors-background-warning-subtlest)",
  padding: "2px 5px",
  borderRadius: "4px",
  whiteSpace: "nowrap" as const,
};

const hoverClass = css({ _hover: { bg: "background.neutral.hovered" } });
</script>

<style scoped>
div[style*="overflow-y: auto"]::-webkit-scrollbar {
  width: 4px;
}
div[style*="overflow-y: auto"]::-webkit-scrollbar-track {
  background: transparent;
}
div[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
  background: var(--mp-colors-border-default);
  border-radius: 2px;
}
</style>
