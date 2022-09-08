// ==UserScript==
// @name                Calcula Ponto Restante
// @version     	    1.0.0
// @description         Calcula quanto tempo falta pra poder parar de trabalhar
// @author              joaovperin
// @icon                https://www.google.com/s2/favicons?sz=64&domain=cwi.com.br
// @match               https://ponto.cwi.com.br/Lite/Home.aspx
// @downloadURL         https://raw.githubusercontent.com/joaovperin/UserScripts/main/calculaPonto.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/UserScripts/main/calculaPonto.js
// ==/UserScript==

(function (targetTime) {
    'use strict';

    const pointmentsList = [];
    for (let idx = 0; ; idx++) {
        const block = document.querySelector(`#ctl00_cphPrincipal_lblDailyTimeclock${idx}`);
        if (!block?.innerText) {
            break;
        }

        const [hour, minute] = block.innerText.trim().split(':');
        const hourNumber = Number(hour);
        const minuteNumber = Number(minute);
        const totalMinutes = hourNumber * 60 + minuteNumber;
        pointmentsList.push(totalMinutes);
    }


    if (pointmentsList.length > 0 && pointmentsList.length % 2 != 0) {
        const now = new Date();
        pointmentsList.push(now.getHours() * 60 + now.getMinutes());
    }

    let workedMinutes = 0;
    for (let i = 0; i < pointmentsList.length - 1; i += 2) {
        workedMinutes += pointmentsList[i + 1] - pointmentsList[i];
    }

    const remaminingTime = targetTime - workedMinutes;

    let message = '...';
    if (remaminingTime < 0) {
        message = `Excedido em ${getTimeDescription(remaminingTime)} minutos`;
    }
    if (remaminingTime > 0) {
        message = `Faltam ${getTimeDescription(remaminingTime)} minutos pra você poder parar de trabalhar`;
    }

    renderMessage(`Status: ${message}`);

    function renderMessage(message) {
        let divElement = document.querySelector('div#p-status');
        if (!divElement) {
            divElement = document.createElement('div');
            divElement.id = 'p-status';
            document.body.appendChild(divElement);
        }
        divElement.innerText = message;

        (document.querySelector('div#main') || document.body)
            .appendChild(divElement);
    }

    function getTimeDescription(timeInMinutes) {
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${hours} horas e ${minutes} minutos`;
    }

})(
    8.5 * 60, /* 8 hours and 30 minutes */
);