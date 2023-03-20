var configBubble, configTopV, configTopT;
var myChartBubble, myChartTopV, myChartTopT;
var ctxBubble, ctxTopV, ctxTopT;
var chartBubble, chartTopT, chartTopV;
var desc_num_list = [];
var desc_den_list = []; 
var list_uni_fis = ["0","1","2","3","4","5","6","7","8","9","10","11","17","21","22","23","24","25","26"];
var list_uni_tel = ["12","13","14","15","16","18","19","20"];
var checkboxSelezionate;
var sorgente_dati;
var lista_indicatori;
var uni_top_sel = [];
var uni_top_sel_trend = [];
var uni_top_sel_val = [];

$(document).ready(function() {
	
	sorgente_dati = JSON.parse(getSorgenteDati());
	lista_indicatori = JSON.parse(getLabelIndicatori());
	popolaComboIndicatori(lista_indicatori);
	popolaListaUniversita();
	$('#table-custom-id').addClass('hide').removeClass('show');
	$('#radio-top').addClass('hide').removeClass('show');

	let checkboxes = $("input[type=checkbox][name=check-uni]");
	checkboxSelezionate = [];

	$('input[type=radio][name=top-value]').change(function() {
		costruisciGraficoTop();
		creaStrutturaGraficoTopValue();
		creaStrutturaGraficoTopTrend();
	});

	checkboxes.change(function() {
		checkboxSelezionate = checkboxes
		  .filter(":checked")
		  .map(function() { 
			return this.value;
		  }) 
		  .get()
		  
		  if (this.value == 99) {
			selezionaDeselezionaTutteUni(this.checked);
		  } else if (this.value == 999) {
			selezionaDeselezionaTutteUniTelematiche(this.checked);
		  } else if (this.value == 50) {
			selezionaDeselezionaTutteUniFisiche(this.checked);
		  } else {
			selezionaDeselezionaSingolaUni(this.checked);
		  }

		  if (checkboxesSelezionateCount() == 1 && this.value != 99 && this.value != 999 && this.value != 50) {
			configBubble = costruisciGraficoDispersione();
			myChartBubble = document.getElementById('grafico-dispersione');
			ctxBubble = myChartBubble.getContext('2d');

			if (chartBubble != null) {
				chartBubble.destroy();
			}

			chartBubble = new Chart(ctxBubble, configBubble);

			$('#grafico-d').addClass('show').removeClass('hide');
			$('#table-custom-id').addClass('show').removeClass('hide');
			costruisciTabellaIndicatori();
		  } else if (checkboxesSelezionateCount() == 0 || checkboxesSelezionateCount() > 1) {
			$('#grafico-d').addClass('hide').removeClass('show');
			$('#table-custom-id').addClass('hide').removeClass('show');
		  }		

		  if (checkboxesSelezionateCount() > 10) {
			$('#radio-top').addClass('show').removeClass('hide');
			$('#top-five-id')[0].checked = true;
		  } else {
			$('#radio-top').addClass('hide').removeClass('show');
		  }
		  
		  if (checkboxesSelezionateCount() > 5) {
			$('#grafico-top-valore').addClass('show').removeClass('hide');
			$('#grafico-top-trend').addClass('show').removeClass('hide');
			costruisciGraficoTop();
			creaStrutturaGraficoTopValue();
			creaStrutturaGraficoTopTrend();
		  } else {
			$('#grafico-top-valore').addClass('hide').removeClass('show');
			$('#grafico-top-trend').addClass('hide').removeClass('show');
		  }

	  });
	
		
	$( "#ind-select" ).change(function() {

		if (checkboxesSelezionateCount() == 1) {
			configBubble = costruisciGraficoDispersione();
			myChartBubble = document.getElementById('grafico-dispersione');
			ctxBubble = myChartBubble.getContext('2d');

			if (chartBubble != null) {
				chartBubble.destroy();
			}

			chartBubble = new Chart(ctxBubble, configBubble);
		}

		if (checkboxesSelezionateCount() > 5) {
			costruisciGraficoTop();
			creaStrutturaGraficoTopValue();
			creaStrutturaGraficoTopTrend();
		}

	});

	
});

function creaStrutturaGraficoTopValue() {
	let descUniSel = [];
	let topValueSel = [];
	let numero_top_value = $("#radio-top input[type='radio'][name='top-value']:checked").val();

	for(let k=0; k<uni_top_sel_val.length; k++) {
		descUniSel.push(uni_top_sel_val[k].uni);
		topValueSel.push(uni_top_sel_val[k].value);
	}
	
	var strutturaGraficoTopValue = {
		type : 'horizontalBar',
		data : {
			labels : descUniSel,
			datasets : [ {
				label : 'Valore',
				data : topValueSel,
				backgroundColor : 'rgb(81, 136, 52)',
				borderColor : 'rgb(65, 65, 65)',
				pointBackgroundColor: 'rgb(237, 125, 49)'
			}
			]
		},

		options : {
			responsive: true,
			legend: {
				display: false
			},
			title: {
				display: true,
				fontSize: 18,
				fontColor: '#000',
				fontFamily: 'Arial', 
				position: 'top',
				text: 'Top ' + numero_top_value + ' per Valore'
			},
			scales: {
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Valore indicatore"
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Università"
					}
				}]
			},
			tooltips : {
				callbacks : {
					title : function(tooltipItem, data) {
						return uni_top_sel_val[tooltipItem[0]['index']].uni;
					},
					label : function(tooltipItem, data) {
						value = Number(uni_top_sel_val[tooltipItem['index']].value);
						descValue = 'Valore 2022: ' + value.toFixed(3) + "%";
						return [ descValue ];

					}
				},
				backgroundColor : '#FFF',
				titleFontSize : 16,
				titleFontColor : '#000',
				bodyFontColor : '#000',
				bodyFontSize : 14,
				displayColors : false,
				borderColor : 'rgba(0,0,0,1)',
				borderWidth : 1
			}
		}
	};

	configTopV = strutturaGraficoTopValue;
	myChartTopV = document.getElementById('grafico-top-valore-chart');
	ctxTopV = myChartTopV.getContext('2d');

	if (chartTopV != null) {
		chartTopV.destroy();
	}

	chartTopV = new Chart(ctxTopV, configTopV);
	chartTopV.canvas.parentNode.style.width = '700px';
	chartTopV.canvas.parentNode.style.height = '400px';
	chartTopV.update();
}

function creaStrutturaGraficoTopTrend() {
	let descUniSel = [];
	let topTrendSel = [];
	let numero_top_trend = $("#radio-top input[type='radio'][name='top-value']:checked").val();

	for(let k=0; k<uni_top_sel_trend.length; k++) {
		descUniSel.push(uni_top_sel_trend[k].uni);
		topTrendSel.push(uni_top_sel_trend[k].trend);
	}
	
	var strutturaGraficoTopTrend = {
		type : 'horizontalBar',
		data : {
			labels : descUniSel,
			datasets : [ {
				label : 'Trend',
				data : topTrendSel,
				backgroundColor : 'rgb(0, 131, 208)',
				borderColor : 'rgb(65, 65, 65)',
				pointBackgroundColor: 'rgb(237, 125, 49)'
			}
			]
		},

		options : {
			responsive: true,
			legend: {
				display: false
			},
			title: {
				display: true,
				fontSize: 18,
				fontColor: '#000',
				fontFamily: 'Arial', 
				position: 'top',
				text: 'Top ' + numero_top_trend + ' per Trend'
			},
			scales: {
				xAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Trend"
					}
				}],
				yAxes: [{
					scaleLabel: {
						display: true,
						labelString: "Università"
					}
				}]
			},
			tooltips : {
				callbacks : {
					title : function(tooltipItem, data) {
						return uni_top_sel_trend[tooltipItem[0]['index']].uni;
					},
					label : function(tooltipItem, data) {
						value = Number(uni_top_sel_trend[tooltipItem['index']].trend);
						descValue = 'Trend: ' + value.toFixed(3) + "%";
						return [ descValue ];

					}
				},
				backgroundColor : '#FFF',
				titleFontSize : 16,
				titleFontColor : '#000',
				bodyFontColor : '#000',
				bodyFontSize : 14,
				displayColors : false,
				borderColor : 'rgba(0,0,0,1)',
				borderWidth : 1
			}
		}
	};

	configTopT = strutturaGraficoTopTrend;
	myChartTopT = document.getElementById('grafico-top-trend-chart');
	ctxTopT = myChartTopT.getContext('2d');

	if (chartTopT != null) {
		chartTopT.destroy();
	}

	chartTopT = new Chart(ctxTopT, configTopT);
	chartTopT.canvas.parentNode.style.width = '700px';
	chartTopT.canvas.parentNode.style.height = '400px';
	chartTopT.update();
}

function costruisciGraficoTop() {
	var elem_sel_ind = $('#ind-select').val();
	var numero_top = (checkboxesSelezionateCount() > 10) ? $("#radio-top input[type='radio'][name='top-value']:checked").val() : 5;
	
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	let descUni, value2022Sel, valueInit;
	uni_top_sel = [];
	for (var i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].checked && checkboxes[i].value != "99" && checkboxes[i].value != "999" && checkboxes[i].value != "50") {
			descUni = sorgente_dati[checkboxes[i].value]['value'];

			value2022Sel = sorgente_dati[checkboxes[i].value]['indicatori'][elem_sel_ind]['valore-2022'];
			value2022Sel = (value2022Sel != "NR" && value2022Sel != "ND") ? value2022Sel : 0;
			
			valueInit = sorgente_dati[checkboxes[i].value]['indicatori'][elem_sel_ind]['valore-iniziale'];
			valueInit = (valueInit != "NR" && valueInit != "ND") ? valueInit : 0;

			trendSel = valueInit - value2022Sel; 
			uni_top_sel.push({'uni': descUni, 'value': value2022Sel, 'trend': trendSel});
		}
	}

	uni_top_sel.sort(compareValue);
	uni_top_sel_val = [];

	for (let k=0; k< uni_top_sel.length && k<numero_top; k++) {
		uni_top_sel_val.push(uni_top_sel[k]);
	}

	uni_top_sel_trend = [];
	uni_top_sel.sort(compareTrend);

	for (let k=0; k< uni_top_sel.length && k<numero_top; k++) {
		uni_top_sel_trend.push(uni_top_sel[k]);
	}
	
}

function compareValue(a, b) {
	if (Number(a.value) < Number(b.value)) {
		return 1;
	}
	if (Number(a.value) > Number(b.value)) {
		return -1;
	}
	return 0;
}

function compareTrend(a, b) {
	if (Number(a.trend) < Number(b.trend)) {
		return 1;
	}
	if (Number(a.trend) > Number(b.trend)) {
		return -1;
	}
	return 0;
}

function checkboxesSelezionateCount() {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	let checkSel = 0;
	for (var i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			checkSel++;
		}
	}
	return checkSel;	
}

function costruisciGraficoDispersione() {

	var elem_sel_ind = $('#ind-select').val();

	var idUniSel = checkboxSelezionate[0];
	var uniSelValueDataset = [];
	var descUnivSel;
	var listaAltreUniDataset = [];

	var rapportoBolle;
	
	if (elem_sel_ind == 4) {
		rapportoBolle = 0.1;
	} else if (elem_sel_ind == 5) {
		rapportoBolle = 300;
	} else if (elem_sel_ind == 2){
		rapportoBolle = 50;
	} else {
		rapportoBolle = 20;
	}

	for (let i=0; i<sorgente_dati.length; i++) {

		var bollaUni = {x:i+1, 
			y:0, 
			r:sorgente_dati[i]['indicatori'][elem_sel_ind]['valore-2022']*rapportoBolle
		};
		
		if (sorgente_dati[i]['id'] == idUniSel) {
			descUnivSel = sorgente_dati[i]['value'];
			uniSelValueDataset.push(bollaUni);
		} else {
			listaAltreUniDataset.push(bollaUni);
		}
	}

	return {
		type : 'bubble',
		data : {
			datasets : [ {
				label : descUnivSel,
				backgroundColor : 'rgb(30,144,255)',
				borderColor : 'rgb(0,0,0)',
				hoverBackgroundColor: 'rgb(30,100,255)',
				data : uniSelValueDataset
			},
			{
				label : 'Altre università',
				data : listaAltreUniDataset,
				backgroundColor : 'rgb(255,140,0)',
				hoverBackgroundColor: 'rgb(255,89,0)',
				borderColor : 'rgb(0,0,0)',
				pointBackgroundColor: 'rgb(255,140,0)'
			}
			]
		},
		options : {
			responsive: true,
			tooltips : {
				callbacks : {
					title : function(tooltipItem, data) {

						if (tooltipItem[0]['datasetIndex'] == 1)
							return sorgente_dati[tooltipItem[0]['index']]['value'];
						return descUnivSel;
					},
					label : function(tooltipItem, data) {
						if (tooltipItem['datasetIndex'] == 1) {
							valuePrec = Number(sorgente_dati[tooltipItem['index']]['indicatori'][elem_sel_ind]['valore-iniziale']);
							value2022 = Number(sorgente_dati[tooltipItem['index']]['indicatori'][elem_sel_ind]['valore-2022']);
							descPrec = 'Valore precedente: ' + valuePrec.toFixed(3) + "%";
							desc2022 = 'Valore 2022: ' + value2022.toFixed(3) + "%";
							valueTrend = valuePrec - value2022;
							trend = 'Trend: ' + valueTrend.toFixed(3) + "%";
						} else {
							valuePrec = Number(sorgente_dati[idUniSel]['indicatori'][elem_sel_ind]['valore-iniziale']);
							value2022 = Number(sorgente_dati[idUniSel]['indicatori'][elem_sel_ind]['valore-2022']);
							descPrec = 'Valore precedente: ' + valuePrec.toFixed(3) + "%";
							desc2022 = 'Valore 2022: ' + value2022.toFixed(3) + "%";
							valueTrend = valuePrec - value2022;
							trend = 'Trend: ' + valueTrend.toFixed(3) + "%";
						}
						
						return [ descPrec, desc2022, trend ];

					}
				},
				backgroundColor : '#FFF',
				titleFontSize : 16,
				titleFontColor : '#000',
				bodyFontColor : '#000',
				bodyFontSize : 14,
				displayColors : false,
				borderColor : 'rgba(0,0,0,1)',
				borderWidth : 1
			},
			scales: {
				 yAxes: [ {
					ticks: {
						min: -2,
						max: 2
					},
					scaleLabel: {
					  display: true,
					  labelString: 'Valore indicatore'
					}
				 } ],
				 xAxes : [ { 
					scaleLabel: {
					  display: true,
					  labelString: 'Università'
					}
				 } ]
			},
			legend: {
				display: true,
				labels: {
					useLineStyle: true,
					usePointStyle: true
				}
			}
		}
	}

}

function costruisciTabellaIndicatori() {
	var uniSelezionata = checkboxSelezionate[0];
	var listaIndicatori = sorgente_dati[uniSelezionata]['indicatori'];
	$('#content-body').empty();

	for (var k=0; k<listaIndicatori.length; k++) {

		let descValPrec = (listaIndicatori[k]['valore-iniziale'] == 'ND' || listaIndicatori[k]['valore-iniziale'] == 'NR') ? listaIndicatori[k]['valore-iniziale'] : listaIndicatori[k]['valore-iniziale'] + "%";
		let descVal2022 = (listaIndicatori[k]['valore-2022'] == 'ND' || listaIndicatori[k]['valore-2022'] == 'NR') ? listaIndicatori[k]['valore-2022'] : listaIndicatori[k]['valore-2022'] + "%";
		let trend;
		
		if (listaIndicatori[k]['valore-iniziale'] != 'ND' && listaIndicatori[k]['valore-iniziale'] != 'NR'
				&& listaIndicatori[k]['valore-2022'] != 'ND' && listaIndicatori[k]['valore-2022'] != 'NR') {
			trend = listaIndicatori[k]['valore-iniziale'] - listaIndicatori[k]['valore-2022'];
			trend = trend.toFixed(3) + "%";
		} else {
			trend = 'ND';
		}

		let denIndicatore = lista_indicatori[k]['value'].substr(0,3);

		$('#content-body').append('<tr>');
		$('#content-body').append('<td>'+ denIndicatore +'</td>');
		$('#content-body').append('<td>'+ descValPrec +'</td>');
		$('#content-body').append('<td>'+ descVal2022 + '</td>');
		$('#content-body').append('<td>'+ trend +'</td>');
		$('#content-body').append('</tr>');
	}

}

function selezionaDeselezionaTutteUni(checked) {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		checkboxes[i].checked = checked;
	}
}

function selezionaDeselezionaTutteUniTelematiche(checked) {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		if (list_uni_tel.includes(checkboxes[i].value)) {
			checkboxes[i].checked = checked;
		}
		if (checkboxes[i].value == "99") {
			checkboxes[i].checked = false;
		}
	}
}

function selezionaDeselezionaTutteUniFisiche(checked) {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		if (list_uni_fis.includes(checkboxes[i].value)) {
			checkboxes[i].checked = checked;
		}
		if (checkboxes[i].value == "99") {
			checkboxes[i].checked = false;
		}
	}
}

function selezionaDeselezionaSingolaUni(checked) {
	let checkboxes = $("input[type=checkbox][name=check-uni]");
	for (var i=0; i<checkboxes.length; i++) {
		if (checkboxes[i].value == "99" || checkboxes[i].value == "999" || checkboxes[i].value == "50") {
			checkboxes[i].checked = false;
		}
	}
}

function popolaListaUniversita() {
	var x = document.getElementById("ind-uni");
	var checkbox;
	var label;
	var br;

	for (var i = 0; i < sorgente_dati.length; i++) {
		checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("value", sorgente_dati[i]['id']);
		checkbox.setAttribute("id", "uni" + sorgente_dati[i]['id']);
		checkbox.setAttribute("name", "check-uni");
		x.appendChild(checkbox);

		label = document.createElement("label");
		label.htmlFor = "uni" + sorgente_dati[i]['id'];
		label.innerHTML = sorgente_dati[i]['value'];
		x.appendChild(label);

		br = document.createElement("br");
		x.appendChild(br);
	}
		
}

function popolaComboIndicatori(lista_indicatori) {
	var x = document.getElementById("ind-select");
	var option;
	
	for (var i = 0; i < lista_indicatori.length; i++) {
		option = document.createElement("option");
		option.text = lista_indicatori[i]['value'];
		option.value = lista_indicatori[i]['id'];
		x.add(option);
	}
		
}

function getLabelIndicatori() {
	return `
	[
		{
			"id" : "0",
			"value": "A_A - Proporzione di studenti che si iscrivono al II anno della stessa classe di laurea o laurea magistrale a ciclo unico (L, LMCU) avendo acquisito almeno 40 CFU in rapporto alla coorte di immatricolati nell'a.a. precedente"
		},
		{
			"id" : "1",
			"value": "A_B - Proporzione dei docenti di ruolo indicati come docenti di riferimento che appartengono a settori scientifico-disciplinari (SSD) di base e caratterizzanti nei corsi di studio (L, LM, LMCU) attivati"
		},
		{
			"id" : "2",
			"value": "B_A - Rapporto fra gli iscritti al primo anno dei corsi di dottorato con borsa di studio rispetto al totale dei docenti di ruolo"
		},
		{
			"id" : "3",
			"value": "C_A - Proporzione dei laureandi complessivamente soddisfatti del Corso di Studio"
		},
		{
			"id" : "4",
			"value": "C_B - Rapporto studenti regolari/docenti di ruolo e riduzione di tale rapporto"
		},
		{
			"id" : "5",
			"value": "D_A (D_C Scuole Superiori) - Proporzione di CFU conseguiti all'estero dagli studenti, ivi inclusi quelli acquisiti durante periodi di “mobilità virtuale”"
		},
		{
			"id" : "6",
			"value": "D_B - Proporzione di Dottori di ricerca che hanno trascorso almeno 3 mesi all'estero"
		},
		{
			"id" : "7",
			"value": "E_A - Proporzione dei Professori di I e II fascia assunti dall'esterno nel triennio precedente, sul totale dei professori reclutati"
		},
		{
			"id" : "8",
			"value": "E_B - Proporzione di ricercatori di cui all'art. 24, c. 3, lett. a) e lett. b) sul totale dei docenti di ruolo"
		}
	]
	`;
}

function getSorgenteDati() {
	return `
	[
		{
			"id" : "0",
			"value": "Campus Bio-Medico",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.735",
					"valore-2022": "0.511"
				},
				{
					"id": "1",
					"valore-iniziale": "0.894",
					"valore-2022": "0.889"
				},
				{
					"id": "2",
					"valore-iniziale": "0.255",
					"valore-2022": "0.469"
				},
				{
					"id": "3",
					"valore-iniziale": "0.947",
					"valore-2022": "0.924"
				},
				{
					"id": "4",
					"valore-iniziale": "14.085",
					"valore-2022": "13.819"
				},
				{
					"id": "5",
					"valore-iniziale": "0.003",
					"valore-2022": "0.001"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "0.04"
				},
				{
					"id": "7",
					"valore-iniziale": "0.18",
					"valore-2022": "0.174"
				},
				{
					"id": "8",
					"valore-iniziale": "0.261",
					"valore-2022": "0.275"
				}
			]
		},
		{
			"id" : "1",
			"value": "HUMANITAS University",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.741",
					"valore-2022": "0.624"
				},
				{
					"id": "1",
					"valore-iniziale": "0.977",
					"valore-2022": "0.977"
				},
				{
					"id": "2",
					"valore-iniziale": "0.239",
					"valore-2022": "0.173"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "16.148",
					"valore-2022": "13.009"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "7",
					"valore-iniziale": "0.567",
					"valore-2022": "0.424"
				},
				{
					"id": "8",
					"valore-iniziale": "0.375",
					"valore-2022": "0.436"
				}
			]
		},
		{
			"id" : "2",
			"value": "IULM - MILANO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.705",
					"valore-2022": "0.647"
				},
				{
					"id": "1",
					"valore-iniziale": "0.859",
					"valore-2022": "0.831"
				},
				{
					"id": "2",
					"valore-iniziale": "0.135",
					"valore-2022": "0.17"
				},
				{
					"id": "3",
					"valore-iniziale": "0.94",
					"valore-2022": "0.911"
				},
				{
					"id": "4",
					"valore-iniziale": "73.685",
					"valore-2022": "73"
				},
				{
					"id": "5",
					"valore-iniziale": "0.016",
					"valore-2022": "0.007"
				},
				{
					"id": "6",
					"valore-iniziale": "0.143",
					"valore-2022": "0.125"
				},
				{
					"id": "7",
					"valore-iniziale": "0.222",
					"valore-2022": "0.357"
				},
				{
					"id": "8",
					"valore-iniziale": "0.112",
					"valore-2022": "0.149"
				}
			]
		},
		{
			"id" : "3",
			"value": "LINK CAMPUS",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.481",
					"valore-2022": "0.539"
				},
				{
					"id": "1",
					"valore-iniziale": "1",
					"valore-2022": "0.875"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2022": "0.125"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "22.25",
					"valore-2022": "9"
				},
				{
					"id": "5",
					"valore-iniziale": "0.002",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.2",
					"valore-2022": "0.667"
				},
				{
					"id": "8",
					"valore-iniziale": "0.167",
					"valore-2022": "0.042"
				}
			]
		},
		{
			"id" : "4",
			"value": "LIUC",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.656",
					"valore-2022": "0.645"
				},
				{
					"id": "1",
					"valore-iniziale": "0.889",
					"valore-2022": "0.894"
				},
				{
					"id": "2",
					"valore-iniziale": "0.128",
					"valore-2022": "0.204"
				},
				{
					"id": "3",
					"valore-iniziale": "0.97",
					"valore-2022": "0.954"
				},
				{
					"id": "4",
					"valore-iniziale": "54.851",
					"valore-2022": "52.429"
				},
				{
					"id": "5",
					"valore-iniziale": "0.079",
					"valore-2022": "0.037"
				},
				{
					"id": "6",
					"valore-iniziale": "0",
					"valore-2022": "0.667"
				},
				{
					"id": "7",
					"valore-iniziale": "0.571",
					"valore-2022": "0.3"
				},
				{
					"id": "8",
					"valore-iniziale": "0.213",
					"valore-2022": "0.204"
				}
			]
		},
		{
			"id" : "5",
			"value": "Luiss Guido Carli",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.867",
					"valore-2022": "0.792"
				},
				{
					"id": "1",
					"valore-iniziale": "0.944",
					"valore-2022": "0.917"
				},
				{
					"id": "2",
					"valore-iniziale": "0.286",
					"valore-2022": "0.267"
				},
				{
					"id": "3",
					"valore-iniziale": "0.949",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "81.411",
					"valore-2022": "81.612"
				},
				{
					"id": "5",
					"valore-iniziale": "0.046",
					"valore-2022": "0.038"
				},
				{
					"id": "6",
					"valore-iniziale": "0.571",
					"valore-2022": "0.143"
				},
				{
					"id": "7",
					"valore-iniziale": "0.571",
					"valore-2022": "0.514"
				},
				{
					"id": "8",
					"valore-iniziale": "0.161",
					"valore-2022": "0.121"
				}
			]
		},
		{
			"id" : "6",
			"value": "LUM 'G Degennaro'",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.431",
					"valore-2022": "0.495"
				},
				{
					"id": "1",
					"valore-iniziale": "0.972",
					"valore-2022": "0.958"
				},
				{
					"id": "2",
					"valore-iniziale": "0.262",
					"valore-2022": "0.218"
				},
				{
					"id": "3",
					"valore-iniziale": "0.972",
					"valore-2022": "0.954"
				},
				{
					"id": "4",
					"valore-iniziale": "30.738",
					"valore-2022": "24.436"
				},
				{
					"id": "5",
					"valore-iniziale": "0.02",
					"valore-2022": "0.017"
				},
				{
					"id": "6",
					"valore-iniziale": "0",
					"valore-2022": "1"
				},
				{
					"id": "7",
					"valore-iniziale": "0.167",
					"valore-2022": "0.522"
				},
				{
					"id": "8",
					"valore-iniziale": "0.214",
					"valore-2022": "0.236"
				}
			]
		},
		{
			"id" : "7",
			"value": "LUMSA - ROMA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.702",
					"valore-2022": "0.69"
				},
				{
					"id": "1",
					"valore-iniziale": "0.895",
					"valore-2022": "0.941"
				},
				{
					"id": "2",
					"valore-iniziale": "0.293",
					"valore-2022": "0.284"
				},
				{
					"id": "3",
					"valore-iniziale": "0.968",
					"valore-2022": "0.959"
				},
				{
					"id": "4",
					"valore-iniziale": "56.222",
					"valore-2022": "67.51"
				},
				{
					"id": "5",
					"valore-iniziale": "0.012",
					"valore-2022": "0.005"
				},
				{
					"id": "6",
					"valore-iniziale": "0.375",
					"valore-2022": "0.364"
				},
				{
					"id": "7",
					"valore-iniziale": "0.379",
					"valore-2022": "0.324"
				},
				{
					"id": "8",
					"valore-iniziale": "0.061",
					"valore-2022": "0.039"
				}
			]
		},
		{
			"id" : "8",
			"value": "S Raffaele - MI",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.882",
					"valore-2022": "0.787"
				},
				{
					"id": "1",
					"valore-iniziale": "0.944",
					"valore-2022": "0.953"
				},
				{
					"id": "2",
					"valore-iniziale": "0.233",
					"valore-2022": "0.21"
				},
				{
					"id": "3",
					"valore-iniziale": "0.949",
					"valore-2022": "0.942"
				},
				{
					"id": "4",
					"valore-iniziale": "18.006",
					"valore-2022": "19.095"
				},
				{
					"id": "5",
					"valore-iniziale": "0.013",
					"valore-2022": "0.009"
				},
				{
					"id": "6",
					"valore-iniziale": "0.136",
					"valore-2022": "0.184"
				},
				{
					"id": "7",
					"valore-iniziale": "0.581",
					"valore-2022": "0.585"
				},
				{
					"id": "8",
					"valore-iniziale": "0.233",
					"valore-2022": "0.24"
				}
			]
		},
		{
			"id" : "9",
			"value": "San Raffaele Roma",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.353",
					"valore-2022": "0.381"
				},
				{
					"id": "1",
					"valore-iniziale": "0.875",
					"valore-2022": "0.873"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "0.933",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "139.449",
					"valore-2022": "116.446"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.6",
					"valore-2022": "0.56"
				},
				{
					"id": "8",
					"valore-iniziale": "0.408",
					"valore-2022": "0.375"
				}
			]
		},
		{
			"id" : "10",
			"value": "SC GASTRONOMICHE",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.671",
					"valore-2022": "0.455"
				},
				{
					"id": "1",
					"valore-iniziale": "1",
					"valore-2022": "1"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "0.929",
					"valore-2022": "0.878"
				},
				{
					"id": "4",
					"valore-iniziale": "22.471",
					"valore-2022": "20.176"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "8",
					"valore-iniziale": "0.294",
					"valore-2022": "0.235"
				}
			]
		},
		{
			"id" : "11",
			"value": "Suor Orsola - NAPOLI",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.707",
					"valore-2022": "0.69"
				},
				{
					"id": "1",
					"valore-iniziale": "0.871",
					"valore-2022": "0.753"
				},
				{
					"id": "2",
					"valore-iniziale": "0.076",
					"valore-2022": "0.119"
				},
				{
					"id": "3",
					"valore-iniziale": "0.972",
					"valore-2022": "0.964"
				},
				{
					"id": "4",
					"valore-iniziale": "77.457",
					"valore-2022": "89.405"
				},
				{
					"id": "5",
					"valore-iniziale": "0.006",
					"valore-2022": "0.002"
				},
				{
					"id": "6",
					"valore-iniziale": "0.2",
					"valore-2022": "0.182"
				},
				{
					"id": "7",
					"valore-iniziale": "0.074",
					"valore-2022": "0.033"
				},
				{
					"id": "8",
					"valore-iniziale": "0.12",
					"valore-2022": "0.06"
				}
			]
		},
		{
			"id" : "12",
			"value": "Telemat GFORTUNATO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.543",
					"valore-2022": "0.4"
				},
				{
					"id": "1",
					"valore-iniziale": "0.969",
					"valore-2022": "0.885"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "0.972",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "62.042",
					"valore-2022": "60"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.833",
					"valore-2022": "0.727"
				},
				{
					"id": "8",
					"valore-iniziale": "0.083",
					"valore-2022": "0"
				}
			]
		},
		{
			"id" : "13",
			"value": "Telematica GMarconi",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.401",
					"valore-2022": "0.343"
				},
				{
					"id": "1",
					"valore-iniziale": "0.908",
					"valore-2022": "0.885"
				},
				{
					"id": "2",
					"valore-iniziale": "0.143",
					"valore-2022": "0.138"
				},
				{
					"id": "3",
					"valore-iniziale": "0.974",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "77.549",
					"valore-2022": "114.615"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.118",
					"valore-2022": "0.125"
				},
				{
					"id": "8",
					"valore-iniziale": "0.341",
					"valore-2022": "0.108"
				}
			]
		},
		{
			"id" : "14",
			"value": "Telematica IUL",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.341",
					"valore-2022": "0.421"
				},
				{
					"id": "1",
					"valore-iniziale": "0.625",
					"valore-2022": "1"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "ND",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "309.5",
					"valore-2022": "311"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "8",
					"valore-iniziale": "0.5",
					"valore-2022": "0.5"
				}
			]
		},
		{
			"id" : "15",
			"value": "Telematica UNITELMA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.083",
					"valore-2022": "0.058"
				},
				{
					"id": "1",
					"valore-iniziale": "0.941",
					"valore-2022": "0.971"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "0.979",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "56.111",
					"valore-2022": "41.529"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0.001"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "8",
					"valore-iniziale": "0.389",
					"valore-2022": "0.324"
				}
			]
		},
		{
			"id" : "16",
			"value": "Telematica 'E-CAMPUS' ",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.346",
					"valore-2022": "0.289"
				},
				{
					"id": "1",
					"valore-iniziale": "0.959",
					"valore-2022": "0.959"
				},
				{
					"id": "2",
					"valore-iniziale": "0.118",
					"valore-2022": "0.167"
				},
				{
					"id": "3",
					"valore-iniziale": "0.954",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "357.487",
					"valore-2022": "376.583"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.419",
					"valore-2022": "0.359"
				},
				{
					"id": "8",
					"valore-iniziale": "0.132",
					"valore-2022": "0.097"
				}
			]
		},
		{
			"id" : "17",
			"value": "UKE - Kore ENNA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.542",
					"valore-2022": "0.499"
				},
				{
					"id": "1",
					"valore-iniziale": "0.932",
					"valore-2022": "0.947"
				},
				{
					"id": "2",
					"valore-iniziale": "0.18",
					"valore-2022": "0.209"
				},
				{
					"id": "3",
					"valore-iniziale": "0.982",
					"valore-2022": "0.955"
				},
				{
					"id": "4",
					"valore-iniziale": "29.241",
					"valore-2022": "28.03"
				},
				{
					"id": "5",
					"valore-iniziale": "0.003",
					"valore-2022": "0.001"
				},
				{
					"id": "6",
					"valore-iniziale": "0.391",
					"valore-2022": "0.381"
				},
				{
					"id": "7",
					"valore-iniziale": "0.1",
					"valore-2022": "0.161"
				},
				{
					"id": "8",
					"valore-iniziale": "0.158",
					"valore-2022": "0.149"
				}
			]
		},
		{
			"id" : "18",
			"value": "UNICUSANO - Roma",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0",
					"valore-2022": "0.003"
				},
				{
					"id": "1",
					"valore-iniziale": "0.907",
					"valore-2022": "0.859"
				},
				{
					"id": "2",
					"valore-iniziale": "0.069",
					"valore-2022": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "0.978",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "52.713",
					"valore-2022": "110.778"
				},
				{
					"id": "5",
					"valore-iniziale": "NR",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "0",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.4",
					"valore-2022": "0.281"
				},
				{
					"id": "8",
					"valore-iniziale": "0.379",
					"valore-2022": "0.333"
				}
			]
		},
		{
			"id" : "19",
			"value": "UNINETTUNO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.157",
					"valore-2022": "0.056"
				},
				{
					"id": "1",
					"valore-iniziale": "0.893",
					"valore-2022": "0.857"
				},
				{
					"id": "2",
					"valore-iniziale": "0.167",
					"valore-2022": "0.167"
				},
				{
					"id": "3",
					"valore-iniziale": "0.969",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "235.867",
					"valore-2022": "103.533"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.364",
					"valore-2022": "0.462"
				},
				{
					"id": "8",
					"valore-iniziale": "0.1",
					"valore-2022": "0.1"
				}
			]
		},
		{
			"id" : "20",
			"value": "UNINT - ROMA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.562",
					"valore-2022": "0.573"
				},
				{
					"id": "1",
					"valore-iniziale": "0.871",
					"valore-2022": "0.833"
				},
				{
					"id": "2",
					"valore-iniziale": "0.097",
					"valore-2022": "0.194"
				},
				{
					"id": "3",
					"valore-iniziale": "0.892",
					"valore-2022": "0.886"
				},
				{
					"id": "4",
					"valore-iniziale": "57.258",
					"valore-2022": "44.056"
				},
				{
					"id": "5",
					"valore-iniziale": "0.05",
					"valore-2022": "0.011"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.182",
					"valore-2022": "0.222"
				},
				{
					"id": "8",
					"valore-iniziale": "0.065",
					"valore-2022": "0.194"
				}
			]
		},
		{
			"id" : "21",
			"value": "Univ Bocconi MILANO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.746",
					"valore-2022": "0.779"
				},
				{
					"id": "1",
					"valore-iniziale": "0.965",
					"valore-2022": "0.955"
				},
				{
					"id": "2",
					"valore-iniziale": "0.145",
					"valore-2022": "0.137"
				},
				{
					"id": "3",
					"valore-iniziale": "0.916",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "40.716",
					"valore-2022": "39.707"
				},
				{
					"id": "5",
					"valore-iniziale": "0.1",
					"valore-2022": "0.033"
				},
				{
					"id": "6",
					"valore-iniziale": "0.455",
					"valore-2022": "0.37"
				},
				{
					"id": "7",
					"valore-iniziale": "0.333",
					"valore-2022": "0.212"
				},
				{
					"id": "8",
					"valore-iniziale": "0.246",
					"valore-2022": "0.284"
				}
			]
		},
		{
			"id" : "22",
			"value": "Univ BOLZANO",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.76",
					"valore-2022": "0.723"
				},
				{
					"id": "1",
					"valore-iniziale": "0.92",
					"valore-2022": "0.929"
				},
				{
					"id": "2",
					"valore-iniziale": "0.186",
					"valore-2022": "0.282"
				},
				{
					"id": "3",
					"valore-iniziale": "0.887",
					"valore-2022": "0.863"
				},
				{
					"id": "4",
					"valore-iniziale": "11.427",
					"valore-2022": "11.404"
				},
				{
					"id": "5",
					"valore-iniziale": "0.039",
					"valore-2022": "0.02"
				},
				{
					"id": "6",
					"valore-iniziale": "0.579",
					"valore-2022": "0.449"
				},
				{
					"id": "7",
					"valore-iniziale": "0.434",
					"valore-2022": "0.328"
				},
				{
					"id": "8",
					"valore-iniziale": "0.473",
					"valore-2022": "0.45"
				}
			]
		},
		{
			"id" : "23",
			"value": "Univ Catt SCuore",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.664",
					"valore-2022": "0.65"
				},
				{
					"id": "1",
					"valore-iniziale": "0.94",
					"valore-2022": "0.934"
				},
				{
					"id": "2",
					"valore-iniziale": "0.114",
					"valore-2022": "0.161"
				},
				{
					"id": "3",
					"valore-iniziale": "0.894",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "29.303",
					"valore-2022": "29.361"
				},
				{
					"id": "5",
					"valore-iniziale": "0.012",
					"valore-2022": "0.005"
				},
				{
					"id": "6",
					"valore-iniziale": "0.191",
					"valore-2022": "0.162"
				},
				{
					"id": "7",
					"valore-iniziale": "0.129",
					"valore-2022": "0.109"
				},
				{
					"id": "8",
					"valore-iniziale": "0.181",
					"valore-2022": "0.207"
				}
			]
		},
		{
			"id" : "24",
			"value": "Univ EUROPEA - ROMA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.672",
					"valore-2022": "0.643"
				},
				{
					"id": "1",
					"valore-iniziale": "0.84",
					"valore-2022": "0.865"
				},
				{
					"id": "2",
					"valore-iniziale": "0.102",
					"valore-2022": "0.113"
				},
				{
					"id": "3",
					"valore-iniziale": "0.949",
					"valore-2022": "0.962"
				},
				{
					"id": "4",
					"valore-iniziale": "32.469",
					"valore-2022": "35.962"
				},
				{
					"id": "5",
					"valore-iniziale": "0.011",
					"valore-2022": "0.006"
				},
				{
					"id": "6",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "7",
					"valore-iniziale": "0.077",
					"valore-2022": "0.067"
				},
				{
					"id": "8",
					"valore-iniziale": "0.163",
					"valore-2022": "0.151"
				}
			]
		},
		{
			"id" : "25",
			"value": "UnivStranREGGIO C",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.31",
					"valore-2022": "0.533"
				},
				{
					"id": "1",
					"valore-iniziale": "0.8",
					"valore-2022": "0.737"
				},
				{
					"id": "2",
					"valore-iniziale": "0.25",
					"valore-2022": "0.111"
				},
				{
					"id": "3",
					"valore-iniziale": "0.956",
					"valore-2022": "ND"
				},
				{
					"id": "4",
					"valore-iniziale": "20",
					"valore-2022": "17.167"
				},
				{
					"id": "5",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "0.8"
				},
				{
					"id": "7",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "8",
					"valore-iniziale": "0.4",
					"valore-2022": "0.389"
				}
			]
		},
		{
			"id" : "26",
			"value": "VALLE D'AOSTA",
			"indicatori": [
				{
					"id": "0",
					"valore-iniziale": "0.573",
					"valore-2022": "0.653"
				},
				{
					"id": "1",
					"valore-iniziale": "0.955",
					"valore-2022": "0.905"
				},
				{
					"id": "2",
					"valore-iniziale": "0",
					"valore-2022": "0"
				},
				{
					"id": "3",
					"valore-iniziale": "0.967",
					"valore-2022": "0.95"
				},
				{
					"id": "4",
					"valore-iniziale": "17.776",
					"valore-2022": "16.917"
				},
				{
					"id": "5",
					"valore-iniziale": "0.114",
					"valore-2022": "0.103"
				},
				{
					"id": "6",
					"valore-iniziale": "NR",
					"valore-2022": "NR"
				},
				{
					"id": "7",
					"valore-iniziale": "0.333",
					"valore-2022": "0.308"
				},
				{
					"id": "8",
					"valore-iniziale": "0.041",
					"valore-2022": "0.042"
				}
			]
		}		
	]
`;
}