export const state = {
    currentUser: null, // { id, name, role, avatar }
    currentView: 'landing', // landing, dashboard, voting, report, insurance
    group: {
        id: 'g1',
        name: '上海陆家嘴外卖团',
        type: 'Delivery',
        captainId: 'u1',
        members: [],
        pendingMembers: []
    },
    users: [
        { id: 'u1', name: '张伟 (团长)', role: 'captain', avatar: '👨🏻‍✈️' },
        { id: 'u2', name: '王强 (新)', role: 'newbie', avatar: '🛵' },
        { id: 'u3', name: '李娜 (员)', role: 'member', avatar: '👩🏻' },
        { id: 'u4', name: 'PICC (保)', role: 'insurer', avatar: '🏢' },
        { id: 'u5', name: 'Admin', role: 'admin', avatar: '🛡️' }
    ]
};

const listeners = [];

export function subscribe(listener) {
    listeners.push(listener);
}

export function setState(newState) {
    Object.assign(state, newState);
    notify();
}

function notify() {
    listeners.forEach(l => l(state));
}

// Initial Mock Data Population
// Add some mock members
state.group.members = [
    { id: 'm1', name: '赵云', riskScore: 2.1, status: 'active', joinDate: '2025-01-10' },
    { id: 'm2', name: '关羽', riskScore: 3.5, status: 'active', joinDate: '2025-01-12' },
    { id: 'm3', name: '张飞', riskScore: 6.8, status: 'warning', joinDate: '2025-01-15' },
];

state.group.pendingMembers = [
    { 
        id: 'p1', 
        name: '王强', 
        type: 'New Applicant', 
        riskAssessment: { 
            score: 4.2, 
            details: { traffic: 'Low', medical: 'Medium', credit: 'High' },
            summary: '平时骑行稳健，但有两次深夜急诊记录。'
        },
        votes: { approve: 5, reject: 0, total: 10 } 
    }
];
