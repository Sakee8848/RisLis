import { el } from '../utils.js';
import { state, setState } from '../state.js';

export function Header(title, functional = true) {
    return el('div', {
        class: 'glass',
        style: {
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }
    },
        el('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
            state.currentUser ? el('span', { style: { fontSize: '24px' } }, state.currentUser.avatar) : null,
            el('span', { style: { fontWeight: '700', fontSize: '20px' } }, title)
        ),
        functional ? el('button', {
            class: 'btn-secondary',
            style: { padding: '8px 12px', fontSize: '14px', borderRadius: '20px' },
            onClick: () => setState({ currentView: 'landing', currentUser: null })
        }, '退出登录') : null
    );
}
