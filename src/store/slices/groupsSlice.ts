import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Group {
  id: string;
  name: string;
  goal: string;
  cover_image_url?: string;
  created_by: string;
  created_at: string;
  memberCount?: number;
  userRole?: 'admin' | 'member';
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  name?: string;
  profile_picture_url?: string;
}

export interface GroupInvitation {
  id: string;
  group_id: string;
  email: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  group_name?: string;
}

interface GroupsState {
  groups: Group[];
  currentGroup: Group | null;
  groupMembers: GroupMember[];
  invitations: GroupInvitation[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GroupsState = {
  groups: [],
  currentGroup: null,
  groupMembers: [],
  invitations: [],
  isLoading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    addGroup: (state, action: PayloadAction<Group>) => {
      state.groups.push(action.payload);
    },
    setCurrentGroup: (state, action: PayloadAction<Group | null>) => {
      state.currentGroup = action.payload;
    },
    updateGroup: (state, action: PayloadAction<Group>) => {
      const index = state.groups.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.groups[index] = action.payload;
      }
      if (state.currentGroup?.id === action.payload.id) {
        state.currentGroup = action.payload;
      }
    },
    deleteGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups.filter(g => g.id !== action.payload);
      if (state.currentGroup?.id === action.payload) {
        state.currentGroup = null;
      }
    },
    setGroupMembers: (state, action: PayloadAction<GroupMember[]>) => {
      state.groupMembers = action.payload;
    },
    setInvitations: (state, action: PayloadAction<GroupInvitation[]>) => {
      state.invitations = action.payload;
    },
    updateInvitation: (state, action: PayloadAction<GroupInvitation>) => {
      const index = state.invitations.findIndex(inv => inv.id === action.payload.id);
      if (index !== -1) {
        state.invitations[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setGroups,
  addGroup,
  setCurrentGroup,
  updateGroup,
  deleteGroup,
  setGroupMembers,
  setInvitations,
  updateInvitation,
  setLoading,
  setError,
} = groupsSlice.actions;

export default groupsSlice.reducer;
