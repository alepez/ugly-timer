(function () {

  const pad = (a, b) => (1e15 + a + "").slice(-b)

  const now = () => new Date();

  const formatSeconds = (s) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s - (hours * 3600)) / 60);
    const seconds = s - hours * 3600 - minutes * 60;
    return pad(hours.toFixed(0), 2) + ":" + pad(minutes.toFixed(0), 2) + ":" + pad(seconds.toFixed(0), 2);
  }

  const updateState = (state, update) => Object.assign({}, state, update);

  const renderTimeEl = (state) => {
    const timeToTarget = state.playing ? (state.targetTime - now().getTime()) : state.timeDiff;
    return formatSeconds(timeToTarget / 1000);
  };

  const setup = () => {
    const timeEl = document.getElementById('timer');
    const playEl = document.getElementById('play');
    const pauseEl = document.getElementById('pause');

    const incrButtons = [...document.getElementsByClassName('incr-button')];

    const defaultTimeDiff = 60 * 90 * 1000; // milliseconds

    let state = {
      playing: false,
      timeDiff: defaultTimeDiff,
      targetTime: new Date(now().getTime() + defaultTimeDiff),
    };

    play.onclick = (event) => {
      state = updateState(state, {
        playing: true,
        targetTime: new Date(now().getTime() + state.timeDiff),
      });
      return false;
    };

    pause.onclick = (event) => {
      state = updateState(state, {
        playing: false,
        timeDiff: state.targetTime - now().getTime(),
      });
      return false;
    };

    incrButtons.forEach((element, index, array) => {
      const minutes = Number(element.hash.slice(1));
      const milliseconds = minutes * 60 * 1000;
      element.onclick = (event) => {
        const timeDiff = state.timeDiff + milliseconds;
        state = updateState(state, {
          timeDiff,
          targetTime: new Date(now().getTime() + timeDiff),
        });
        timeEl.innerHTML = renderTimeEl(state);
      };
    });

    const loop = () => {
      state = updateState(state);
      timeEl.innerHTML = renderTimeEl(state);
    };

    loop();
    setInterval(loop, 1000);
  };

  setup();

}());
