// ==UserScript==
// @name         Calcula Ponto Restante
// @version      0.1
// @description  Calcula quanto tempo falta pra poder parar de trabalhar
// @author       joaovperin
// @match        https://ponto.cwi.com.br/Lite/Home.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cwi.com.br
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

    let workedMinutes = 0;
    for (let i = 0; i < minutesArray.length - 1; i += 2) {
        workedMinutes += minutesArray[i + 1] - minutesArray[i];
    }

    const remaminingTime = targetTime - workedMinutes;
    if (remaminingTime < 0) {
        message = `Excedido em ${Math.abs(remaminingTime)} minutos`;
    }
    if (remaminingTime > 0) {
        message = `Faltam ${remaminingTime} minutos pra você poder parar de trabalhar`;
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

})();
