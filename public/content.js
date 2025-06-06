const TIME_LIMIT = 1000 * 60;

const { hostname } = new URL(window.location.href);
let interval;

function replaceContent() {
  document.head.innerHTML += `
    <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
    <style>
      @keyframes shake {
        0% { transform: translate(0, 0) rotate(0deg); }
        20% { transform: translate(-2px, 2px) rotate(-2deg); }
        40% { transform: translate(2px, -2px) rotate(2deg); }
        60% { transform: translate(-2px, 2px) rotate(-2deg); }
        80% { transform: translate(2px, -2px) rotate(2deg); }
        100% { transform: translate(0, 0) rotate(0deg); }
      }

      .shake {
        animation: shake 0.5s infinite;
      }

      .poppins {
        font-family: 'Poppins', sans-serif;
      }

      body {
        margin: 0;
        background-color: #121212; /* dark background for full page */
      }
    </style>
  `;

  document.body.innerHTML = `
    <div class="poppins" style="display: flex; align-items: center; justify-content: center; height: 100vh; flex-direction: column; text-align: center; background-color: #121212; color: white;">
      <img class="shake" src="https://images.vexels.com/media/users/3/128840/isolated/preview/c091629800ce3d91d8527d32d60bc46f-stopwatch-timer.png" alt="Ringing clock" width="150" />
      <h1 style="color: #ff4c4c; font-size: 2.5rem; margin: 20px 0 10px;">Time's up!</h1>
      <p style="font-size: 1.2rem; color: #e0e0e0;">You have exceeded your time limit<br> of <strong>60 seconds</strong> on this website.</p>
    </div>
  `;
}

function checkTimeLimit(domainTimes) {
  if (domainTimes && domainTimes[hostname] >= TIME_LIMIT) {
    replaceContent();
    clearInterval(interval);
  }
}

chrome.runtime.sendMessage({ type: 'getTimes' }, (domainTimes) => {
  checkTimeLimit(domainTimes);
  interval = setInterval(() => {
    chrome.runtime.sendMessage({ type: 'getTimes' }, (updatedDomainTimes) => {
      checkTimeLimit(updatedDomainTimes);
    });
  }, 1000);
});

