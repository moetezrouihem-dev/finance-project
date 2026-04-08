function switchTab(tabId, element) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
    element.classList.add('active');
}

let chartEpargneInstance = null;
let chartPfInstance = null;

function calculerEpargne() {
    const C = parseFloat(document.getElementById('ep_C').value);
    const t = parseFloat(document.getElementById('ep_t').value);
    const n = parseFloat(document.getElementById('ep_n').value);

    if (!C || !t || !n) return;

    const interets = C * (t/100) * (n/12);
    const total = C + interets;

    document.getElementById('res_epargne').style.display = "block";
    document.getElementById('val_acquise').innerText = total.toFixed(2) + " DT";
    document.getElementById('val_interets').innerText = interets.toFixed(2) + " DT";

    const ctx = document.getElementById('chartEpargne').getContext('2d');
    if (chartEpargneInstance) chartEpargneInstance.destroy();

    chartEpargneInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Capital', 'Intérêts'],
            datasets: [{
                data: [C, interets],
                backgroundColor: ['#3b82f6', '#10b981'],
                borderWidth: 0
            }]
        },
        options: { plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }
    });
}

function calculerEscompte() {
    const V = parseFloat(document.getElementById('esc_V').value);
    const n = parseFloat(document.getElementById('esc_n').value);
    const t = parseFloat(document.getElementById('esc_t').value);

    if (!V || !n || !t) return;

    const escompte = (V * t * n) / 36000;
    const net = V - escompte;

    document.getElementById('res_escompte_details').style.display = "block";
    document.getElementById('val_esc_comm').innerText = "- " + escompte.toFixed(2) + " DT";
    document.getElementById('val_esc_net').innerText = net.toFixed(2) + " DT";
}

function calculerEmprunt() {
    const K = parseFloat(document.getElementById('emp_K').value);
    const i_pc = parseFloat(document.getElementById('emp_i').value);
    const n = parseInt(document.getElementById('emp_n').value);

    if (!K || !i_pc || !n) return;

    const i = i_pc / 100;
    const a = K * (i / (1 - Math.pow(1 + i, -n)));

    let html = "";
    let capitalRestant = K;

    for(let an = 1; an <= n; an++) {
        let interet = capitalRestant * i;
        let amortissement = a - interet;
        if (an === n) amortissement = capitalRestant;
        
        html += `
            <tr>
                <td>${an}</td>
                <td>${capitalRestant.toFixed(2)}</td>
                <td class="neg-val">${interet.toFixed(2)}</td>
                <td style="color:#10b981">${amortissement.toFixed(2)}</td>
                <td class="primary-text" style="font-weight:bold">${(amortissement+interet).toFixed(2)}</td>
            </tr>
        `;
        capitalRestant -= amortissement;
    }
    document.querySelector('#table_emprunt tbody').innerHTML = html;
}

function updatePfDisplay(val) {
    document.getElementById('lbl_w1').innerText = val;
    document.getElementById('lbl_w2').innerText = 100 - val;
}

function calculerPortefeuille() {
    const r1 = parseFloat(document.getElementById('pf_r1').value);
    const r2 = parseFloat(document.getElementById('pf_r2').value);
    const w1 = parseFloat(document.getElementById('pf_w1').value) / 100;

    const globalReturn = (w1 * r1) + ((1 - w1) * r2);

    document.getElementById('res_pf').style.display = "block";
    document.getElementById('pf_global').innerText = globalReturn.toFixed(2) + " %";

    const ctx = document.getElementById('chartPf').getContext('2d');
    if (chartPfInstance) chartPfInstance.destroy();

    chartPfInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'Global'],
            datasets: [{
                data: [r1, r2, globalReturn],
                backgroundColor: ['#3b82f6', '#8b5cf6', '#10b981']
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, ticks: { color: 'white' } },
                x: { ticks: { color: 'white' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}
