import React from 'react'
import { Box, Button, styled, SvgIconProps } from '@mui/material'

interface TabItem {
  id: string
  icon: React.ComponentType<SvgIconProps>
  label: string
}

interface TabBarProps {
  tabs: TabItem[]
  activeTab: string
  onChange: (tabId: string) => void
}

const TabBarContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.palette.background.paper,
  borderTop: '1px solid var(--color-border-subtle)',
  position: 'relative',
  zIndex: 4,
  height: 'var(--layout-tabbar-height)',
}))

const TabButton = styled(Button)<{ isActive: boolean }>(({ isActive }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3px',
  color: isActive ? 'var(--color-brand-700)' : 'var(--color-fg3)',
  fontSize: '10.5px',
  fontWeight: 600,
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  transition: 'color var(--transition-duration-fast)',

  '&:hover': {
    opacity: 0.8,
  },
}))

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <TabBarContainer>
      {tabs.map((tab) => {
        const Icon = tab.icon
        return (
          <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => onChange(tab.id)}
          >
            <Icon sx={{ fontSize: '24px' }} />
            <span>{tab.label}</span>
          </TabButton>
        )
      })}
    </TabBarContainer>
  )
}
