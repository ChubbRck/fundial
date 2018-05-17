
//_________________________________________________________________world
Matter.World
Matter.World.addBody(world, body) → World
// create two boxes and a ground
var engine = Engine.create(document.body);
var boxA = Bodies.rectangle(400, 200, 80, 80);
var boxB = Bodies.rectangle(450, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
// add all of the bodies to the world
World.add(engine.world, [boxA, boxB, ground]);

world.gravity.x (default 0)
world.gravity.y (default 1)


//_________________________________________________________________renderer

//specify the canvas to render to
render = Matter.Render;
render.canvas = 
render.context =
render.options.height = 
render.options.width = 
Events.on(render, "afterRender", callback)
Events.on(render, "beforeRender", callback)

//_________________________________________________________________custom renderer




//_________________________________________________________________engine

var eng = Matter.Engine.create("#iframe_id");
//When you use Engine.create(element) a Matter.Render instance will be created for you and it will automatically insert a canvas into the page at the specified element.
//Following this calling Engine.run(engine) will spawn the built in game loop routine, which will automatically manage updating the engine and calling the renderer at the appropriate times.
Matter.Engine.run(eng);
Matter.Engine.update(engine, delta); //custom game loop delta is moving the sim forward x ms

Engine.create({
    render: {
        options: {
            width: 800,
            height: 600,
            background: '#fafafa',
            wireframeBackground: '#222',
            hasBounds: false,
            enabled: true,
            wireframes: true,
            showSleeping: true,
            showDebug: false,
            showBroadphase: false,
            showBounds: false,
            showVelocity: false,
            showCollisions: false,
            showAxes: false,
            showPositions: false,
            showAngleIndicator: false,
            showIds: false,
            showShadows: false
        }
    }
});

Events.on(engine, "collisionStart", callback)
//Fired after engine update, provides a list of all pairs that have started to collide in the current tick (if any)


//_________________________________________________________________body
Matter.Body
Matter.Body.create(options)
Matter.Body.applyForce(body, position, force)
Matter.Body.rotate(body, rotation)
Matter.Body.scale(body, scaleX, scaleY, [point])
Matter.Body.setMass(body, mass)
Matter.Body.setStatic(body, isStatic)
---
body.isStatic
body.isSleeping
body.label //An arbitrary String name to help the user identify and manage bodies.
body.mass
body.position
body.speed (magnitude) / body.velocity (obj)
body.type


//_________________________________________________________________bodies, creates a body
Matter.Bodies.circle(x, y, radius, [options], [maxSides]) → Body
Matter.Bodies.polygon(x, y, sides, radius, [options]) → Body (can make a triangle?)
Matter.Bodies.rectangle(x, y, width, height, [options]) → Body


//_________________________________________________________________events
Matter.Events.trigger(object, eventNames, event)












