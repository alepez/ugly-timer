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

  const reset = (state) => updateState(state, {
    playing: false,
    timeDiff: 0,
    targetTime: new Date(now().getTime())
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
    const timeText = document.getElementById('timer');
    const playBtn = document.getElementById('play');
    const pauseBtn = document.getElementById('pause');
    const resetBtn = document.getElementById('reset');
    const incrBtns = [...document.getElementsByClassName('incr-button')];

    const defaultTimeDiff = 60 * 90 * 1000; // milliseconds

    const defaultState = {
      playing: false,
      timeDiff: defaultTimeDiff,
      targetTime: new Date(now().getTime() + defaultTimeDiff).getTime(),
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
      timeText.innerHTML = renderTimeEl(state);
      loop();
      return false;
    };

    resetBtn.onclick = () => {
      state = reset(state);
      timeText.innerHTML = renderTimeEl(state);
      loop();
      return false;
    };

    incrBtns.forEach((element) => {
      const minutes = Number(element.hash.slice(1));
      const milliseconds = minutes * 60 * 1000;
      element.onclick = (event) => {
        state = incrementTime(state, milliseconds);
        timeText.innerHTML = renderTimeEl(state);
        loop();
        return false;
      };
    });

    const loop = () => {
      console.log(Math.random());
      timeText.innerHTML = renderTimeEl(state);
      timeText.classList.toggle('expired', isExpired(state));

      if (state.playing) {
        setTimeout(loop, 1000);
      }
    };

    loop();
  };

  setup();

}());
