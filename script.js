// Tutaj wstaw swoją funkcję toggleLegenda i zaladujDane
// Zaktualizuj fragment wewnątrz rysujGraf odpowiadający za wygląd węzła:

nodes.push({
    id: osoba.Id,
    label: `<b>${osoba.Imie} ${osoba.Nazwisko}</b>\n<span style="font-size:12px">${infoData}</span>`,
    shape: 'box',
    x: (Math.random() - 0.5) * 3000,
    y: (rok - minRok) * SKALA_Y,
    fixed: { y: true, x: false },
    font: { multi: 'html', color: '#ffffff', size: 16, face: 'Inter' },
    color: { 
        background: osoba.RokSmierci ? '#1e293b' : '#0c4a6e', 
        border: osoba.RokSmierci ? '#475569' : '#0284c7',
        highlight: { background: '#38bdf8', border: '#ffffff' }
    },
    borderWidth: 2,
    margin: { top: 12, bottom: 12, left: 20, right: 20 },
    shadow: { enabled: true, color: 'rgba(0,0,0,0.5)', size: 10 }
});
