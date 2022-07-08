kaboom({
  global: true,
  scale: 2,
  fullscreen: true,
  clearColor: [0.4, 0.5, 0.9, 1],
});

loadRoot("./sprites/");
loadSprite("block", "block.png");
loadSprite("evil", "evil_mushroom.png");
loadSprite("coin", "coin.png");
loadSprite("mario", "mario.png");
loadSprite("mushroom", "mushroom.png");
loadSprite("pipe", "pipe_up.png");
loadSprite("surprise", "surprise.png");
loadSprite("dino", "dino.png");
loadSprite("star", "star.png");
loadSound("jump", "jumpSound.mp3");
loadSound("gameSound", "gameSound.mp3");
loadSprite("unboxed", "unboxed.png");
loadSprite("robot", "z.png");
loadSprite("heart", "heart.png");
let score = 0;
let hearts = 3;

scene("game", () => {
  play("gameSound");

  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                               ",
    "                                                               ",
    "                                                               ",
    "                                                               ",
    "                                                               ",
    "                                                               ",
    "                                    *                          ",
    "                                                               ",
    "                           cccccccccccccccccc                  ",
    "                           ==================                  ",
    "                                             = ccccc           ",
    "                                              =======          ",
    "                                                               ",
    "                                                               ",
    "                                                      ==       ",
    "                                               ======          ",
    "                                ccccc    ====                  ",
    "                                =====                          ",
    "     !     !      !        ==        cccc                      ",
    "                          ===        ====          ==        p ",
    "w     e     e     e      w===          w       d  w=w   d   w  ",
    "=============================          ========================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    w: [sprite("block"), solid(), "wall"],
    p: [sprite("pipe"), solid(), "pipe"],
    "!": [sprite("surprise"), solid(), "surprise_coin"],
    "*": [sprite("surprise"), solid(), "surprise_star"],
    m: [sprite("mushroom"), body(), solid(), "mushroom"],
    e: [sprite("evil"), solid(), body(), "evil"],
    c: [sprite("coin"), "coin"],
    d: [sprite("dino"), solid(), body(), "dino"],
    t: [sprite("star"), body(), "star"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    z: [sprite("robot"), solid(), "robot"],
  };

  const gamelevel = addLevel(map, mapSymbols);

  const scoreLabel = add([text("score: 0")]);

  const heartObj = add([sprite("heart"), text("   x" + hearts, 12)]);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  keyDown("d", () => {
    player.move(150, 0);
  });
  keyDown("a", () => {
    player.move(-150, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      player.jump(CURRENT_JUMP_FORCE);
      play("jump");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      gamelevel.spawn("u", obj.gridPos);
      gamelevel.spawn("c", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_star")) {
      destroy(obj);
      gamelevel.spawn("u", obj.gridPos);
      gamelevel.spawn("t", obj.gridPos.sub(0, 1));
    }
  });

  action("star", (obj) => {
    obj.move(20, 0);
  });

  action("mushroom", (obj) => {
    obj.move(10, 0);
  });

  player.collides("coin", (obj) => {
    destroy(obj);
    score += 100;
  });

  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(5);
  });

  player.collides("mushroom", (obj) => {
    destroy(obj);
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score : " + score;
    heartObj.text = "   x" + hearts;
    heartObj.pos = player.pos.sub(400, 170);
    if (player.pos.y > 800) {
      hearts--;
    }
    if (hearts <= 0) {
      go("lose");
    }
  });

  let e_speed = 100;
  action("evil", (obj) => {
    obj.move(e_speed, 0);
    obj.collides("wall", () => {
      e_speed = -e_speed;
    });
  });
  let f = 200;
  action("dino", (obj) => {
    obj.move(f, 0);
    obj.collides("wall", () => {
      f = -f;
    });
  });

  let lastGrounded = true;
  player.collides("evil", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });
  player.collides("dino", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });

  player.collides("pipe", (obj) => {
    keyDown("s", () => {
      go("level2");
    });
  });

  player.action(() => {
    lastGrounded = player.grounded();
  });

  // scene end
});

scene("level2", () => {
  play("gameSound");

  layers(["bg", "obj", "ui"], "obj");

  const map = [
    "                                                               ",
    "                                                               ",
    "                                                               ",
    "                                                               ",
    "                                                               ",
    "                                                               ",
    "                                    *                          ",
    "                                                               ",
    "                           cccccccccccccccccc                  ",
    "                           ==================                  ",
    "                                             = ccccc           ",
    "                                              =======          ",
    "                                                               ",
    "                                                               ",
    "                                               m       ==      ",
    "                                               ======          ",
    "                                ccccc    ====                  ",
    "                                =====                          ",
    "     !     !      !        ==        cccc                      ",
    "                          ===        ====          ==        p ",
    "w     e     e     e      w===          w       d  w=w   d   w  ",
    "=============================          ========================",
  ];

  const mapSymbols = {
    width: 20,
    height: 20,
    "=": [sprite("block"), solid(), "block"],
    w: [sprite("block"), solid(), "wall"],
    p: [sprite("pipe"), solid(), "pipe"],
    "!": [sprite("surprise"), solid(), "surprise_coin"],
    "*": [sprite("surprise"), solid(), "surprise_star"],
    m: [sprite("mushroom"), body(), solid(), "mushroom"],
    e: [sprite("evil"), solid(), body(), "evil"],
    c: [sprite("coin"), "coin"],
    d: [sprite("dino"), solid(), body(), "dino"],
    t: [sprite("star"), body(), "star"],
    u: [sprite("unboxed"), solid(), "unboxed"],
    z: [sprite("robot"), solid(), "robot"],
  };

  const gamelevel = addLevel(map, mapSymbols);

  const scoreLabel = add([text("score: 0")]);

  const heartObj = add([sprite("heart"), text("   x" + hearts, 12)]);

  const player = add([
    sprite("mario"),
    solid(),
    pos(30, 0),
    body(),
    origin("bot"),
    big(),
  ]);

  keyDown("d", () => {
    player.move(150, 0);
  });
  keyDown("a", () => {
    player.move(-150, 0);
  });
  keyDown("space", () => {
    if (player.grounded()) {
      player.jump(CURRENT_JUMP_FORCE);
      play("jump");
    }
  });

  player.on("headbump", (obj) => {
    if (obj.is("surprise_coin")) {
      destroy(obj);
      gamelevel.spawn("u", obj.gridPos);
      gamelevel.spawn("c", obj.gridPos.sub(0, 1));
    }
    if (obj.is("surprise_star")) {
      destroy(obj);
      gamelevel.spawn("u", obj.gridPos);
      gamelevel.spawn("t", obj.gridPos.sub(0, 1));
    }
  });

  action("star", (obj) => {
    obj.move(20, 0);
  });

  action("mushroom", (obj) => {
    obj.move(10, 0);
  });

  player.collides("coin", (obj) => {
    destroy(obj);
    score += 100;
  });

  player.collides("star", (obj) => {
    destroy(obj);
    player.biggify(5);
  });

  player.collides("mushroom", (obj) => {
    heart--;
  });

  player.action(() => {
    camPos(player.pos);
    scoreLabel.pos = player.pos.sub(400, 200);
    scoreLabel.text = "score : " + score;
    heartObj.text = "   x" + hearts;
    heartObj.pos = player.pos.sub(400, 170);
    if (player.pos.y > 800) {
      hearts--;
    }
    if (hearts <= 0) {
      go("lose");
    }
  });

  let e_speed = 100;
  action("evil", (obj) => {
    obj.move(e_speed, 0);
    obj.collides("wall", () => {
      e_speed = -e_speed;
    });
  });
  let f = 200;
  action("dino", (obj) => {
    obj.move(f, 0);
    obj.collides("wall", () => {
      f = -f;
    });
  });

  let lastGrounded = true;
  player.collides("evil", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });
  player.collides("dino", (obj) => {
    if (lastGrounded) {
      hearts--;
    } else {
      destroy(obj);
    }
  });
  player.collides("pipe", (obj) => {
    keyDown("s", () => {
      go("win");
    });
  });

  player.action(() => {
    lastGrounded = player.grounded();
  });
});

scene("lose", () => {
  hearts = 3;
  add([
    text("Game over\n round Lose:(", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);

  keyDown("space", () => {
    go("game");
  });
});

scene("win", () => {
  add([
    text("Game won:)", 64),
    origin("center"),
    pos(width() / 2, height() / 2),
  ]);
  keyDown("space", () => {
    go("game");
  });
});

start("level2");
