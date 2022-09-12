// ==UserScript==
// @name                Calcula Ponto Restante
// @version     	    1.0.1
// @description         Calcula quanto tempo falta pra poder parar de trabalhar
// @author              joaovperin
// @icon                https://www.google.com/s2/favicons?sz=64&domain=cwi.com.br
// @include             https://ponto.cwi.com.br/Lite/Home.aspx
// @downloadURL         https://raw.githubusercontent.com/joaovperin/UserScripts/main/calculaPonto.js
// @updateURL           https://raw.githubusercontent.com/joaovperin/UserScripts/main/calculaPonto.js
// ==/UserScript==

((targetTime, updateIntervalInSeconds) => {
    'use strict';

    let lastMessage = '';

    setInterval(() => runScript(),
        updateIntervalInSeconds * 1000);
    runScript();

    function runScript() {
        const pointmentsList = scrapPointmentsList();
        const workedMinutes = getWorkedMinutes(pointmentsList);

        const newMessage = getMessage(targetTime - workedMinutes);
        if (lastMessage !== newMessage) {
            lastMessage = newMessage;
            renderMessage('Status:', newMessage);
        }
    }

    function scrapPointmentsList() {
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
        return pointmentsList;
    }

    function getWorkedMinutes(pointmentsList) {
        let workedMinutes = 0;
        for (let i = 0; i < pointmentsList.length - 1; i += 2) {
            workedMinutes += pointmentsList[i + 1] - pointmentsList[i];
        }
        return workedMinutes;
    }

    function getMessage(remaminingTime) {
        const message = {
            text: 'Você já trabalhou o suficiente hoje!',
            color: 'blue',
        };

        if (remaminingTime < 0) {
            message.text = 'Você já pode parar de trabalhar! Saldo: ' + formatMinutes(remaminingTime);
            message.color = 'green';
        }
        if (remaminingTime > 0) {
            message.text = `Faltam ${formatMinutes(remaminingTime)} minutos pra você poder parar de trabalhar`;
            message.color = 'red';
        }

        return message;
    }

    function renderMessage(preffix, message) {
        let divElement = document.querySelector('div#p-status');
        if (!divElement) {
            divElement = document.createElement('div');
            divElement.id = 'p-status';
            document.body.appendChild(divElement);
        }
        divElement.style.color = message.color;

        divElement.innerText = `${preffix} ${message.text}`.trim();
        (document.querySelector('div#main') || document.body)
            .appendChild(divElement);
    }

    function formatMinutes(timeInMinutes) {
        const absTimeInMinutes = Math.abs(timeInMinutes);
        const hours = absTimeInMinutes > 60 ? Math.floor(absTimeInMinutes / 60) : 0;
        const minutes = absTimeInMinutes % 60;
        return `${hours} horas e ${minutes} minutos`;
    }
})(
    8.5 * 60, /* targetTime = 8 hours and 30 minutes */
    1 * 60, /* updateInterval = 1 minute */
);