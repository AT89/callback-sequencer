(function() {
  'use strict'; 

  function CallbackSequencer(config, callbacks) {
    let bpm = null,
        actx = null,
        playhead = null,
        past = null,
        future = null,
        count = null,
        sixteenth = null;

    function animate() {
      if (past >= future) {
        future = past + sixteenth;

        if (callbacks[playhead].length) {
          count = callbacks[playhead].length;
          while (count--) {
            callbacks[playhead][count]();
          }
        }

        playhead++;
        if (playhead > 15) { 
          playhead = 0; 
        } 
      } 

      past = actx.currentTime;
      requestAnimationFrame(animate);
    }

    function getPlayhead() {
      return playhead;
    }

    function setCallback(place, callback) {
      callbacks[place].push(callback);
    }

    function clearBeat(place) {
      callbacks[place].length = 0;
    }

    playhead = 0;

    actx = new AudioContext();

    callbacks = (config && config.callbacks) ? config.callbacks : [
      [], [], [], [],
      [], [], [], [],
      [], [], [], [],
      [], [], [], []
    ];

    bpm = (config && config.bpm) ? config.bpm : 120;
    sixteenth = ((60 / bpm) / 4);

    past = actx.currentTime;

    this.getPlayhead = getPlayhead;
    this.setCallback = setCallback;
    this.clearBeat = clearBeat;

    animate();
  }

  window.CallbackSequencer = CallbackSequencer;
})();
