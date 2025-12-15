import '../css/main.css';
import '../css/calculadora.css';

document.addEventListener('DOMContentLoaded', () => {
    // --- DADOS ATUALIZADOS CONFORME IMAGENS FORNECIDAS ---
    const priceData = {
        padrao: { // Preços da imagem "preços padrão.jpg"
            '22': [176000.00, 178640.00, 181319.60, 184039.39, 186799.98, 189601.98, 192446.01, 195332.70, 198262.70, 201236.64, 204255.19, 207319.01, 210428.80],
            '48': [384000.00, 389760.00, 395606.40, 401540.58, 407563.60, 413677.06, 419882.21, 426180.45, 432573.15, 439061.75, 445647.68, 452332.39, 459117.38],
            '59': [472000.00, 479080.00, 486266.20, 493560.19, 500963.60, 508478.05, 516105.22, 523846.80, 531704.50, 539680.07, 547775.27, 555991.90, 564331.78],
            '80': [640000.00, 649600.00, 659344.00, 669234.16, 679272.67, 689461.76, 699803.69, 710300.74, 720955.26, 731769.58, 742746.13, 753887.32, 765195.63]
        },
        investidor: { // Preços da imagem "preços investidor.jpg"
            '22': [148000.00, 149145.00, 147322.18, 149552.01, 151774.99, 154051.61, 156382.39, 158707.82, 161088.44, 163504.77, 165957.34, 168446.70, 170973.40],
            '48': [312000.00, 316680.00, 321430.20, 326251.66, 331145.43, 336112.61, 341154.30, 346271.61, 351465.69, 356737.67, 362088.74, 367520.07, 373032.87],
            '59': [383500.00, 389252.50, 395091.29, 401017.66, 407032.92, 413138.42, 419335.49, 425625.52, 432009.91, 438490.06, 445067.41, 451743.42, 458519.57],
            '80': [520000.00, 527800.00, 535717.00, 543752.78, 551909.05, 560187.68, 568590.50, 577119.35, 585776.15, 594592.79, 603481.23, 612503.45, 621721.45]
        }
    };
    const garagePrice = 30000;
    const ourMonthlyRate = 0.008;
    const avgBankMonthlyRate = 0.00873;
    const realisticAppreciationRate = 0.198;
    
    const marketRentalPrices = {
        '22': { padrao: 1850, mobiliado: 2640, decorado: 3025 },
        '48': { padrao: 2900, mobiliado: 4125, decorado: 4730 },
        '59': { padrao: 3600, mobiliado: 5115, decorado: 5830 },
        '80': { padrao: 4800, mobiliado: 6820, decorado: 7810 }
    };
    const condominiumFees = {
        '22': 300, '48': 550, '59': 700, '80': 950
    };
    const airbnbData = {
        '22': { daily: 220, occupancy: 0.65 },
        '48': { daily: 350, occupancy: 0.60 },
        '59': { daily: 440, occupancy: 0.60 },
        '80': { daily: 600, occupancy: 0.55 }
    };

    const garageCheckbox = document.getElementById('garage');
    const totalPriceElement = document.getElementById('totalPrice');
    const padraoDetails = document.getElementById('padrao-details');
    const investidorDetails = document.getElementById('investidor-details');
    
    let currentObraTotal = 0;
    let currentFinancingInstallment = 0;

    function setupButtonGroups() {
        document.querySelectorAll('.btn-group').forEach(group => {
            group.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;
                Array.from(group.children).forEach(child => child.classList.remove('active'));
                button.classList.add('active');
                
                if(group.id === 'obra-term-group') {
                    calculateAndDisplayObraInstallments();
                } else {
                    calculatePrice();
                }
            });
        });
        garageCheckbox.addEventListener('change', calculatePrice);
    }

    function setupTableHighlighting() {
        ['padrao-financiamento', 'investidor-financiamento'].forEach(id => {
            const table = document.getElementById(id);
            table.addEventListener('click', (e) => {
                const row = e.target.closest('tr');
                if (!row || row.parentNode.tagName === 'THEAD') return;
                Array.from(table.querySelectorAll('tbody tr')).forEach(r => r.classList.remove('active-row'));
                row.classList.add('active-row');
                
                if (id === 'padrao-financiamento') {
                    const installmentText = row.cells[1].textContent;
                    currentFinancingInstallment = parseFloat(installmentText.replace(/[^\d,-]/g, '').replace(',', '.'));
                    calculatePrice();
                }
            });
        });
    }

    function populateFloors() {
        const floorGroup = document.getElementById('floor-group');
        floorGroup.innerHTML = '';
        for (let i = 1; i <= 13; i++) {
            const button = document.createElement('button');
            button.dataset.value = i - 1;
            button.textContent = `${i}º`;
            button.className = 'p-2 text-sm rounded-md';
            if (i === 1) button.classList.add('active');
            floorGroup.appendChild(button);
        }
    }
    
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    }

    function calculateInstallment(principal, months, rate) {
        if (principal <= 0) return 0;
        if (rate <= 0) return principal / months;
        const i = rate;
        const n = months;
        const numerator = i * Math.pow(1 + i, n);
        const denominator = Math.pow(1 + i, n) - 1;
        return principal * (numerator / denominator);
    }
    
    function calculateAndDisplayObraInstallments() {
        const term = parseInt(document.querySelector('#obra-term-group .active').dataset.term, 10);
        const installment = calculateInstallment(currentObraTotal, term, ourMonthlyRate);
        document.getElementById('obra-installment-display').textContent = `${term}x de ${formatCurrency(installment)}`;
    }
    
    function generateRentalHTML(area, estimatedValue, isForPadrao, finish, condoFee) {
        const finishLabel = finish.charAt(0).toUpperCase() + finish.slice(1);
        const monthlyRental = marketRentalPrices[area]?.[finish] || 0;
        const netMonthlyRental = monthlyRental - condoFee;
        const annualNetRentalYield = (netMonthlyRental * 12 / estimatedValue) * 100;

        const airbnbInfo = airbnbData[area] || { daily: 0, occupancy: 0 };
        const airbnbMonthlyGross = airbnbInfo.daily * 30 * airbnbInfo.occupancy;
        
        let viabilityHTML = '';
        if(isForPadrao) {
            const totalMonthlyCost = currentFinancingInstallment + condoFee;
            const difference = totalMonthlyCost - monthlyRental;
            viabilityHTML = `
            <div class="mt-8 pt-6 border-t">
                <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">Análise de Viabilidade: Aluguel vs. Custo Mensal</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-center">
                     <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-sm text-gray-500">Parcela Financiamento</p>
                        <p class="text-lg font-bold text-gray-800">${formatCurrency(currentFinancingInstallment)}</p>
                    </div>
                    <div class="bg-gray-50 p-3 rounded-lg">
                        <p class="text-sm text-gray-500">Condomínio (Est.)</p>
                        <p class="text-lg font-bold text-gray-800">${formatCurrency(condoFee)}</p>
                    </div>
                     <div class="bg-indigo-100 p-3 rounded-lg">
                        <p class="text-sm text-indigo-800">Custo Mensal Total</p>
                        <p class="text-lg font-bold text-indigo-800">${formatCurrency(totalMonthlyCost)}</p>
                    </div>
                </div>
                <div class="text-center mt-4 p-3 rounded-lg ${difference > 0 ? 'bg-amber-100' : 'bg-emerald-100'}">
                    <p class="font-semibold ${difference > 0 ? 'text-amber-800' : 'text-emerald-800'}">
                        ${difference > 0 
                            ? `Faltam ${formatCurrency(difference)} para o aluguel (${formatCurrency(monthlyRental)}) cobrir seu custo mensal.`
                            : `O aluguel (${formatCurrency(monthlyRental)}) já cobre seu custo mensal com folga de ${formatCurrency(Math.abs(difference))}!`
                        }
                    </p>
                </div>
            </div>`;
        }
        
        return `
        <div class="border-t pt-8 mt-8">
            <h3 class="text-xl font-semibold text-gray-800 mb-4 text-center">Análise de Rentabilidade Pós-Entrega (Aluguel)</h3>
            <div class="text-center bg-gray-50 p-2 rounded-lg mb-4">
                <p class="text-sm text-gray-600">Estimativa de Condomínio: <span class="font-bold">${formatCurrency(condoFee)}/mês</span></p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h4 class="text-lg font-semibold text-gray-700 mb-3 text-center">Locação Tradicional (${finishLabel})</h4>
                    <div class="text-center">
                        <div class="bg-gray-50 p-4 rounded-lg mb-2">
                            <div class="text-sm text-gray-500">Aluguel Bruto Estimado</div>
                            <div class="text-lg font-bold text-gray-800">${formatCurrency(monthlyRental)}</div>
                        </div>
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <div class="text-sm text-blue-800">Rentabilidade Anual (Líquida)</div>
                            <div class="text-lg font-bold text-blue-800">${annualNetRentalYield.toFixed(2)}% a.a.</div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 class="text-lg font-semibold text-gray-700 mb-3 text-center">Locação Curta Duração (Airbnb)</h4>
                     <div class="text-center bg-gray-50 p-4 rounded-lg">
                        <p class="text-sm text-gray-500">Diária Média: ${formatCurrency(airbnbInfo.daily)}</p>
                        <p class="text-sm text-gray-500 mb-2">Ocupação Estimada: ${(airbnbInfo.occupancy * 100).toFixed(0)}%</p>
                        <div class="text-sm text-gray-500">Renda Mensal Bruta Estimada</div>
                        <p class="text-lg font-bold text-gray-800">${formatCurrency(airbnbMonthlyGross)}</p>
                    </div>
                </div>
            </div>
        </div>
        ${viabilityHTML}
        `;
    }

    function updatePaymentDetails(total) {
        const type = document.querySelector('#priceType-group .active').dataset.value;
        const area = document.querySelector('#area-group .active').dataset.value;
        const floorIndex = parseInt(document.querySelector('#floor-group .active').dataset.value, 10);
        const addGarage = garageCheckbox.checked;
        const finishElement = document.querySelector('#finish-group .active');
        const finish = finishElement?.dataset.value || 'padrao';
        
        const condoFee = condominiumFees[area] || 0;

        const basePricePadrao = priceData.padrao[area][floorIndex];
        const finishPricePerSqm = parseFloat(finishElement?.dataset.pricePerSqm || 0);
        const areaValue = parseFloat(area);
        const finishCost = finishPricePerSqm * areaValue;
        const valorApreciado = basePricePadrao * (1 + realisticAppreciationRate);
        const valorEstimadoEntrega = valorApreciado + (addGarage ? garagePrice : 0) + finishCost;

        if (type === 'padrao') {
            padraoDetails.classList.remove('hidden');
            investidorDetails.classList.add('hidden');

            const sinal = total * 0.05; 
            const obra = total * 0.15;
            const chaves = total * 0.15; 
            const saldo = total * 0.65;
            
            currentObraTotal = obra;

            document.getElementById('padrao-sinal').textContent = formatCurrency(sinal);
            document.getElementById('padrao-obra').textContent = formatCurrency(obra);
            document.getElementById('padrao-chaves').textContent = formatCurrency(chaves);
            document.getElementById('padrao-saldo').textContent = formatCurrency(saldo);

            calculateAndDisplayObraInstallments();

            const terms = [60, 90, 120, 150, 180, 200, 240];
            const table = document.getElementById('padrao-financiamento');
            let tableHTML = `<thead class="bg-gray-50"><tr class="text-xs font-medium text-gray-500 uppercase tracking-wider"><th class="px-3 py-2">Prazo</th><th class="px-3 py-2 text-indigo-600">Nossa Parcela</th><th class="px-3 py-2 text-pink-600">Média Bancos</th></tr></thead><tbody>`;
            
            const activeRowExists = document.querySelector('#padrao-financiamento .active-row');

            terms.forEach((term, index) => {
                const ourInstallment = calculateInstallment(saldo, term, ourMonthlyRate);
                const bankInstallment = calculateInstallment(saldo, term, avgBankMonthlyRate);
                
                let isActiveRow = false;
                if (!activeRowExists && index === 0) {
                     currentFinancingInstallment = ourInstallment;
                     isActiveRow = true;
                } else if (activeRowExists) {
                     const activeTermText = activeRowExists.cells[0].textContent;
                     const activeTerm = parseInt(activeTermText.replace(/\D/g, ''));
                     if(term === activeTerm) isActiveRow = true;
                }

                tableHTML += `<tr class="border-t ${isActiveRow ? 'active-row' : ''}"><td class="px-3 py-2 text-sm">${term} meses</td><td class="px-3 py-2 text-sm font-semibold text-indigo-600">${formatCurrency(ourInstallment)}</td><td class="px-3 py-2 text-sm text-gray-500">${formatCurrency(bankInstallment)}</td></tr>`;
            });
            table.innerHTML = tableHTML + '</tbody>';
            
            document.getElementById('padrao-rental-analysis').innerHTML = generateRentalHTML(area, valorEstimadoEntrega, true, finish, condoFee);

        } else { // investidor
            padraoDetails.classList.add('hidden');
            investidorDetails.classList.remove('hidden');
            currentFinancingInstallment = 0;

            const terms = [12, 18, 24, 36, 48];
            const table = document.getElementById('investidor-financiamento');
            let tableHTML = `<thead class="bg-gray-50"><tr class="text-xs font-medium text-gray-500 uppercase tracking-wider"><th class="px-4 py-2">Prazo</th><th class="px-4 py-2">Parcela</th></tr></thead><tbody>`;
            terms.forEach(term => {
                const installment = calculateInstallment(total, term, ourMonthlyRate);
                tableHTML += `<tr class="border-t"><td class="px-4 py-2">${term} meses</td><td class="px-4 py-2">${formatCurrency(installment)}</td></tr>`;
            });
            table.innerHTML = tableHTML + '</tbody>';

            const valorCompraInvestidor = total;
            const lucro = valorEstimadoEntrega - valorCompraInvestidor;
            const rentabilidade = (lucro / valorCompraInvestidor) * 100;
            
            document.getElementById('investidor-compra').textContent = formatCurrency(valorCompraInvestidor);
            document.getElementById('investidor-entrega').textContent = formatCurrency(valorEstimadoEntrega);
            document.getElementById('investidor-lucro').textContent = formatCurrency(lucro);
            document.getElementById('investidor-rentabilidade').textContent = `${rentabilidade.toFixed(2)}%`;

            const investorRentalContainer = document.getElementById('investor-rental-analysis');
            investorRentalContainer.innerHTML = generateRentalHTML(area, valorEstimadoEntrega, false, finish, condoFee);
        }
    }

    function calculatePrice() {
        const type = document.querySelector('#priceType-group .active')?.dataset.value;
        
        const areaElement = document.querySelector('#area-group .active');
        const area = areaElement?.dataset.value;
        const floorIndex = parseInt(document.querySelector('#floor-group .active')?.dataset.value, 10);
        const addGarage = garageCheckbox.checked;

        const finishElement = document.querySelector('#finish-group .active');
        const finishPricePerSqm = parseFloat(finishElement?.dataset.pricePerSqm || 0);

        if (type && area && !isNaN(floorIndex) && priceData[type]?.[area]?.[floorIndex] !== undefined) {
            let basePrice = priceData[type][area][floorIndex];
            
            const areaValue = parseFloat(area);
            const finishCost = finishPricePerSqm * areaValue;

            let finalPrice = basePrice + (addGarage ? garagePrice : 0) + finishCost;
            
            if(type === 'padrao' && currentFinancingInstallment === 0) {
                const saldo = finalPrice * 0.65;
                currentFinancingInstallment = calculateInstallment(saldo, 60, ourMonthlyRate);
            }
            
            totalPriceElement.textContent = formatCurrency(finalPrice);
            updatePaymentDetails(finalPrice);
        } else {
            totalPriceElement.textContent = 'Selecione as opções';
        }
    }
    
    // Inicialização
    populateFloors();
    setupButtonGroups();
    setupTableHighlighting();
    calculatePrice();
});