import { publicAPI } from '../services/api';

let cachedGroups = null;

function flattenTree(tree) {
  const online = [];
  const onsite = [];
  for (const node of tree) {
    const name = node.name || node.title;
    if (node.isOnline !== false) online.push(name);
    if (node.isOffline !== false) onsite.push(name);
    for (const child of node.children || []) {
      const childName = child.name || child.title;
      if (child.isOnline !== false || node.isOnline !== false) online.push(childName);
      if (child.isOffline !== false || node.isOffline !== false) onsite.push(childName);
    }
  }
  return {
    online: [...new Set(online.filter(Boolean))],
    onsite: [...new Set(onsite.filter(Boolean))],
  };
}

export async function loadServiceCategoryGroups() {
  if (cachedGroups) return cachedGroups;
  try {
    const res = await publicAPI.getCategoryTree();
    const tree = Array.isArray(res?.tree) ? res.tree : [];
    const { online, onsite } = flattenTree(tree);
    cachedGroups = [
      { label: 'On-site categories', options: onsite },
      { label: 'Online categories', options: online },
    ];
    return cachedGroups;
  } catch {
    return null;
  }
}

export function serviceGroupsForWorkMode(groups, serviceMode) {
  if (!groups?.length) return null;
  const mode = String(serviceMode || '').toLowerCase();
  if (mode.includes('onsite') || mode.includes('offline') || mode === 'on-site') {
    return groups.filter((g) => g.label.toLowerCase().includes('on-site'));
  }
  if (mode.includes('remote') || mode.includes('online')) {
    return groups.filter((g) => g.label.toLowerCase().includes('online'));
  }
  return groups;
}
