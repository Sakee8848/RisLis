import { el } from '../utils.js';
import { state } from '../state.js';
import { Header } from '../components/Header.js';

export function AdminView() {
    return el('div', { class: 'animate-fade-in' },
        Header('系统管理员'),
        el('div', { style: { padding: '20px' } },
            // System Stats
            el('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' } },
                StatCard('团队总数', '128', '+12'),
                StatCard('用户总数', '2,405', '+85'),
                StatCard('生效保单', '2,100', '+70'),
                StatCard('全局赔付率', '32%', '-2%', 'var(--success)')
            ),

            el('h3', { class: 'title-medium', style: { marginBottom: '16px' } }, '保险公司评估矩阵'),
            el('div', { style: { overflowX: 'auto', background: 'white', borderRadius: '16px', padding: '16px', boxShadow: 'var(--shadow-sm)' } },
                el('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' } },
                    el('thead', {},
                        el('tr', { style: { borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-secondary)' } },
                            el('th', { style: { padding: '12px 8px', fontWeight: '500' } }, '合作方'),
                            el('th', { style: { padding: '12px 8px', fontWeight: '500' } }, '条款友好度'),
                            el('th', { style: { padding: '12px 8px', fontWeight: '500' } }, '价格竞争力'),
                            el('th', { style: { padding: '12px 8px', fontWeight: '500' } }, '理赔体验'),
                            el('th', { style: { padding: '12px 8px', fontWeight: '500' } }, '品牌影响力')
                        )
                    ),
                    el('tbody', {},
                        InsurerMatrixRow('PICC (人保)', 4.8, 4.2, 4.9, 5.0),
                        InsurerMatrixRow('Ping An (平安)', 4.5, 4.6, 4.8, 5.0),
                        InsurerMatrixRow('CPIC (太保)', 4.0, 4.3, 3.8, 4.5)
                    )
                )
            ),

            el('h3', { class: 'title-medium', style: { marginTop: '24px', marginBottom: '16px' } }, '系统警报'),
            el('div', { class: 'card', style: { padding: '16px', borderLeft: '4px solid var(--danger)' } },
                el('div', { style: { fontWeight: '600' } }, '数据同步延迟'),
                el('div', { class: 'text-sub' }, '上海节点的交通数据 API 响应延迟 > 500ms。')
            )
        )
    );
}

function StatCard(label, value, change, color = 'var(--text-primary)') {
    return el('div', { class: 'card', style: { display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '0' } },
        el('span', { class: 'text-sub', style: { fontSize: '12px' } }, label),
        el('span', { style: { fontSize: '24px', fontWeight: '700', color: color } }, value),
        el('span', { style: { fontSize: '12px', color: 'var(--text-secondary)' } }, change)
    );
}

function InsurerMatrixRow(name, termScore, priceScore, claimScore, brandScore) {
    const getBar = (score) => {
        const percent = (score / 5) * 100;
        const color = score >= 4.5 ? 'var(--success)' : (score >= 4.0 ? 'var(--primary)' : 'var(--warning)');
        return el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            el('div', { style: { flex: 1, height: '6px', background: '#f5f5f7', borderRadius: '3px', overflow: 'hidden' } },
                el('div', { style: { width: `${percent}%`, height: '100%', background: color } })
            ),
            el('span', { style: { fontSize: '12px', fontWeight: '600', width: '24px', textAlign: 'right' } }, score.toFixed(1))
        );
    };

    return el('tr', { style: { borderBottom: '1px solid #f5f5f7' } },
        el('td', { style: { padding: '12px 8px', fontWeight: '500' } }, name),
        el('td', { style: { padding: '12px 8px' } }, getBar(termScore)),
        el('td', { style: { padding: '12px 8px' } }, getBar(priceScore)),
        el('td', { style: { padding: '12px 8px' } }, getBar(claimScore)),
        el('td', { style: { padding: '12px 8px' } }, getBar(brandScore))
    );
}
