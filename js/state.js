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
        { id: 'u1', name: '张伟 (团长)', role: 'captain', avatar: '👨🏻‍✈️', portableClaims: [] },
        { id: 'u2', name: '王强 (新)', role: 'newbie', avatar: '🛵', portableClaims: [] },
        { id: 'u3', name: '李娜 (员)', role: 'member', avatar: '👩🏻', portableClaims: [{ date: '2024-05-12', type: '轻微擦伤', amount: 500, group: '杭州蓝天团' }] },
        { id: 'u4', name: 'PICC (保)', role: 'insurer', avatar: '🏢' },
        { id: 'u5', name: 'Admin', role: 'admin', avatar: '🛡️' }
    ],
    // Dynamic Pricing & Risk Factors
    riskFactors: [
        {
            id: 'rf1',
            label: '工作区域',
            type: 'select',
            options: ['市中心繁忙区', '郊区工业园', '居民住宅区'],
            weight: 1.2
        },
        {
            id: 'rf2',
            label: '每日平均工时',
            type: 'number',
            unit: '小时',
            weight: 1.5
        }
    ],
    copilotMessages: [
        { role: 'system', content: '您好，我是您的定价 Copilot。请上传团单文档或询问定价策略。' }
    ],
    isCopilotOpen: false, // Default minimized
    memberProfiles: {
        'u3': { 'rf1': '市中心繁忙区', 'rf2': 10 }
    },
    // New Insurance Rules Data
    insuranceCycle: {
        startDate: '2025-12-01',
        durationDays: 30,
        currentLossRatio: 0.75, // Now above threshold (0.7)
        remainingDays: 6,
        nextEstimatedDiscount: -15
    },
    historicalData: {
        months: ['7月', '8月', '9月', '10月', '11月', '12月'],
        lossRatio: [0.45, 0.52, 0.48, 0.75, 0.68, 0.65],
        rateDiscount: [-25, -20, -22, -10, -12, -15]
    },
    riskThresholds: {
        maxLossRatio: 0.8,
        forbiddenDismissalRatio: 0.7 // If loss ratio > 70%, dismissal is restricted
    }
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
        type: '新申请',
        riskAssessment: {
            score: 4.2,
            details: { traffic: 'Low', medical: 'Medium', credit: 'Low' },
            summary: '日常骑行风格稳健，无重大违章记录。'
        },
        votes: { approve: 5, reject: 0, total: 10 }
    }
];
