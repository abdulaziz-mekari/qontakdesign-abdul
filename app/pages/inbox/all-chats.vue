<template>
  <div :style="{ display: 'flex', flex: '1', minHeight: '0', overflow: 'hidden', height: `calc(100svh - ${TOPBAR_HEIGHT})` }">

    <!-- ── Conversation list panel ────────────────────────────── -->
    <div :style="listPanelStyle">

      <!-- Header -->
      <div :style="listHeaderStyle">
        <MpText size="label" weight="semiBold" :style="{ flex: '1' }">All inboxes</MpText>
      </div>

      <!-- Filter bar -->
      <div :style="filterBarStyle">
        <div :style="filterDropdownStyle" :class="hoverClass">
          <MpText size="label-small" :style="{ flex: '1' }">Newest</MpText>
          <MpIcon name="chevrons-down" size="sm" color="text.secondary" />
        </div>
        <div :style="filterIconStyle" :class="hoverClass">
          <MpIcon name="check" size="sm" color="text.secondary" />
        </div>
        <div :style="filterIconStyle" :class="hoverClass">
          <MpIcon name="minus-circle" size="sm" color="text.secondary" />
        </div>
        <div :style="filterIconStyle" :class="hoverClass">
          <MpIcon name="sliders" size="sm" color="text.secondary" />
        </div>
      </div>

      <!-- Conversation items -->
      <div :style="{ flex: '1', overflowY: 'auto' }">
        <div
          v-for="(conv, i) in conversations"
          :key="conv.id"
          :style="convItemStyle(i === activeConv)"
          @click="activeConv = i"
        >
          <!-- Avatar + channel badge -->
          <div :style="{ position: 'relative', flexShrink: '0' }">
            <MpAvatar :name="conv.name" size="md" />
            <div :style="channelBadgeStyle(conv.channel)">
              <component :is="channelIcon(conv.channel)" />
            </div>
          </div>

          <!-- Content -->
          <div :style="{ flex: '1', minWidth: '0' }">
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }">
              <MpText size="label" weight="semiBold" :style="{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '140px' }">
                {{ conv.name }}
              </MpText>
              <div :style="{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: '0' }">
                <span v-if="conv.sla" :style="slaStyle">⏰ {{ conv.sla }}</span>
                <MpText size="label-small" color="text.secondary" :style="{ whiteSpace: 'nowrap' }">{{ conv.time }}</MpText>
              </div>
            </div>
            <div :style="{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }">
              <MpText size="label-small" color="text.secondary" :style="{ flex: '1', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }">
                {{ conv.lastMessage }}
              </MpText>
              <div v-if="conv.unread" :style="unreadDotStyle" />
            </div>
            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
              <MpText size="label-small" color="text.secondary">{{ conv.channelName }}</MpText>
              <span :style="statusBadgeStyle(conv.status)">{{ conv.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Chat / empty state area ───────────────────────────── -->
    <div :style="{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: 'var(--mp-colors-background-neutral)', gap: '12px' }">
      <div :style="{ fontSize: '72px', lineHeight: '1' }">💬</div>
      <MpText size="label" weight="semiBold">Conversation will appear here</MpText>
      <MpText size="label-small" color="text.secondary">Please select a conversation from the list on the left first.</MpText>
    </div>

  </div>
</template>

<script setup lang="ts">
  import { ref, h } from 'vue'
  import { MpText, MpAvatar, MpIcon, css } from '@mekari/pixel3'
  import { TOPBAR_HEIGHT } from '~/composables/usePixelLayout'

  definePageMeta({ layout: 'default', hidePageHeader: true })

  const activeConv = ref<number | null>(null)

  // ── Mock conversations ───────────────────────────────────────
  const conversations = [
    { id: 1, name: 'Indra Pangestu',    time: '17:30', lastMessage: 'Saya mau komplain soal mesi...', channel: 'whatsapp',  channelName: 'Hummingbird Official', status: 'Unassigned', unread: true,  sla: null  },
    { id: 2, name: 'Bambang Pratama',   time: '16:54', lastMessage: 'Apakah mesin kopi ini bisa...',  channel: 'telegram',  channelName: 'Hummingbird Official', status: 'Unassigned', unread: true,  sla: null  },
    { id: 3, name: 'Wulan Fitriani',    time: '16:50', lastMessage: 'Selamat pagi',                   channel: 'whatsapp',  channelName: 'Hummingbird Official', status: 'Assigned',   unread: false, sla: null  },
    { id: 4, name: 'Eka Surya',         time: '16:15', lastMessage: '↩ Kami akan kirim katalog...',   channel: 'whatsapp',  channelName: 'Hummingbird Official', status: 'Assigned',   unread: false, sla: null  },
    { id: 5, name: 'Siti Aisyah Putri', time: '15:30', lastMessage: 'Berapa lama pengiriman untu...', channel: 'instagram', channelName: 'Hummingbird Official', status: 'Assigned',   unread: true,  sla: null  },
    { id: 6, name: 'Maya Sari',         time: '14:45', lastMessage: '↩ Garansi mesin kopi ini...',   channel: 'whatsapp',  channelName: 'Hummingbird Official', status: 'Assigned',   unread: false, sla: null  },
    { id: 7, name: 'Rudi Setiawan',     time: '',      lastMessage: 'Apakah bisa COD untuk pesana...', channel: 'whatsapp', channelName: 'Hummingbird Official', status: 'Assigned',   unread: false, sla: '30m' },
    { id: 8, name: 'Indra Gunawan',     time: '13:35', lastMessage: '↩ Kami sarankan untuk rutin...', channel: 'twitter',  channelName: 'Hummingbird Official', status: 'Assigned',   unread: false, sla: null  },
    { id: 9, name: 'Ade Putra',         time: '12:50', lastMessage: '↩ Ada masalah, mesin tiba-tiba...', channel: 'whatsapp', channelName: 'Hummingbird Official', status: 'Assigned', unread: false, sla: null },
  ]

  // ── Channel config ───────────────────────────────────────────
  const channelColors: Record<string, string> = {
    whatsapp:  '#25D366',
    telegram:  '#0088CC',
    instagram: '#E1306C',
    twitter:   '#000000',
  }

  const channelLetters: Record<string, string> = {
    whatsapp:  'W',
    telegram:  'T',
    instagram: 'I',
    twitter:   'X',
  }

  function channelIcon(channel: string) {
    return h('span', {
      style: { color: '#fff', fontSize: '8px', fontWeight: '700', lineHeight: '1' },
    }, channelLetters[channel] ?? '?')
  }

  function channelBadgeStyle(channel: string) {
    return {
      position: 'absolute' as const,
      bottom: '-2px',
      right: '-2px',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      backgroundColor: channelColors[channel] ?? '#999',
      border: '2px solid var(--mp-colors-background-surface)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }
  }

  // ── Status badge styles ──────────────────────────────────────
  function statusBadgeStyle(status: string) {
    const isUnassigned = status === 'Unassigned'
    return {
      fontSize: '10px',
      fontWeight: '500',
      lineHeight: '1',
      padding: '2px 6px',
      borderRadius: '4px',
      backgroundColor: isUnassigned ? 'var(--mp-colors-background-info-subtlest)' : 'transparent',
      color: isUnassigned ? 'var(--mp-colors-text-info)' : 'var(--mp-colors-text-secondary)',
    }
  }

  // ── Layout styles ────────────────────────────────────────────
  const listPanelStyle = {
    width: '280px',
    flexShrink: '0',
    display: 'flex',
    flexDirection: 'column' as const,
    borderRight: '1px solid var(--mp-colors-border-default)',
    backgroundColor: 'var(--mp-colors-background-surface)',
    overflow: 'hidden',
  }

  const listHeaderStyle = {
    padding: '16px 16px 12px',
    display: 'flex',
    alignItems: 'center',
  }

  const filterBarStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '0 8px 8px',
    borderBottom: '1px solid var(--mp-colors-border-default)',
  }

  const filterDropdownStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '6px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '1px solid var(--mp-colors-border-default)',
    flex: '1',
  }

  const filterIconStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '6px',
    cursor: 'pointer',
  }

  function convItemStyle(isActive: boolean) {
    return {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      padding: '12px 16px',
      cursor: 'pointer',
      backgroundColor: isActive ? 'var(--mp-colors-background-brand-selected)' : 'transparent',
      borderBottom: '1px solid var(--mp-colors-border-default)',
      position: 'relative' as const,
      transition: 'background-color 150ms ease',
    }
  }

  const unreadDotStyle = {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: 'var(--mp-colors-background-danger-bold)',
    flexShrink: '0',
  }

  const slaStyle = {
    fontSize: '10px',
    fontWeight: '500',
    color: 'var(--mp-colors-text-warning)',
    backgroundColor: 'var(--mp-colors-background-warning-subtlest)',
    padding: '2px 5px',
    borderRadius: '4px',
    whiteSpace: 'nowrap' as const,
  }

  const hoverClass = css({ _hover: { bg: 'background.neutral.hovered' } })
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
