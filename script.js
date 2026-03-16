function toggleLegenda() {
    const leg = document.getElementById('legenda');
    const btn = document.getElementById('toggle-btn');
    leg.classList.toggle('zminimalizowana');
    btn.innerHTML = leg.classList.contains('zminimalizowana') ? "▲" : "−";
}

async function zaladujDane() {
    try {
        let odp = await fetch("rodzina.json?t=" + new Date().getTime());
        if (odp.ok) { 
            rysujGraf(await odp.json()); 
        } else {
            console.error("Nie udało się załadować pliku rodzina.json");
        }
    } catch (e) { 
        console.error("Błąd ładowania danych:", e); 
    }
}

function rysujGraf(daneRodziny) {
    const SKALA_Y = 15; 
    let nodes = [];
    let edges = [];
    let unie = {}; 

    const lata = daneRodziny.map(o => o.RokUrodzenia).filter(r => r < 2100);
    const minRok = Math.min(...lata);

    daneRodziny.forEach(osoba => {
        let rok = osoba.RokUrodzenia > 2026 ? 2024 : osoba.RokUrodzenia;
        let infoData = osoba.RokUrodzenia;
        if (osoba.RokSmierci) { infoData += ` - † ${osoba.RokSmierci}`; }

        nodes.push({
            id: osoba.Id,
            label: `<b>${osoba.Imie} ${osoba.Nazwisko}</b>\n${infoData}`,
            shape: 'box',
            x: (Math.random() - 0.5) * 3000,
            y: (rok - minRok) * SKALA_Y,
            fixed: { y: true, x: false },
            font: { multi: 'html', color: '#ffffff', size: 16 },
            color: { 
                background: osoba.RokSmierci ? '#1e293b' : '#0c4a6e', 
                border: osoba.RokSmierci ? '#475569' : '#0284c7',
                highlight: { background: '#38bdf8', border: '#ffffff' }
            },
            margin: 15,
            widthConstraint: { minimum: 140 },
            shadow: { enabled: true, color: 'rgba(0,0,0,0.3)' }
        });
    });

    // Logika krawędzi (powiązań)
    daneRodziny.forEach(osoba => {
        if (osoba.IdOjca && osoba.IdMatki) {
            let para = [osoba.IdOjca, osoba.IdMatki].sort((a,b) => a-b).join('_');
            let idUnii = "unia_" + para;
            if (!unie[idUnii]) {
                unie[idUnii] = true;
                let o1 = daneRodziny.find(o => o.Id == osoba.IdOjca);
                let o2 = daneRodziny.find(o => o.Id == osoba.IdMatki);
                let rokUnii = Math.max(o1 ? o1.RokUrodzenia : 0, o2 ? o2.RokUrodzenia : 0) + 2; 
                nodes.push({
                    id: idUnii,
                    y: (rokUnii - minRok) * SKALA_Y,
                    shape: 'dot', size: 0, color: 'rgba(0,0,0,0)',
                    fixed: { y: true, x: false }
                });
                edges.push({ from: osoba.IdOjca, to: idUnii, arrows: '', color: '#64748b', width: 2 });
                edges.push({ from: osoba.IdMatki, to: idUnii, arrows: '', color: '#64748b', width: 2 });
            }
            edges.push({ from: idUnii, to: osoba.Id, arrows: 'to', color: '#64748b', width: 2 });
        } else if (osoba.IdOjca || osoba.IdMatki) {
            edges.push({ from: osoba.IdOjca || osoba.IdMatki, to: osoba.Id, arrows: 'to', color: '#64748b', width: 2 });
        }

        if (osoba.IdPartnera && osoba.Id < osoba.IdPartnera) {
            edges.push({ from: osoba.Id, to: osoba.IdPartnera, arrows: '', color: '#f59e0b', width: 2, dashes: [5, 5] });
        }
    });

    const options = {
        physics: {
            enabled: true,
            solver: 'repulsion',
            repulsion: { nodeDistance: 400, centralGravity: 0, springLength: 200, damping: 0.1 },
            stabilization: { iterations: 150 }
        },
        edges: {
            smooth: { enabled: true, type: 'cubicBezier', forceDirection: 'vertical', roundness: 0.5 }
        },
        interaction: { dragNodes: true, zoomView: true, dragView: true }
    };

    new vis.Network(document.getElementById('drzewo'), { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) }, options);
}

// Uruchomienie ładowania
zaladujDane();
