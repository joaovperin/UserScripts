// ==UserScript==
// @name                Calcula Ponto Restante
// @version             1.0.0
// @description         Calcula quanto tempo falta pra poder parar de trabalhar
// @author              joaovperin
// @match               https://ponto.cwi.com.br/Lite/Home.aspx
// @icon                https://www.google.com/s2/favicons?sz=64&domain=cwi.com.br
// @downloadURL         https://raw.githubusercontent.com/joaovperin/UserScripts/main/calculaPonto.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/UserScripts/main/calculaPonto.js
// ==/UserScript==

(function () {
    'use strict';

    const targetTime = 8 * 60 + 30; // 8 hours and 30 minutes

    const minutesArray = [];
    let idx = 0;
    while (true) {
        const block = document.querySelector(`#ctl00_cphPrincipal_lblDailyTimeclock${idx}`);
        if (!block) {
            break;
        }
        const blockText = block.innerText;
        if (!blockText) {
            break;
        }

        const [hour, minute] = blockText.split(':');
        const hourNumber = Number(hour);
        const minuteNumber = Number(minute);
        const totalMinutes = hourNumber * 60 + minuteNumber;
        minutesArray.push(totalMinutes);
        idx++;
    }


    let message = '...';
    if (minutesArray.length > 0 && minutesArray.length % 2 != 0) {
        const now = new Date();
        minutesArray.push(now.getHours() * 60 + now.getMinutes());
    }

    let workedMinutes = 0;
    for (let i = 0; i < minutesArray.length - 1; i += 2) {
        workedMinutes += minutesArray[i + 1] - minutesArray[i];
    }

    const remaminingTime = targetTime - workedMinutes;
    if (remaminingTime < 0) {
        message = `Excedido em ${getTimeDescription(remaminingTime)} minutos`;
    }
    if (remaminingTime > 0) {
        message = `Faltam ${getTimeDescription(remaminingTime)} minutos pra você poder parar de trabalhar`;
    }

    let myDiv = document.querySelector('div#myDiv');
    if (!myDiv) {
        myDiv = document.createElement('div');
        myDiv.id = 'myDiv';
        document.body.appendChild(myDiv);
    }
    myDiv.innerText = `Status: ${message}`;

    const container = document.querySelector('div#main') || document.body;
    container.appendChild(myDiv);

    function getTimeDescription(timeInMinutes) {
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${hours} horas e ${minutes} minutos`;
    }

})();
