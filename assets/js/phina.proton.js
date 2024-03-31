phina.define('phina.proton.ProtonLayer', {
  superClass: 'phina.display.Layer',
  init: function(options) {
    this.superInit(options);
    this.canvas = phina.graphics.Canvas();
    this.canvas.width  = this.width;
    this.canvas.height = this.height;
    this.domElement = this.canvas.domElement;

    this.proton = new Proton();
    this.renderer = new Proton.CanvasRenderer(this.domElement);
    this.proton.addRenderer(this.renderer);

    this.on('enterframe', function() {
      this.proton.update();
    });
  },

  addChild: function(children) {
    if (children.protonEmitter) {
      this.proton.addEmitter(children.protonEmitter);
    }
    return this.superMethod('addChild', children);
  },

  removeChild: function(children) {
    if (children.protonEmitter) {
      this.proton.removeEmitter(children.protonEmitter);
    }
    return this.superMethod('removeChild', children);
  },

  draw: function(canvas) {
    var image = this.domElement;
    canvas.context.drawImage(image,
      0, 0, image.width, image.height,
      -this.width*this.originX, -this.height*this.originY, this.width, this.height
      );
  }
});

phina.define('phina.proton.ProtonEmitter', {
  superClass: 'phina.display.DisplayElement',
  init: function(options) {
    options = (options || {});

    this.superInit(options);
    this.protonEmitter = new Proton.Emitter();

    if (options.rate) {
      this.protonEmitter.rate = options.rate;
    }
    if (options.initialize) {
      this.addInitialize(options.initialize);
    }
    if (options.behaviour) {
      this.addBehaviour(options.behaviour);
    }

    this.on('enterframe', this._syncEmitter);
  },

  emit: function(totalTime, life) {
    this._syncEmitter();
    this.protonEmitter.emit(totalTime, life);
    return this;
  },

  stop: function() {
    this.protonEmitter.stop();
    return this;
  },

  removeAllParticles: function() {
    this.protonEmitter.removeAllParticles();
    return this;
  },

  addInitialize: function(initialize) {
    var emitter = this.protonEmitter;
    emitter.addInitialize.apply(emitter, [].concat(initialize));
    return this;
  },

  removeInitialize: function(initialize) {
    this.protonEmitter.removeInitialize(initialize);
    return this;
  },

  removeAllInitializers: function() {
    this.protonEmitter.removeAllInitializers();
    return this;
  },

  addBehaviour: function(behaviour) {
    var emitter = this.protonEmitter;
    emitter.addBehaviour.apply(emitter, [].concat(behaviour));
    return this;
  },

  removeBehaviour: function(behaviour) {
    this.protonEmitter.removeBehaviour(behaviour);
    return this;
  },

  removeAllBehaviours: function() {
    this.protonEmitter.removeAllBehaviours();
    return this;
  },

  _syncEmitter: function() {
    this.protonEmitter.p.set(this.x, this.y);
    this.protonEmitter.rotation = this.rotation;
  },

  _accessor: {
    rate: {
      get: function()  { return this.protonEmitter.rate; },
      set: function(v) { this.protonEmitter.rate = v; }
    }
  }
});