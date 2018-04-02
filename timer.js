(function () {

  const save = (state) => {
    const json = JSON.stringify(state);
    localStorage.setItem('jstimer', json);
    return state;
  };

  const load = (id) => {
    const json = localStorage.getItem('jstimer');
    const state = JSON.parse(json);
    return state;
  };

  const timeToTarget = (state) => state.playing ? (state.targetTime - now()) : state.timeDiff;

  const isExpired = (state) => timeToTarget(state) < 0;

  const isNearExpiration = (state) => timeToTarget(state) < 60000 && !isExpired(state);

  const padLeft = (a, b) => (1e15 + a + "").slice(-b)

  const now = () => new Date().getTime();

  const formatTime = (t) => {
    const sign = t > 0 ? '' : '-';
    const tt = Math.abs(t) / 1000;
    const seconds = tt % 60;
    const minutes = (((tt - seconds)) / 60) % 60;
    const hours = ((((tt - seconds)) / 60) - minutes) / 60
    const h = padLeft(hours.toFixed(0), 2);
    const m = padLeft(minutes.toFixed(0), 2);
    const s = padLeft(seconds.toFixed(0), 2);
    return `${sign}${h}:${m}:${s}`
  }

  const updateState = (state, update) => save(Object.assign({}, state, update));

  const renderTimeEl = (state) => {
    return formatTime(timeToTarget(state));
  };

  const play = (state) => updateState(state, {
    playing: true,
    targetTime: now() + state.timeDiff,
  });

  const pause = (state) => !state.playing ? state : updateState(state, {
    playing: false,
    timeDiff:  state.targetTime - now(),
  });

  const reset = (state) => state.playing ? state : updateState(state, {
    playing: false,
    timeDiff: 0,
    targetTime: now()
  });

  const incrementTime = (state, milliseconds) => {
    const playing = state.playing;
    state = pause(state);
    const timeDiff = state.timeDiff + milliseconds;
    return updateState(state, {
      playing,
      timeDiff,
      targetTime: now() + timeDiff,
    });
  };

  const setup = ({ root, timerText, playBtn, pauseBtn, resetBtn, incrBtns }) => {

    const defaultTimeDiff = 60 * 90 * 1000; // milliseconds

    const defaultState = {
      playing: false,
      timeDiff: defaultTimeDiff,
      targetTime: now() + defaultTimeDiff,
    };

    const savedState = load();

    let state = Object.assign({}, defaultState, savedState);

    playBtn.onclick = () => {
      state = play(state);
      loop();
      return false;
    };

    pauseBtn.onclick = () => {
      state = pause(state);
      loop();
      return false;
    };

    resetBtn.onclick = () => {
      state = reset(state);
      loop();
      return false;
    };

    incrBtns.forEach((element) => {
      const minutes = Number(element.hash.slice(1));
      const milliseconds = minutes * 60 * 1000;
      element.onclick = (event) => {
        state = incrementTime(state, milliseconds);
        loop();
        return false;
      };
    });

    const loop = () => {
      timerText.innerHTML = renderTimeEl(state);
      root.classList.toggle('expired', isExpired(state));
      root.classList.toggle('near-expiration', isNearExpiration(state));
      console.log(`Is expired: ${isExpired(state)}`);
    };

    loop();
    setInterval(loop, 100);
  };

  setup({
    root: document.getElementsByClassName('timer-root')[0],
    timerText: document.getElementsByClassName('timer-text')[0],
    playBtn: document.getElementsByClassName('play-btn')[0],
    pauseBtn: document.getElementsByClassName('pause-btn')[0],
    resetBtn: document.getElementsByClassName('reset-btn')[0],
    incrBtns: [...document.getElementsByClassName('incr-button')],
  });

}());
