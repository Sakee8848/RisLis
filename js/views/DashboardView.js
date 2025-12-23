import { el } from '../utils.js';
import { state, setState } from '../state.js';
import { Header } from '../components/Header.js';
import { AdminView } from './AdminView.js';

export function DashboardView() {
    const user = state.currentUser;
    if (!user) return el('div', {}, 'Error: No user logged in');

    // Role-based routing
    if (user.role === 'admin') return AdminView();
    if (user.role === 'insurer') return InsurerView();

    const isCaptain = user.role === 'captain';
    const isNewbie = user.role === 'newbie';

    return el('div', { class: 'animate-fade-in' },
        Header(isNewbie ? '申请状态' : state.group.name),

        el('div', { style: { padding: '20px' } },
            // Section: My Status / Group Status
            el('div', { class: 'card' },
                el('div', { class: 'text-sub', style: { marginBottom: '8px' } }, isCaptain ? '团队风险指数' : '我的风险评分'),
                el('div', { style: { display: 'flex', alignItems: 'baseline', gap: '8px' } },
                    el('span', { style: { fontSize: '48px', fontWeight: '800', color: isCaptain ? 'var(--warning)' : 'var(--success)' } }, isCaptain ? '4.2' : '1.8'),
                    el('span', { class: 'text-sub' }, '/ 10.0')
                ),
                el('div', { class: 'text-sub', style: { marginTop: '8px' } }, isCaptain ? '风险水平前 20%，需采取行动。' : '极佳。您已节省 45% 的保费。'),

                // Staircase Pricing Preview (Captain Only)
                isCaptain ? el('div', { style: { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' } },
                    el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
                        el('span', { class: 'text-sub' }, '当前保费折扣'),
                        el('span', { style: { fontWeight: '700', color: 'var(--success)' } }, '-20%')
                    ),
                    el('div', { style: { width: '100%', height: '6px', background: '#e5e5ea', borderRadius: '3px', position: 'relative' } },
                        el('div', { style: { width: '40%', height: '100%', background: 'var(--success)', borderRadius: '3px' } }), // 20% discount (mock visual)
                        el('div', { style: { position: 'absolute', right: '0', top: '-14px', fontSize: '10px', color: 'var(--text-secondary)' } }, '目标: -50%')
                    )
                ) : null
            ),

            // Section: Actions (Voting) - Visible to Captain and Regular Members
            state.group.pendingMembers.length > 0 && !isNewbie ?
                el('div', { class: 'card', style: { borderLeft: '4px solid var(--primary)' } },
                    el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' } },
                        el('h3', { class: 'title-medium' }, '需全员投票'),
                        el('span', { style: { background: 'var(--danger)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' } }, '2小时后截止')
                    ),
                    el('p', { style: { marginBottom: '16px' } }, `新申请人: ${state.group.pendingMembers[0].name}. AI 评分: ${state.group.pendingMembers[0].riskAssessment.score}`),
                    el('button', {
                        class: 'btn btn-primary',
                        style: { width: '100%' },
                        onClick: () => setState({ currentView: 'voting' })
                    }, '查看风险报告 & 投票')
                ) : null,

            // Section: Members (Captain Only)
            isCaptain ? MembersList() : null,

            // Section: Newbie View
            isNewbie ? NewbieView() : null
        )
    );
}

function MembersList() {
    return el('div', {},
        el('h3', { class: 'title-medium', style: { marginTop: '24px', marginBottom: '12px' } }, '成员关注列表'),
        el('div', { style: { display: 'grid', gap: '12px' } },
            state.group.members.map(m =>
                el('div', { class: 'card', style: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0' } },
                    el('div', {},
                        el('div', { style: { fontWeight: '600' } }, m.name),
                        el('div', { class: 'text-sub', style: { fontSize: '12px' } }, `加入于 ${m.joinDate}`)
                    ),
                    el('div', { style: { textAlign: 'right' } },
                        el('div', { style: { fontWeight: 'bold', color: m.riskScore > 5 ? 'var(--danger)' : 'var(--success)' } }, m.riskScore),
                        el('div', { class: 'text-sub', style: { fontSize: '10px' } }, '风险分')
                    )
                )
            )
        )
    );
}

function NewbieView() {
    return el('div', { class: 'card', style: { textAlign: 'center', padding: '40px 20px' } },
        el('div', { style: { fontSize: '48px', marginBottom: '16px' } }, '📋'),
        el('h3', { class: 'title-medium' }, '正在验证中'),
        el('p', { class: 'text-sub', style: { marginTop: '8px' } }, '您的数据已通过联邦学习技术安全提交。'),
        el('div', { style: { background: '#f5f5f5', borderRadius: '8px', padding: '12px', marginTop: '24px', textAlign: 'left' } },
            el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
                el('span', {}, '骑行数据'), el('span', { style: { color: 'var(--success)' } }, '✓ 已验证')
            ),
            el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
                el('span', {}, '医疗记录'), el('span', { style: { color: 'var(--success)' } }, '✓ 已验证')
            ),
            el('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                el('span', {}, '全员投票'), el('span', { style: { color: 'var(--warning)' } }, '⏳ 等待中')
            )
        )
    );
}

function InsurerView() {
    return el('div', { class: 'animate-fade-in' },
        Header('PICC 人保财险 - 仪表盘'),
        el('div', { style: { padding: '20px' } },
            el('div', { class: 'card', style: { background: '#1c1c1e', color: 'white' } },
                el('div', { class: 'text-sub', style: { color: '#8e8e93' } }, '活跃风团总数'),
                el('div', { class: 'title-large', style: { marginBottom: '0' } }, '128'),
                el('div', { style: { color: '#34c759', fontSize: '14px', marginTop: '4px' } }, '本周 +12%')
            ),

            el('h3', { class: 'title-medium', style: { marginTop: '24px', marginBottom: '12px' } }, '核心指标'),

            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' } },
                el('div', { class: 'card' },
                    el('div', { class: 'text-sub' }, '赔付率 (Loss Ratio)'),
                    el('div', { style: { fontSize: '24px', fontWeight: '700', color: 'var(--success)' } }, '32%'),
                    el('div', { class: 'text-sub', style: { fontSize: '12px' } }, '目标 < 60%')
                ),
                el('div', { class: 'card' },
                    el('div', { class: 'text-sub' }, '保费资金池'),
                    el('div', { style: { fontSize: '24px', fontWeight: '700' } }, '¥420万'),
                    el('div', { class: 'text-sub', style: { fontSize: '12px' } }, '年初至今')
                )
            ),

            el('h3', { class: 'title-medium', style: { marginTop: '24px', marginBottom: '12px' } }, '高风险团队预警'),
            el('div', { class: 'card', style: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                el('div', {},
                    el('div', { style: { fontWeight: '600' } }, '上海徐汇外卖 B 团'),
                    el('div', { class: 'text-sub', style: { fontSize: '12px' } }, '赔付率: 85%')
                ),
                el('button', { class: 'btn btn-secondary', style: { fontSize: '12px', padding: '6px 12px' } }, '审计')
            )
        )
    );
}
