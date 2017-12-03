'use strict'

import Store from  './store.js'


var radianos = (new Array(101)).fill(1).map((ignore, index) => Math.PI * 2 / 100 * index),
    noventaGraus = Math.PI / 2,
    doisPI = Math.PI * 2,
    leafletMap,
    chartCanvas,
    plottingData = [],
    plottingColors = [],
    posicoesCharts = []

export default {
        
    get posicoesCharts () {
        return posicoesCharts
    },

    get plottingData () {
        return plottingData
    },

    calcPlottingData () {
        var candidatos = Store.candidatos,
            coordenadas = Store.coordenadas;

        if (!coordenadas) {
            console.error('array coordenadas não contém nenhum dado')
            return    
        }

        plottingColors = candidatos.filter((candidato) => !candidato.disabled)
                    .map(({ color }) => `rgba(${color},0.75)` )        

        plottingData = Object.entries(coordenadas).map(([id, {lat, long}]) => {
            // A base de dados só contém os locais onde o candidato obteve pelo menos um voto,
            // por isso precisamos primeiro checar se o local existe no object candidato.votos 

            var votos = candidatos.filter((candidato) => !candidato.disabled)
                    .map((candidato) => candidato.votos[id] ? candidato.votos[id].numero : 0),
                totalVotos = votos.reduce((total, numero) => total + numero, 0),
                proporcoes = votos.map((numero) => numero / totalVotos),
                porcentagens = proporcoes.map((proporcao) => Math.round(proporcao * 100)),
                ranking = proporcoes.map((porcentagem, index) => ({porcentagem, index}))   // the parenthesis around the returning object are necessary!
                    .sort((a, b) => b.porcentagem - a.porcentagem)
                    .map((obj) => obj.index),  
                maisVotado = votos.reduce((maisVotado, numero, indice, votos) => maisVotado < 0 ? indice : votos[maisVotado] > numero ? maisVotado : indice, -1),
                acumulado = 0,
                porcentagensAcumuladas = [0, ...porcentagens.map((porcentagem) => {
                    acumulado += porcentagem
                    return acumulado 
                }) ],
                angulosIniciais = [...porcentagensAcumuladas.slice(0, porcentagensAcumuladas.length -1).map((porcentagem) => radianos[porcentagem]), Math.PI * 2]

            //var indices = candidatos.filter((candidato) => !candidato.disabled).map((candidato) => candidato.indices[id]) 
            var indices = candidatos.map((candidato) => candidato.indices[id]) 

                //angulosFinais = porcentagensAcumuladas.slice(1, porcentagensAcumuladas.length).map((porcentagem) => radianos[porcentagem]) 

//                console.log('just checking')
//                console.log(id)
                //console.log(candidatos[0])
//                console.log(candidatos[0].votos[id])
//                console.log(candidatos)
//                console.log(votos)
                //console.log(proporcoes)
//                console.log(porcentagens)
//                console.log(ranking)
/*                console.log(porcentagensAcumuladas)
                console.log(angulosIniciais)
                console.log(angulosFinais)
*/
            return {
                id,
                lat,
                long,
                votos,
                totalVotos,
                proporcoes,
                porcentagens,
                ranking,
                maisVotado,
                porcentagensAcumuladas,
                angulosIniciais,
                indices,
                colors: plottingColors
            }
        })
        return plottingData
    },


    drawChartFactory (chartType, candidato, indice) {
        var //colorSequence = plottingData.colors || [],
        //["229,57,53", "30,136,229", "251,140,0", "94,53,177", "3,155,229", "0,172,193", "255,179,0", "142,36,170", "57,73,171", "216,27,96", "192,202,51", "0,137,123", "253,216,53"],
            candidatoSelecionado = null,
            indexCandidatoSelecionado = null,
            colors,
            radius,  
            lineWidth,
            drawFunction = null;

        var noChart = function () {}    

        var drawPieChart = function (ctx, dot, d, index) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);       
            ctx.arc(dot.x, dot.y, radius, d.angulosIniciais[index] - noventaGraus, d.angulosIniciais[index+1] - noventaGraus);
            ctx.fillStyle = colors[index];
            ctx.fill();
            ctx.closePath();
        }

        var drawDonutChart = function (ctx, dot, d, index) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, radius * 3/ 4, d.stops[index], d.stops[index+1]);         
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = radius / 2
            ctx.stroke();
            ctx.closePath();
        }
        
        var drawCircleChart = function (ctx, dot, d, index) {
            var thisRadius = radius + index * lineWidth,
                angle = d.anglesForCircleChart[index]       
            ctx.beginPath()
            ctx.moveTo(dot.x + thisRadius, dot.y)
            ctx.arc(dot.x, dot.y, thisRadius, 0, angle)
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = lineWidth
            ctx.stroke()    
            ctx.closePath()
        }

        var drawWinnerChart = function (ctx, dot, d, index) {
            console.log('entrou em drawWinnerChart')
            if (index == d.maisVotado) {
                ctx.beginPath()
                ctx.moveTo(dot.x, dot.y)
                ctx.arc(dot.x, dot.y, radius, 0, doisPI)
                ctx.fillStyle = colors[index]
                ctx.fill()
                ctx.closePath()
            }
        }

        var drawBarChart = function (ctx, dot, d, index) {
            let proporcao = d.proporcoes[index] / d.proporcoes[d.maisVotado],
                numBarras = Math.max(d.proporcoes.length, 2),
                barWidth = radius * 2 / numBarras

            ctx.beginPath()
            ctx.moveTo(dot.x - radius + index*barWidth, dot.y + radius)
            ctx.lineTo(dot.x - radius + index*barWidth, dot.y + radius - radius * 2 * proporcao)
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = barWidth
            ctx.stroke()
            ctx.closePath()   
        }

        var drawHorizontalBarChart = function (ctx, dot, d, index) {
            let porcentagem = d.porcentagens[index],
                porcentagemMaisVotado = d.porcentagens[d.maisVotado],
                barHeight = Math.min(radius * 2 / d.porcentagens.length, radius / 2),
                posicaoRanking = d.ranking.indexOf(index),
                posicaoY = -radius + posicaoRanking * barHeight
                
            ctx.beginPath()
            ctx.moveTo(dot.x - radius, dot.y + posicaoY)
            ctx.lineTo(dot.x - radius + radius * 2 * (porcentagem / porcentagemMaisVotado), dot.y + posicaoY)
            ctx.strokeStyle = colors[index]
            ctx.lineWidth = barHeight
            ctx.stroke()
            ctx.closePath()
        }

        var drawPillChart = function (ctx, dot, d, index) {
            var posicaoNoRanking = d.ranking.indexOf(index)
            if (posicaoNoRanking >= 2)
                return    // Pill Chart only displays data for the winner candidate and the runner-up

            var left, 
                width,
                numCandidatos = d.proporcoes.length,
                total = numCandidatos > 1 ? d.proporcoes[d.ranking[0]] + d.proporcoes[d.ranking[1]] : 1.0,
                porcentagem = d.proporcoes[index] / total

            if (posicaoNoRanking) 
                // Candidate is the 2nd place; their bar will be displayed at the right
                left = -radius + (1-porcentagem) * radius * 2
            else 
                // Candidate is the winner. their bar will be displayed on the left
                left = -radius
            width = porcentagem * radius * 2

            if (porcentagem > 1) {
                // This should never occur, so we do display an error before correcting the problem
                console.error('percentage > 1')
                console.log(`posicaoNoRanking = ${posicaoNoRanking}` + 
                    `d.porcentagens[d.ranking[0]] = ${d.porcentagens[d.ranking[0]]}` + 
                    `d.porcentagens[d.ranking[1]] = ${d.porcentagens[d.ranking[1]]}` +
                    `total = ${total}`)
                    console.log(d.ranking)
                    console.log(d.proporcoes)

                porcentagem = 1    
            }      

            ctx.beginPath()
            ctx.fillStyle = colors[index]   
            ctx.fillRect(dot.x + left, dot.y - radius * (3/8), width, radius * (6/8))
            ctx.closePath()                          
        }

        var drawIndexChart = function (ctx, dot, d, index) {
            if (index != indexCandidatoSelecionado)
                return

            var steps = [], 
                color = 0,
                valorIndice = d.indices[index] ? (d.indices[index][indice] || 0) : 0  // indice may be 'indiceLQ' or 'indiceG'

            if (indice == 'indiceG')
                steps = [-0.8, -0.5 - 0.25, -0.1, 0, 0.1, 0.25, 0.5, 0.8]
            else
                steps = [0.1, 0.25, 0.5, 0.75, 1.0, 2.0, 4.0, 8.0, 10.0, 20.0],
            console.log(`valorIndice = ${valorIndice}`)    
            for (var i=0; i<steps.length; i++)    
                if (valorIndice < steps[i])
                    break
            color = i / 10   

            ctx.beginPath()
            ctx.moveTo(dot.x, dot.y)
            ctx.arc(dot.x, dot.y, radius, 0, doisPI)
            ctx.fillStyle = `rgba(255,64,64,${color})`
            ctx.fill()
            ctx.closePath()
        }



        const functionsByChartType = {
            'bar'   : drawBarChart,
            'circle': drawCircleChart,
            'donut' : drawDonutChart,
            'pie'   : drawPieChart,
            'winner': drawWinnerChart,
            'pill'  : drawPillChart,
            'hbar'  : drawHorizontalBarChart,
            'index' : drawIndexChart,
        }       

        function drawChart (params) {
            var ctx = params.canvas.getContext('2d')

            radius = Math.pow(2, Math.min(params.zoom, 12) / 2.25)
            lineWidth = radius / 4
     
            ctx.clearRect(0, 0, params.canvas.width, params.canvas.height);
            posicoesCharts = []
            console.log(`plottingData.length = ${plottingData.length}`)
            if (candidatoSelecionado) {
                indexCandidatoSelecionado = Store.candidatos.indexOf(candidatoSelecionado)
                console.log(`index do candidato selecionado: ${indexCandidatoSelecionado}`)
            }
            else
                indexCandidatoSelecionado = null
            for (var i = 0; i < plottingData.length; i++) {
                var d = plottingData[i],
                    numCandidatos = (drawFunction == drawIndexChart) ? d.indices.length : d.votos.length;

                if (params.bounds.contains([d.lat, d.long]) && d.totalVotos) {    
                    let dot = params.layer._map.latLngToContainerPoint([d.lat, d.long]); 

                    for (var j = 0; j < numCandidatos; j++) {
                        colors = d.colors
                        drawFunction(ctx, dot, d, j)
                    }

                    posicoesCharts.push({ 
                        id: d.id,
                        bounds: [
                          [dot.x - radius, dot.y - radius],
                          [dot.x + radius, dot.y + radius]
                        ]
                    })                      
                }
                else {
                    //console.log('não plotou coords ' + d.lat + ', ' + d.long)
                }
            } 
        }   

        console.error('entrou em setChartType, chartType = ' + chartType)
        if (candidato) {
            candidatoSelecionado = Store.obterCandidato(candidato)
            indice = indice || 'indiceLQ'
        }
        else
            candidatoSelecionado = null

        drawFunction = functionsByChartType[chartType]
        if (drawFunction) {
            return drawChart
        } 
        return noChart
    },


    setChartType: function (chartType, candidato, indice) {
        this.onDrawLayer = this.drawChartFactory(chartType, candidato, indice)
    },


    setUpCanvasLayer (map) {
        leafletMap = map
        this.setChartType('winner')
        chartCanvas = L.canvasLayer()
            .delegate(this) 
            .addTo(leafletMap);
    },

    redrawCharts () {
        chartCanvas.needRedraw()
    },

    removeCharts () {
        plottingData = []
        chartCanvas.needRedraw()
    }

}