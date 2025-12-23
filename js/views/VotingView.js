import { el } from '../utils.js';
import { state, setState } from '../state.js';
import { Header } from '../components/Header.js';

export function VotingView() {
    const candidate = state.group.pendingMembers[0]; // Mock: grab first pending
    if (!candidate) return el('div', {}, '暂无待处理投票。');

    return el('div', { class: 'animate-fade-in' },
        Header('全员公投'),

        el('div', { style: { padding: '20px', paddingBottom: '100px' } },
            // Candidate Card
            el('div', { class: 'card', style: { textAlign: 'center' } },
                el('div', { style: { fontSize: '64px', marginBottom: '16px' } }, '🛵'),
                el('h2', { class: 'title-medium' }, candidate.name),
                el('p', { class: 'text-sub' }, '申请投保：人身意外险 + 电动车险'),

                // Risk Score
                el('div', { style: { margin: '24px 0', padding: '16px', background: '#f5f5f7', borderRadius: '16px' } },
                    el('div', { class: 'text-sub', style: { marginBottom: '8px' } }, 'AI 风险评分'),
                    el('div', { style: { fontSize: '48px', fontWeight: '800', color: getKeyColor(candidate.riskAssessment.score) } }, candidate.riskAssessment.score),
                    el('div', {
                        style: {
                            height: '6px',
                            background: '#e5e5ea',
                            borderRadius: '3px',
                            margin: '8px auto',
                            width: '80%',
                            overflow: 'hidden',
                            position: 'relative'
                        }
                    },
                        el('div', {
                            style: {
                                width: `${candidate.riskAssessment.score * 10}%`,
                                background: getKeyColor(candidate.riskAssessment.score),
                                height: '100%'
                            }
                        })
                    ),
                    el('p', { style: { fontSize: '14px', marginTop: '12px', lineHeight: '1.4' } }, candidate.riskAssessment.summary),
                    el('button', {
                        class: 'btn btn-secondary',
                        style: { marginTop: '16px', fontSize: '14px' },
                        onClick: () => setState({ currentView: 'report' })
                    }, '查看完整报告详情 >')
                )
            ),

            // Voting Status
            el('div', { style: { marginBottom: '24px' } },
                el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
                    el('strong', {}, '当前共识'),
                    el('span', { class: 'text-sub' }, `${candidate.votes.approve} / ${candidate.votes.total} 已投票`)
                ),
                el('div', { style: { height: '8px', background: '#e5e5ea', borderRadius: '4px', overflow: 'hidden' } },
                    el('div', { style: { width: `${(candidate.votes.approve / candidate.votes.total) * 100}%`, height: '100%', background: 'var(--success)' } })
                ),
                el('p', { class: 'text-sub', style: { fontSize: '12px', marginTop: '8px' } }, '规则：一票否决制，任何反对票将直接导致拒保。')
            ),

            // Sticky Action Bar
            el('div', {
                class: 'glass',
                style: {
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '24px',
                    display: 'flex',
                    gap: '16px'
                }
            },
                el('button', {
                    class: 'btn btn-danger',
                    style: { flex: 1 },
                    onClick: () => {
                        alert('You voted NO. Application rejected based on the "One Veto" rule.');
                        setState({ currentView: 'dashboard' });
                    }
                }, '拒绝 (一票否决)'),
                el('button', {
                    class: 'btn btn-primary',
                    style: { flex: 2, backgroundColor: 'var(--success)' },
                    onClick: () => {
                        // Action: Approve
                        candidate.votes.approve += 1;
                        // Mock: If votes sufficient (e.g. > 50% or unanimous), simulate success
                        // For demo, just auto-approve after this vote to show dynamic change
                        alert('投票成功! (演示中模拟全票通过)');

                        state.group.members.push({
                            id: candidate.id,
                            name: candidate.name,
                            riskScore: candidate.riskAssessment.score,
                            status: 'active',
                            joinDate: '刚刚'
                        });
                        state.group.pendingMembers.shift();

                        setState({ currentView: 'dashboard' });
                    }
                }, '同意入团')
            )
        )
    );
}

function getKeyColor(score) {
    if (score < 3) return 'var(--success)';
    if (score < 7) return 'var(--warning)';
    return 'var(--danger)';
}
