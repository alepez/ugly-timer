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

  const timeToTarget = (state) => state.playing ? (state.targetTime - now().getTime()) : state.timeDiff;

  const isExpired = (state) => timeToTarget < 0;

  const pad = (a, b) => (1e15 + a + "").slice(-b)

  const now = () => new Date();

  const formatSeconds = (sec) => {
    const sign = sec > 0 ? '+' : '-';
    const s = Math.abs(sec);
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s - (hours * 3600)) / 60);
    const seconds = s - hours * 3600 - minutes * 60;
    return sign + pad(hours.toFixed(0), 2) + ":" + pad(minutes.toFixed(0), 2) + ":" + pad(seconds.toFixed(0), 2);
  }

  const updateState = (state, update) => save(Object.assign({}, state, update));

  const renderTimeEl = (state) => {
    return formatSeconds(timeToTarget(state) / 1000);
  };

  const play = (state) => updateState(state, {
    playing: true,
    targetTime: new Date(now().getTime() + state.timeDiff).getTime(),
  });

  const pause = (state) => updateState(state, {
    playing: false,
    timeDiff: state.targetTime - now().getTime(),
  });

  const incrementTime = (state, milliseconds) => {
    const playing = state.playing;
    state = pause(state);
    const timeDiff = state.timeDiff + milliseconds;
    return updateState(state, {
      playing,
      timeDiff,
      targetTime: new Date(now().getTime() + timeDiff).getTime(),
    });
  };

  const setup = () => {
    const timeEl = document.getElementById('timer');
    const playEl = document.getElementById('play');
    const pauseEl = document.getElementById('pause');

    const incrButtons = [...document.getElementsByClassName('incr-button')];

    const defaultTimeDiff = 60 * 90 * 1000; // milliseconds

    const defaultState = {
      playing: false,
      timeDiff: defaultTimeDiff,
      targetTime: new Date(now().getTime() + defaultTimeDiff).getTime(),
    };

    const savedState = load();

    let state = Object.assign({}, defaultState, savedState);

    playEl.onclick = () => {
      state = play(state);
      return false;
    };

    pauseEl.onclick = () => {
      state = pause(state);
      return false;
    };

    incrButtons.forEach((element) => {
      const minutes = Number(element.hash.slice(1));
      const milliseconds = minutes * 60 * 1000;
      element.onclick = (event) => {
        state = incrementTime(state, milliseconds);
        timeEl.innerHTML = renderTimeEl(state);
      };
    });

    const loop = () => {
      if (state.playing) {
        timeEl.innerHTML = renderTimeEl(state);
        timeEl.classList.toggle('expired', isExpired(state));
      }
    };

    loop();
    setInterval(loop, 1000);
  };

  setup();

}());
