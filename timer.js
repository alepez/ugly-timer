(function () {

  const pad = (a, b) => (1e15 + a + "").slice(-b)

  const formatSeconds = (s) => {
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s - (hours * 3600)) / 60);
    const seconds = s - hours * 3600 - minutes * 60;
    return pad(hours.toFixed(0), 2) + ":" + pad(minutes.toFixed(0), 2) + ":" + pad(seconds.toFixed(0), 2);
  }

  const updateState = (state) => {
    return state;
  };

  const render = (state) => {
    const now = new Date();
    const secondsToTarget = (state.targetTime - now.getTime()) / 1000;
    return formatSeconds(secondsToTarget);
  };

  const setup = () => {
    const root = document.getElementById('timer');

    const now = new Date();

    let state = {
      targetTime: new Date(now.getTime() + (60 * 90 * 1000))
    };

    setInterval(() => {
      state = updateState(state);
      root.innerHTML = render(state);
    }, 1000);
  };

  setup();

}());
