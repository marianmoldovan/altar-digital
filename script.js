// once everything is loaded, run
function initScene() {

  // colors array
  let colors = ["#E7C045", '#E37E05', '#F74000', '#7A946E', '#2C3143'];

  // petals settings
  let numPetals = 150;
  let petals = [];
  let petalsCont = new THREE.Object3D();
  let petalGeom = new THREE.BoxBufferGeometry(30,60,30);

  // camera, scene & renderer intial settings
  let boundary = 1000;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 30000 );
  camera.position.x = boundary;
  camera.position.y = boundary;
  camera.position.z = 1100;    
  camera.position.x = boundary;
  camera.position.y = boundary;
  camera.position.z = 1100;  
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // set scene div and renderer
  const coreo  = document.getElementById('coreo');
  let renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  coreo.appendChild( renderer.domElement );

  // set camera controls
  let orbit = new THREE.OrbitControls( camera, renderer.domElement );
  orbit.enableZoom = false;
  orbit.minDistance = 500;
  orbit.maxDistance = 2000;

  // set lights
  let light1 = new THREE.DirectionalLight(0xffffff, 1.5);
  light1.position.y = 10;
  scene.add(light1);

  let light2 = new THREE.DirectionalLight(0xffffff, .5);
  light2.position.set(-10,-10,10);
  scene.add(light2); 
  
  let light3 = new THREE.DirectionalLight(colors[0], 0.5);
  light3.position.set(-10,-50,10);
  scene.add(light3);  
  
  let light4 = new THREE.DirectionalLight(colors[1], 1.5);
  light4.position.set(50,-50,10);
  scene.add(light4);

  // get video div & disable display
  let vidCor = document.getElementById("vidCor");
  vidCor.disabled = true;

  // create video input for posenet
  const videoPos = document.createElement('video');
  // const testDiv  = document.getElementById('video-test');
  videoPos.setAttribute('width', 255);
  videoPos.setAttribute('height', 255);  
  videoPos.autoplay = true;

  // create video & webcam divs
  const videoOut = document.createElement('video');
  const vidDiv = document.getElementById('video');
  const camDiv = document.getElementById('camVid');
  videoOut.setAttribute('width', 1920);
  videoOut.setAttribute('height', 1080);  
  videoOut.autoplay = true;
  camDiv.appendChild(vidCor);

  // stream webcam for posenet
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(function (stream) {
    videoPos.srcObject = stream;
  }).catch(function (err) {
    console.log("An error occurred! " + err);
  });
  
  // stream webcam for display
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: false
  }).then(function (stream) {
    videoOut.srcObject = stream;
  }).catch(function (err) {
    console.log("An error occurred! " + err);
  });

  // initialise mover attractors
  let movers = [];
  let grMovers = new THREE.Group();
  for (let i = 0; i < 13; i++) {
    movers[i] = new Mover(Math.random()*boundary, boundary, 0, 50, 500);
    movers[i].initialise();
    movers[i].display();
  }
  scene.add( grMovers );

  // initialise mouse attractor
  let mouse = new THREE.Vector2();
  let mouseMover = new Mover(Math.random()*boundary, boundary, 0, 100, 500);
  mouseMover.initialise();
  function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // raycaster.setFromCamera( mouse.clone(), camera );   
    mouseMover.position.x = THREE.Math.mapLinear( mouse.x, -1, 1, -boundary, boundary );
    mouseMover.position.y = THREE.Math.mapLinear( mouse.y, -1, 1, -boundary, boundary );
    // console.log(mouse.x,mouse.y)
    mouseMover.update();
    mouseMover.display();
  }
  document.addEventListener( 'mousemove', onDocumentMouseMove );


  // ml5 posenet config
  const options = {
    // flipVertical: true,
    flipHorizontal: true,
    minConfidence: 0.5
  };
  const poseNet = ml5.poseNet(videoPos, options, modelReady);

  function modelReady() {
    console.log("posenet ready!");
    getPoses();
  }

  function getPoses() {
    poseNet.on('pose', function (results) {
      poseNet.setMaxListeners(4);
      if (results[0]) {
        let pose = results[0].pose;

        if (pose.keypoints) {
          let keyNose = pose.keypoints[0];
          movers[0].position.x = THREE.Math.mapLinear( keyNose.position.x, 0, 255, -boundary, boundary );
          movers[0].position.y = THREE.Math.mapLinear( keyNose.position.y, 255, 0, -boundary, boundary );

          // let keyLeftEye = pose.keypoints[1];
          // movers[1].position.x = THREE.Math.mapLinear( keyLeftEye.position.x, 0, 255, -boundary, boundary );
          // movers[1].position.y = THREE.Math.mapLinear( keyLeftEye.position.y, 0, 255, -boundary, boundary );

          // let keyRightEye = pose.keypoints[2];
          // movers[2].position.x = THREE.Math.mapLinear( keyRightEye.position.x, 0, 255, -boundary, boundary );
          // movers[2].position.y = THREE.Math.mapLinear( keyRightEye.position.y, 0, 255, -boundary, boundary );

          let keyLeftSho = pose.keypoints[5];
          movers[1].position.x = THREE.Math.mapLinear( keyLeftSho.position.x, 0, 255, -boundary, boundary );
          movers[1].position.y = THREE.Math.mapLinear( keyLeftSho.position.y, 255, 0, -boundary, boundary );

          let keyRightSho = pose.keypoints[6];
          movers[2].position.x = THREE.Math.mapLinear( keyRightSho.position.x, 0, 255, -boundary, boundary );
          movers[2].position.y = THREE.Math.mapLinear( keyRightSho.position.y, 255, 0, -boundary, boundary );  

          let keyLeftElb = pose.keypoints[7];
          movers[3].position.x = THREE.Math.mapLinear( keyLeftElb.position.x, 0, 255, -boundary, boundary );
          movers[3].position.y = THREE.Math.mapLinear( keyLeftElb.position.y, 255, 0, -boundary, boundary );

          let keyRightElb = pose.keypoints[8];
          movers[4].position.x = THREE.Math.mapLinear( keyRightElb.position.x, 0, 255, -boundary, boundary );
          movers[4].position.y = THREE.Math.mapLinear( keyRightElb.position.y, 255, 0, -boundary, boundary );  

          let keyLeftWrist = pose.keypoints[9];
          movers[5].position.x = THREE.Math.mapLinear( keyLeftWrist.position.x, 0, 255, -boundary, boundary );
          movers[5].position.y = THREE.Math.mapLinear( keyLeftWrist.position.y, 255, 0, -boundary, boundary );     
          
          let keyRightWrist = pose.keypoints[10];
          movers[6].position.x = THREE.Math.mapLinear( keyRightWrist.position.x, 0, 255, -boundary, boundary );
          movers[6].position.y = THREE.Math.mapLinear( keyRightWrist.position.y, 255, 0, -boundary, boundary );

          let keyLeftHip = pose.keypoints[11];
          movers[7].position.x = THREE.Math.mapLinear( keyLeftHip.position.x, 0, 255, -boundary, boundary );
          movers[7].position.y = THREE.Math.mapLinear( keyLeftHip.position.y, 255, 0, -boundary, boundary );     
          
          let keyRightHip = pose.keypoints[12];
          movers[8].position.x = THREE.Math.mapLinear( keyRightHip.position.x, 0, 255, -boundary, boundary );
          movers[8].position.y = THREE.Math.mapLinear( keyRightHip.position.y, 255, 0, -boundary, boundary );

          let keyLeftKnee = pose.keypoints[13];
          movers[9].position.x = THREE.Math.mapLinear( keyLeftKnee.position.x, 0, 255, -boundary, boundary );
          movers[9].position.y = THREE.Math.mapLinear( keyLeftKnee.position.y, 255, 0, -boundary, boundary );     
          
          let keyRightKnee = pose.keypoints[14];
          movers[10].position.x = THREE.Math.mapLinear( keyRightKnee.position.x, 0, 255, -boundary, boundary );
          movers[10].position.y = THREE.Math.mapLinear( keyRightKnee.position.y, 255, 0, -boundary, boundary );

          let keyLeftAnkle = pose.keypoints[15];
          movers[11].position.x = THREE.Math.mapLinear( keyLeftAnkle.position.x, 0, 255, -boundary, boundary );
          movers[11].position.y = THREE.Math.mapLinear( keyLeftAnkle.position.y, 255, 0, -boundary, boundary );     
          
          let keyRightAnkle = pose.keypoints[16];
          movers[12].position.x = THREE.Math.mapLinear( keyRightAnkle.position.x, 0, 255, -boundary, boundary );
          movers[12].position.y = THREE.Math.mapLinear( keyRightAnkle.position.y, 255, 0, -boundary, boundary );
        }
      }
    });
  }

  // create petal meshes
  createPetals();

  // create particle sprites (geometry + texture + pMaterial + vectors)
  let cloud;
  let geom = new THREE.Geometry();
  let texture = new THREE.TextureLoader().load( "img/texture_particle_05.png" );
  let pMaterial = new THREE.PointsMaterial({
      size: 8,
      transparent: true,
      opacity: 0,
      map: texture,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      color: "#F9DF88"
  });
  for (let i = 0; i < 1000; i++) {
      let particle = new THREE.Vector3(Math.random()*boundary, boundary/2, Math.random()*boundary);
      geom.vertices.push(particle);
  }  
  for (let i = 0; i < 14000; i++) {
      let particle = new THREE.Vector3(Math.random()*boundary, Math.random()*boundary, Math.random()*boundary);
      geom.vertices.push(particle);
  }
  // create point cloud with stored vertices and material. Add to scene.
  cloud = new THREE.Points(geom, pMaterial);
  scene.add(cloud);

  // create new Cloud for particle physics system, initialise particle forces
  let cloudSystem = new Cloud(cloud);
  cloudSystem.initialise();

  // set other forces
  // let wind = new THREE.Vector3(0.1,0.0,0.0);
  let gravity = new THREE.Vector3(0.0,0.1,0);

  // loop render function
  let render = function () {
    getPoses();
    orbit.update();  

    // loop through all movers
    for (let i = 0; i < movers.length; i++) {

      if (movers[i]) {
        movers[i].update();
        movers[i].display();
      }

      // for every mover, calculate and apply attraction force to others
      // for (let j = 0; j < movers.length; j++) {
      //   if (i !== j) {
      //     // let force = movers[j].calculateAttraction(movers[i]);
      //     // console.log(force);
      //     // movers[i].applyForce(force);
      //   }
      // }

      // apply net forces and update position
      // movers[i].applyForce(gravity);
      // movers[i].checkEdges();

      // attract particle system to movers
      cloudSystem.attract(movers[i]);
      // cloudSystem.attract(mouseMover);
    }

    // apply forces to particle system and update vertices
    cloud.geometry.verticesNeedUpdate = true;
    cloudSystem.applyForce(gravity);

    if (partsOn && pMaterial.opacity < 1) {
      pMaterial.opacity +=0.01;
    } else if (!partsOn && pMaterial.opacity > 0) {
      pMaterial.opacity -= 0.1;
      // camera.z -= 10; 
    }

    if (jamOn) {
      // pMaterial.sizeAttenuation = false;
      // pMaterial.color = "#508DBF";
      vidDiv.appendChild(videoOut); // display video input
      vidDiv.style.opacity = 1;
      camVid.style.opacity = 0;
      console.log("jam trigger");
      if (partsOn && pMaterial.opacity < 1) {
        pMaterial.opacity += 0.1;
      }
    }

    if (transOn) {
      attractToPetals();
    }

    if (altarOn) {
      vidDiv.style.opacity = 1;
      scene.add(petalsCont);
      animatePetals();
      // if (pMaterial.opacity < 0) {
      //   pMaterial.opacity += 0.1;
      // }
    }

    cloudSystem.update();
    cloudSystem.checkEdges();
    requestAnimationFrame( render );
    renderer.render( scene, camera );
  };

  // threejs window resize function
  window.addEventListener( 'resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize( window.innerWidth, window.innerHeight );
  }, false );
  
  render();
  orbit.addEventListener('change', onPositionChange);
  

  function onPositionChange(o) {
    console.log("position changed in object");
    console.log(camera.position.x, camera.position.y, camera.position.z);
    console.log(o);
  }

  function Mover(x,y,z,r,m) {
      this.x = x;
      this.y = y;
      this.z = z;
      this.r = r;
      this.mass = m;
      // set max/min velocity
      this.max = new THREE.Vector3(30,30,30);
      this.min = new THREE.Vector3(-30,-30,-30);

      // create particle mesh (geometry + material)
      let geometry = new THREE.SphereGeometry(this.r,3,3);

      // let material =  new THREE.MeshPhongMaterial( { shininess: 5, flatShading: false, color: colors[0]} );
      let material =  new THREE.MeshToonMaterial( { flatShading: false, color: colors[0], transparent: true, opacity: 0 } );

      let sphere = new THREE.Mesh(geometry, material);
      grMovers.add(sphere);

      this.initialise = function() {
          this.position = new THREE.Vector3(this.x,this.y,this.z);
          this.velocity = new THREE.Vector3();
          this.acceleration = new THREE.Vector3();              
      }

      this.display = function(){
          sphere.position.x = this.position.x;
          sphere.position.y = this.position.y;
          sphere.position.z = this.position.z;
          // console.log(sphere.position);
      }

      this.applyForce = function(force){
          let tempForce = force.clone();
          let f = tempForce.divideScalar(this.mass);
          this.acceleration.add(f);
      }

      this.update = function() {
          this.velocity.add(this.acceleration);
          this.velocity.clamp(this.min, this.max);
          this.position.add(this.velocity);
          this.acceleration.multiplyScalar(0);
      }

      this.checkEdges = function() {
          if (this.position.x > boundary){
              this.position.x = boundary;
              this.velocity.x *= -1;
          }
          else if (this.position.x < 0){
              this.position.x = 0;
              this.velocity.x *= -1;
          }

          if (this.position.y > boundary){
              this.position.y = boundary;
              this.velocity.y *= -1;
          }
          else if (this.position.y < 0){
              this.position.y = 0;
              this.velocity.y *= -1;
          }

          if (this.position.z > boundary){
              this.position.z = boundary;
              this.velocity.z *= -1;
          }
          else if (this.position.z < 0){
              this.position.z = 0;
              this.velocity.z *= -1;
          }                      
      }

      this.calculateAttraction = function(m) {
          let tempPos = this.position.clone();
          let force = tempPos.sub(m.position);
          let distance = Math.max(force.length()+25,25);
          // let distance = force.length();
          force.normalize();
          let strength = (0.5*this.mass*this.mass)/(distance*distance);
          // let strength = (0.5*this.mass*this.mass)/(distance*distance);
          force.multiplyScalar(strength);
          return force;
      }

      // this.animateRandom = function() {
      //   for (let i = 0; i < geometry.vertices.length; i++) {
      //     let v = geometry.vertices[i];
      //     let newX = originalPositions[i][0] + Math.random() * 0.2 - 0.1;
      //     let newY = originalPositions[i][1] + Math.random() * 0.2 - 0.1;
      //     let newZ = originalPositions[i][2] + Math.random() * 0.3 - 0.1;
      
      //     // TweenLite.to(v, .8, {x: newX, y: newY, z: newZ, ease: SteppedEase.config(50)})
      //     TweenLite.to(v, 2.8, {x: newX, y: newY, z: newZ, ease: Sine.easeInOut})
      //   }
      // }
  }

  function Cloud(cloudGroup) {
    this.vertices = cloudGroup.geometry.vertices;
    this.max = new THREE.Vector3(10,10,10);
    this.min = new THREE.Vector3(-10,-10,-10);
    this.velocities = [];
    this.accelerations = [];
    this.mass = 10;
    
    this.initialise = function() {
      for (let i = 0; i < this.vertices.length; i++) {
        let velocity = new THREE.Vector3();
        this.velocities.push(velocity);
        let acceleration = new THREE.Vector3();  
        this.accelerations.push(acceleration);
      }            
    }

    this.applyForce = function(force) {
      let tempForce = force.clone();
      let f = tempForce.divideScalar(this.mass);
      for (let i = 0; i < this.vertices.length; i++) {
        this.accelerations[i].add(f);
      }
    }

    this.update = function() {
      for (let i = 0; i < this.vertices.length; i++) {
        this.velocities[i].add(this.accelerations[i]);
        this.velocities[i].clamp(this.min, this.max);
        this.vertices[i].add(this.velocities[i]);
        // this.positions[i].add(this.velocities[i]);
        this.accelerations[i].multiplyScalar(0);
      }
    }

    this.checkEdges = function() {
      for (let i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].x > boundary){
            this.vertices[i].x = boundary;
            this.velocities[i].x *= -1;
        }
        else if (this.vertices[i].x < 0){
            this.vertices[i].x = 0;
            this.velocities[i].x *= -1;
        }

        if (this.vertices[i].y > boundary){
           this.vertices[i].y = boundary;
            this.velocities[i].y *= -1;
        }
        else if (this.vertices[i].y < 0){
          this.vertices[i].y = 0;
          this.velocities[i].y *= -1;
        }

        if (this.vertices[i].z > boundary){
          this.vertices[i].z = boundary;
          this.velocities[i].z *= -1;
        }
        else if (this.vertices[i].z < 0){
          this.vertices[i].z = 0;
          this.velocities[i].z *= -1;
        }                      
      }
    }
        
    this.attract = function(m) {
      for (let i = 0; i < this.vertices.length; i++) {
            let tempVert = this.vertices[i].clone();
            let tempPos = m.position.clone();
            let aForce = tempPos.sub(tempVert);
            // let distance = Math.max(aForce.length()+25,25);
            let distance = Math.max(aForce.length()+25,boundary/2);
            aForce.normalize();
            let strength = 150*(this.mass*this.mass)/(distance*distance);
            aForce.multiplyScalar(strength);
            this.accelerations[i].add(aForce);
        }
      }
  }
  
  // define create and animate petals functions
  function createPetals() {
    // draw petals
    let petalMaterial =  new THREE.MeshPhongMaterial( { shininess: 0, flatShading: false, transparent: true, opacity: 0, color: colors[0]} );
    for (let i = 0; i < numPetals; i++) {    
      let petal = new THREE.Mesh(petalGeom, petalMaterial);
      petal.rotation.x = 10 * Math.sin(i);
      petal.rotation.y = 10 * Math.cos(i);    
      // petal.rotation.x = Math.random() * Math.PI;
      // petal.rotation.y = Math.random() * Math.PI;
      petal.rotation.z = Math.random() * Math.PI;
      // petal.rotation.z = 10 * Math.cos(i);
      
      petal.speedX = 0.001 ;
      petal.speedY = 0.001 ;
      petal.speedZ = 0.001;    
      // petal.speedX = Math.random() * 0.001 - 0.0001;
      // petal.speedY = Math.random() * 0.001 - 0.0001;
      // petal.speedZ = Math.random() * 0.001 - 0.0001;
      petal.castShadow = true;
      petal.receiveShadow = true;
      petal.material.opacity = 0;
      
      petals.push(petal);
      petalsCont.add(petal);
    }
    petalsCont.position.z = boundary;
    petalsCont.position.x = boundary/1.1;
    petalsCont.position.y = boundary/1.1;
  }
  function animatePetals() {
    for (let i = 0; i < numPetals; i++) {
      petals[i].rotation.x += petals[i].speedX*1.2;
      petals[i].rotation.y += petals[i].speedY*1.2;
      petals[i].rotation.z += petals[i].speedZ*1.2;
      
      if ( petals[i].material.opacity < 1 ) {
        petals[i].material.opacity += 0.0005;
      }

    }
    petalsCont.rotation.y += 0.002*6;
  }

  function attractToPetals() {
    let petalsMover = new Mover(boundary, boundary/1.1, boundary/1.1, 60, 1000);
    petalsMover.initialise();
    // for (let i = 0; i < movers.length; i++){
    //   movers[i].position.x = boundary;
    //   movers[i].position.y = boundary/1.1;
    //   movers[i].position.z = boundary/1.1;
    // }
    cloudSystem.attract(petalsMover);
  }
}


window.onload = initScene;
