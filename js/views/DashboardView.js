import { el, elSvg } from '../utils.js';
import { state, setState } from '../state.js';
import { Header } from '../components/Header.js';
import { AdminView } from './AdminView.js';
import { InsurerView } from './InsurerView.js';

export function DashboardView() {
    const user = state.currentUser;
    if (!user) return el('div', {}, 'Error: No user logged in');

    // Role-based routing
    if (user.role === 'admin') return AdminView();
    if (user.role === 'insurer') return InsurerView();

    const isCaptain = user.role === 'captain';
    const isNewbie = user.role === 'newbie';
    const isMember = user.role === 'member';
    const showRiskProfile = isMember || isNewbie;

    return el('div', { class: 'animate-fade-in' },
        Header(isNewbie ? '申请状态' : state.group.name),

        el('div', { style: { padding: '20px' } },
            // Section: My Status / Group Status
            el('div', { class: 'card' },
                el('div', { class: 'text-sub', style: { marginBottom: '8px' } }, isCaptain ? '团队风险指数' : (isNewbie ? '申请风险评分 (预览)' : '我的风险评分')),
                el('div', { style: { display: 'flex', alignItems: 'baseline', gap: '8px' } },
                    el('span', { style: { fontSize: '48px', fontWeight: '800', color: isCaptain ? 'var(--warning)' : 'var(--success)' } }, isCaptain ? '4.2' : (state.memberProfiles[user.id] ? '1.8' : '2.5')),
                    el('span', { class: 'text-sub' }, '/ 10.0')
                ),
                el('div', { class: 'text-sub', style: { marginTop: '8px' } },
                    isCaptain ? (state.insuranceCycle.currentLossRatio > state.riskThresholds.forbiddenDismissalRatio ? '风险水平过高，功能受限。' : '风险水平前 20%，需采取行动。') :
                        (isNewbie ? '请完善资料以获得准确评分。' : `极佳。本月您节省了 ${Math.abs(state.insuranceCycle.nextEstimatedDiscount)}% 的保费。`)
                ),

                // Staircase Pricing Preview (Captain Only)
                isCaptain ? el('div', { style: { marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border)' } },
                    el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
                        el('span', { class: 'text-sub' }, '当前周期折扣'),
                        el('span', { style: { fontWeight: '700', color: 'var(--success)' } }, `${state.historicalData.rateDiscount[state.historicalData.rateDiscount.length - 1]}%`)
                    ),
                    el('div', { style: { width: '100%', height: '6px', background: '#e5e5ea', borderRadius: '3px', position: 'relative' } },
                        el('div', { style: { width: `${Math.abs(state.historicalData.rateDiscount[state.historicalData.rateDiscount.length - 1])}%`, height: '100%', background: 'var(--success)', borderRadius: '3px' } }),
                        el('div', { style: { position: 'absolute', right: '0', top: '-14px', fontSize: '10px', color: 'var(--text-secondary)' } }, '目标: -50%')
                    )
                ) : null
            ),

            // Profile Completion Action (Members & Newbies)
            showRiskProfile ? MemberRiskProfileCard(user) : null,

            // Section: Insurance Cycle & Trends
            CycleStatusCard(),

            el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' } },
                TrendChart('团队赔付率 (6月)', state.historicalData.lossRatio, 'var(--warning)', (v) => `${(v * 100).toFixed(0)}%`),
                TrendChart('费率波动 (6月)', state.historicalData.rateDiscount, 'var(--primary)', (v) => `${v}%`)
            ),

            // Refusal of Coverage Warning
            state.insuranceCycle.currentLossRatio >= state.riskThresholds.maxLossRatio ?
                el('div', { class: 'card', style: { background: 'var(--danger)', color: 'white', fontWeight: 'bold' } },
                    '🚨 严重警告：团队赔付率过高！已触发保司拒保阈值，请立即优化骑行行为。'
                ) : null,

            // Section: Portable Claims History (For Members)
            // Fix: Find user in state.users to ensure we have the latest portableClaims data
            (isMember && (state.users.find(u => u.id === user.id)?.portableClaims?.length > 0)) ?
                el('div', { class: 'card' },
                    el('h3', { class: 'title-medium', style: { marginBottom: '12px' } }, '个人理赔信用轨迹 (数据随身带)'),
                    (state.users.find(u => u.id === user.id).portableClaims).map(claim =>
                        el('div', { style: { padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '12px' } },
                            el('div', { style: { display: 'flex', justifyContent: 'space-between' } },
                                el('span', { style: { fontWeight: '600' } }, claim.type),
                                el('span', {}, claim.date)
                            ),
                            el('div', { class: 'text-sub' }, `金额: ¥${claim.amount} • 前所属风团: ${claim.group}`)
                        )
                    )
                ) : null,

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

function CycleStatusCard() {
    const cycle = state.insuranceCycle;
    return el('div', { class: 'card', style: { background: 'linear-gradient(135deg, #1C1C1E, #2C2C2E)', color: 'white', border: 'none' } },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
            el('div', {},
                el('div', { style: { fontSize: '12px', opacity: '0.7', marginBottom: '4px' } }, '折扣率统计周期剩余'),
                el('div', { style: { fontSize: '24px', fontWeight: '700' } }, `${cycle.remainingDays} 天`)
            ),
            el('div', { style: { textAlign: 'right' } },
                el('div', { style: { fontSize: '12px', opacity: '0.7', marginBottom: '4px' } }, '预计下周期折扣'),
                el('div', { style: { fontSize: '24px', fontWeight: '700', color: 'var(--success)' } }, `${cycle.nextEstimatedDiscount}%`)
            )
        ),
        el('div', { style: { height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' } },
            el('div', { style: { width: `${(1 - cycle.remainingDays / cycle.durationDays) * 100}%`, height: '100%', background: 'var(--primary)' } })
        )
    );
}

function TrendChart(title, data, color, formatter) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = (max - min) || 1;

    // Normalize values to fit within 10-40 Y range in a 0-50 height viewBox
    const points = data.map((v, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 40 - ((v - min) / range) * 30; // 10 to 40
        return `${x},${y}`;
    }).join(' ');

    return el('div', { class: 'card', style: { padding: '12px', marginBottom: '0' } },
        el('div', { style: { fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' } }, title),
        el('div', { style: { height: '60px', position: 'relative' } },
            elSvg('svg', { viewBox: '0 0 100 50', style: { width: '100%', height: '100%', overflow: 'visible', display: 'block' } },
                elSvg('polyline', {
                    points,
                    fill: 'none',
                    stroke: color,
                    strokeWidth: '3',
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round'
                })
            ),
            el('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '4px' } },
                el('span', { style: { fontSize: '10px', color: 'var(--text-secondary)' } }, formatter(data[0])),
                el('span', { style: { fontSize: '10px', color: 'var(--text-secondary)' } }, formatter(data[data.length - 1]))
            )
        )
    );
}

function MembersList() {
    const isRestricted = state.insuranceCycle.currentLossRatio > state.riskThresholds.forbiddenDismissalRatio;

    const handleDismiss = (member) => {
        if (isRestricted) {
            alert(`⚠️ 风险控制警示：\n当前团队赔付率 (${(state.insuranceCycle.currentLossRatio * 100).toFixed(0)}%) 已超过安全阈值 (${(state.riskThresholds.forbiddenDismissalRatio * 100).toFixed(0)}%)。\n\n根据保司规则，在统计周期结束前，暂不能移出风险成员，以确保保障的连续性。`);
            return;
        }
        if (confirm(`确定要移除成员 ${member.name} 吗？`)) {
            const newMembers = state.group.members.filter(m => m.id !== member.id);
            setState({ group: { ...state.group, members: newMembers } });
        }
    };

    return el('div', {},
        el('h3', { class: 'title-medium', style: { marginTop: '24px', marginBottom: '12px' } }, '成员管理'),
        isRestricted ? el('div', { style: { background: 'rgba(255, 149, 0, 0.1)', color: 'var(--warning)', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '12px', border: '1px solid var(--warning)' } },
            'ⓘ 当前团队风险较高，部分成员管理功能受限。'
        ) : null,
        el('div', { style: { display: 'grid', gap: '12px' } },
            state.group.members.map(m =>
                el('div', { class: 'card', style: { padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0' } },
                    el('div', {},
                        el('div', { style: { fontWeight: '600' } }, m.name),
                        el('div', { class: 'text-sub', style: { fontSize: '12px' } }, `加入于 ${m.joinDate}`),
                        // Portable claims record indicator
                        (state.users.find(u => u.name.includes(m.name))?.portableClaims?.length > 0) ?
                            el('span', { style: { background: 'rgba(255, 59, 48, 0.1)', color: 'var(--danger)', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' } }, '⚠️ 带病投保/历史理赔记录跟随') : null
                    ),
                    el('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
                        el('div', { style: { textAlign: 'right' } },
                            el('div', { style: { fontWeight: 'bold', color: m.riskScore > 5 ? 'var(--danger)' : 'var(--success)' } }, m.riskScore),
                            el('div', { class: 'text-sub', style: { fontSize: '10px' } }, '风险分')
                        ),
                        el('button', {
                            class: 'btn btn-secondary',
                            style: { padding: '4px 8px', fontSize: '12px', opacity: isRestricted ? '0.5' : '1' },
                            onClick: () => handleDismiss(m)
                        }, '移出')
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

function MemberRiskProfileCard(user) {
    const profile = state.memberProfiles[user.id] || {};
    const filledCount = Object.keys(profile).length;
    const totalFactors = state.riskFactors.length;
    const isComplete = filledCount >= totalFactors;

    if (isComplete) return null; // Hide if complete (or show "View Profile")

    return el('div', { class: 'card', style: { borderLeft: '4px solid var(--warning)' } },
        el('h3', { class: 'title-medium' }, '完善您的风险资料'),
        el('p', { class: 'text-sub', style: { marginBottom: '12px' } }, '为了确保精确的保费计算，请补充您的风险因子信息。'),

        // Form
        el('div', { style: { display: 'grid', gap: '12px' } },
            state.riskFactors.map(factor => {
                const currentValue = profile[factor.id] || '';
                return el('div', {},
                    el('label', { style: { display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' } }, factor.label),
                    factor.type === 'select' ?
                        el('select', {
                            style: { width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' },
                            onChange: (e) => {
                                const newProfile = { ...profile, [factor.id]: e.target.value };
                                state.memberProfiles[user.id] = newProfile;
                                setState({ memberProfiles: state.memberProfiles });
                            }
                        },
                            el('option', { value: '' }, '请选择...'),
                            factor.options.map(opt => el('option', { value: opt, selected: currentValue === opt }, opt))
                        )
                        :
                        el('input', {
                            type: factor.type,
                            value: currentValue,
                            style: { width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border)' },
                            onInput: (e) => {
                                const newProfile = { ...profile, [factor.id]: e.target.value };
                                state.memberProfiles[user.id] = newProfile;
                                setState({ memberProfiles: state.memberProfiles }); // Trigger re-render
                            }
                        })
                );
            })
        ),

        // Disclaimer
        el('div', { style: { marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'flex-start' } },
            el('input', { type: 'checkbox', id: 'disclaimer', style: { marginTop: '4px' } }),
            el('label', { for: 'disclaimer', style: { fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' } },
                '本人承诺上述信息真实有效。虚假申报可能导致保单失效、拒赔或承担相应法律责任。'
            )
        ),

        el('button', {
            class: 'btn btn-primary',
            style: { width: '100%', marginTop: '16px' },
            onClick: () => {
                const checkbox = document.getElementById('disclaimer');
                if (!checkbox.checked) {
                    alert('请勾选法律声明以继续。');
                    return;
                }
                alert('资料已提交更新。');
            }
        }, '提交更新')
    );
}
