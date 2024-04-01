var SCREEN_W = 320;
var SCREEN_H = 320;

phina.globalize();

phina.define('MyEmitter', {
  superClass: 'ProtonEmitter',
  init: function() {
    this.superInit({
      rate: new Proton.Rate(Proton.getSpan(10, 20), 0.2),
      initialize: [
        new Proton.Radius(1, 10),
        new Proton.Life(2, 4),
        new Proton.Velocity(1, Proton.getSpan(0, 360), 'polar')
      ],
      behaviour: [
        new Proton.Alpha(1, 0),
        new Proton.Color(['e91e63', '2196f3', 'ffeb3b']),
        new Proton.CrossZone(new Proton.RectZone(0, 0, SCREEN_W, SCREEN_H), 'bound')
      ]
    });
    this.setPosition(SCREEN_W/2, SCREEN_H/3).emit();

    var center = new Proton.Vector2D(SCREEN_W/2, SCREEN_H/2);
    this.behaviours = [
      new Proton.Attraction(center, 25, 150),
      new Proton.Collision(this.protonEmitter),
      new Proton.Force(30, 0),
      new Proton.Gravity(1),
      new Proton.GravityWell(center, 200),
      new Proton.RandomDrift(20, 0, .035),
      new Proton.Repulsion(center, 10, 150),
      new Proton.Scale(1, 3)
    ];
    
    this.index = 0;
    this.addBehaviour(this.behaviours[this.index]);
  },

  changeBehaviour: function() {
    this.removeBehaviour(this.behaviours[this.index]);
    this.index = ++this.index % 8;
    this.addBehaviour(this.behaviours[this.index]);
  }
});

phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function(options) {
    this.superInit(options);
    this.backgroundColor = '#f0f0f0';

    var protonLayer = ProtonLayer({
      width: SCREEN_W,
      height: SCREEN_H
    }).setPosition(SCREEN_W/2, SCREEN_H/2).addChildTo(this);

    var emitter = MyEmitter().addChildTo(protonLayer);

    this.setInteractive(true);
    this.on('pointstart', function() {
      emitter.changeBehaviour();
    });
    
    if (phina.isMobile()) {
      this.one('enterframe', function(e) {
        var scene = phina.game.PauseScene(options);
        scene.text.text = 'tap to start';
        e.app.pushScene(scene);
      });
    }
  }
});

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    width: SCREEN_W,
    height: SCREEN_H,
    fps: 60,
  });
  app.run();
});