"use strict";

const util = require("../util");
const AudioScheduledSourceNode = require("./AudioScheduledSourceNode");
const PeriodicWave = require("./PeriodicWave");
const OscillatorNodeDSP = require("./dsp/OscillatorNode");

const OscillatorTypes = PeriodicWave.BasicWaveForms;
const DefaultPeriodicWaves = {};

class OscillatorNode extends AudioScheduledSourceNode {
  /**
   * @param {AudioContext} context
   */
  constructor(context) {
    super(context);
    this._frequency = this.addParam("audio", 440);
    this._detune = this.addParam("audio", 0);
    this._type = "sine";
    this._periodicWave = this.buildPeriodicWave(this._type);
    this._waveTable = null;
    this.dspInit();
  }

  /**
   * @return {string}
   */
  getType() {
    return this._type;
  }

  /**
   * @param {string} value
   */
  setType(value) {
    /* istanbul ignore else */
    if (OscillatorTypes.indexOf(value) !== -1) {
      this._type = value;
      this._periodicWave = this.buildPeriodicWave(value);
      this._waveTable = this._periodicWave.getWaveTable();
    }
  }

  /**
   * @param {AudioParam}
   */
  getFrequency() {
    return this._frequency;
  }

  /**
   * @param {AudioParam}
   */
  getDetune() {
    return this._detune;
  }

  /**
   * @param {PeriodicWave} periodicWave
   */
  setPeriodicWave(periodicWave) {
    periodicWave = util.toImpl(periodicWave);

    /* istanbul ignore else */
    if (periodicWave instanceof PeriodicWave) {
      this._type = "custom";
      this._periodicWave = periodicWave;
      this._waveTable = this._periodicWave.getWaveTable();
    }
  }

  /**
   * @return {PeriodicWave}
   */
  getPeriodicWave() {
    return this._periodicWave;
  }

  /**
   * @param {string} type
   * @return {PeriodicWave}
   */
  buildPeriodicWave(type) {
    const sampleRate = this.context.sampleRate
    const key = type + ":" + sampleRate;

    /* istanbul ignore else */
    if (!DefaultPeriodicWaves[key]) {
      const periodicWave = new PeriodicWave({ sampleRate }, { constraints: false });

      periodicWave.generateBasicWaveform(type);

      DefaultPeriodicWaves[key] = periodicWave;
    }

    return DefaultPeriodicWaves[key];
  }
}

module.exports = util.mixin(OscillatorNode, OscillatorNodeDSP);
