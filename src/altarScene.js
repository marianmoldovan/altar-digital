
function initScene() {  
  // colors array
  let colors = ["#E7C045", '#E37E05', '#F74000', '#7A946E', '#2C3143'];

  // camera, scene & renderer intial settings
  let boundary = 1000;
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 30000 );
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 1500;    

  // set camera orbit controls
  // let orbit = new THREE.OrbitControls( camera, renderer.domElement );
  // orbit.enableZoom = false;
  // orbit.minDistance = 500;
  // orbit.maxDistance = 2000;

  // set lights
  let light1 = new THREE.DirectionalLight(0xffffff, 1.5);
  light1.position.y = 10;
  scene.add(light1);

  let light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(-10,-10,10);
  scene.add(light2); 
  
  let light3 = new THREE.DirectionalLight(colors[0], 0.5);
  light3.position.set(-10,-50,10);
  scene.add(light3);  
  
  let light4 = new THREE.DirectionalLight(colors[1], 1.5);
  light4.position.set(50,-50,10);
  scene.add(light4);




  // set scene div and renderer
  let renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  const sceneCont  = document.getElementById('sceneCont');
  sceneCont.appendChild( renderer.domElement );

  let poseNet;

  let jamPlane;
  let planeGeom = new THREE.PlaneBufferGeometry( 1920, 1080, 2 );
  let planeMaterial = new THREE.MeshBasicMaterial( {
    // color: 0xffffff, 
    transparent: true,
    blending: THREE.AdditiveBlending

    // side: THREE.DoubleSide
  });

  // get video element (mp4) & disable display
  let vidCor = document.getElementById("vidCor");
  vidCor.disabled = true;

  // get video element (mp4) & disable display
  // let vidJam01 = document.getElementById("vidJam01");
  // vidJam01.disabled = true;
  // vidJam01.opacity = 0;





  // create video input for posenet
  const videoPos = document.createElement('video');
  // const testDiv  = document.getElementById('video-test');
  videoPos.setAttribute('width', 255);
  videoPos.setAttribute('height', 255);  
  videoPos.autoplay = true;

  // create new video element
  const videoOut = document.createElement('video');
  videoOut.setAttribute('width', 1920);
  videoOut.setAttribute('height', 1080);  
  videoOut.autoplay = true;

  // create video & webcam divs
  const vidDiv = document.getElementById('videoCont');
  const camDiv = document.getElementById('camVid');

  // camDiv.appendChild(vidCor);
  vidDiv.appendChild(vidCor);

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
  scene.add( grMovers );

  // initialise mouse attractors
  let mouse = new THREE.Vector2();
  let mouseMover = new Mover(Math.random()*boundary, boundary, 1000, 50, 15);
  let mouseMoverOp = new Mover(Math.random()*boundary, boundary, 1000, 50, 15);
  mouseMover.initialise();
  mouseMoverOp.initialise();
  function onDocumentMouseMove( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    // raycaster.setFromCamera( mouse.clone(), camera );   
    // raycaster.setFromCamera( mouse.clone(), camera );   
    mouseMover.position.x = THREE.Math.mapLinear( mouse.x, -1, 1, -boundary, boundary );
    mouseMover.position.y = THREE.Math.mapLinear( mouse.y, -1, 1, -boundary, boundary );

    mouseMoverOp.position.x = THREE.Math.mapLinear( mouse.x, -1, 1, boundary, -boundary );
    mouseMoverOp.position.y = THREE.Math.mapLinear( mouse.y, -1, 1, boundary, -boundary );
    // console.log(mouse.x,mouse.y)
    mouseMover.update();
    mouseMover.display();

    mouseMoverOp.update();
    mouseMoverOp.display();
  }
  document.addEventListener( 'mousemove', onDocumentMouseMove );

  // loadPosenet();


  // create particle sprites (geometry + texture + pMaterial + vectors)
  let cloud;
  let mouseCloud;
  let mouseGeom = new THREE.Geometry();
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
  for (let i = 0; i < 10000; i++) {
      let particle = new THREE.Vector3(THREE.Math.randInt(-boundary, boundary),THREE.Math.randInt(-boundary, boundary),THREE.Math.randInt(-boundary, boundary));
      // let particle = new THREE.Vector3(Math.random()*boundary, boundary/2, Math.random()*boundary+boundary/2);
      // let particle = new THREE.Vector3(Math.random()*boundary, boundary/2, Math.random()*boundary);
      mouseGeom.vertices.push(particle);
  }  
  for (let i = 0; i < 10000; i++) {
      // let particle = new THREE.Vector3(Math.random()*boundary, Math.random()*boundary, Math.random()*boundary+boundary/2);
      // let particle = new THREE.Vector3(Math.random()*boundary, Math.random()*boundary, Math.random()*boundary);
      let particle = new THREE.Vector3(THREE.Math.randInt(-boundary, boundary),THREE.Math.randInt(-boundary, boundary),THREE.Math.randInt(-boundary, boundary));
      geom.vertices.push(particle);
  }
  // create point cloud with stored vertices and material. Add to scene.
  mouseCloud = new THREE.Points(mouseGeom, pMaterial);
  cloud = new THREE.Points(geom, pMaterial);
  scene.add(mouseCloud);
  scene.add(cloud);

  // create new Cloud for particle physics system, initialise particle forces
  let cloudSystem = new Cloud(cloud);
  cloudSystem.initialise();

  let mouseCloudSystem = new Cloud(mouseCloud);
  mouseCloudSystem.initialise();

  // set other forces
  // let windLeft = new THREE.Vector3(-0.01,0.0,0.0);
  // let windRight = new THREE.Vector3(0.01,0.0,0.0);
  let windIn = new THREE.Vector3(0,0.0,-0.05);
  let windOut = new THREE.Vector3(0,0.0,0.05);
  let gravityUp = new THREE.Vector3(0.0,-0.01,0);
  let gravityDown = new THREE.Vector3(0.0,0.01,0);


  // petals settings
  let numPetals = 80;
  let petals = [];
  let petalsCont = new THREE.Object3D();
  let petalsMover;
  let petalPoints = [];
  for ( let i = 0; i < 10; i ++ ) {
    petalPoints.push( new THREE.Vector2( Math.sin( i * -0.2 ) * 30 + 5, ( i - 1 ) *  4) );
  }
  let petalGeom = new THREE.LatheGeometry( petalPoints );
  // create petal meshes
  createPetals();
  // let petalGeom = new THREE.BoxBufferGeometry(30,60,30);
  // let petalGeom = new THREE.SphereBufferGeometry(35,3,4);


  function loadPosenet() {
    console.log("loading posenet...");
    // ml5 posenet config
    const options = {
      // flipVertical: true,
      flipHorizontal: true,
      minConfidence: 0.5
    };
    // poseNet = ml5.poseNet(vidCor, options, modelReady);
    poseNet = ml5.poseNet(videoPos, options, modelReady);

    function modelReady() {
      console.log("posenet ready!");
      let posesAdded = false;

      if (!posesAdded) {
        for (let i = 0; i < 5; i++) {
          movers[i] = new Mover(THREE.Math.randInt(0, boundary), THREE.Math.randInt(-boundary, 0), 500, 50, 800);
          // movers[i] = new Mover(THREE.Math.randInt(-boundary, boundary), THREE.Math.randInt(-boundary, boundary), 0, 50, 500);
          // movers[i] = new Mover(Math.random()*boundary, boundary, 0, 50, 500);
          movers[i].initialise();
          movers[i].display();
        }
        posesAdded = true;
      }
      getPoses();
    }
  }


  function getPoses() {
    poseNet.on('pose', function (results) {
      poseNet.setMaxListeners(1);
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

          // let keyLeftElb = pose.keypoints[7];
          // movers[3].position.x = THREE.Math.mapLinear( keyLeftElb.position.x, 0, 255, -boundary, boundary );
          // movers[3].position.y = THREE.Math.mapLinear( keyLeftElb.position.y, 255, 0, -boundary, boundary );

          // let keyRightElb = pose.keypoints[8];
          // movers[4].position.x = THREE.Math.mapLinear( keyRightElb.position.x, 0, 255, -boundary, boundary );
          // movers[4].position.y = THREE.Math.mapLinear( keyRightElb.position.y, 255, 0, -boundary, boundary );  

          let keyLeftWrist = pose.keypoints[9];
          movers[3].position.x = THREE.Math.mapLinear( keyLeftWrist.position.x, 0, 255, -boundary, boundary );
          movers[3].position.y = THREE.Math.mapLinear( keyLeftWrist.position.y, 255, 0, -boundary, boundary );     
          
          let keyRightWrist = pose.keypoints[10];
          movers[4].position.x = THREE.Math.mapLinear( keyRightWrist.position.x, 0, 255, -boundary, boundary );
          movers[4].position.y = THREE.Math.mapLinear( keyRightWrist.position.y, 255, 0, -boundary, boundary );

          // let keyLeftHip = pose.keypoints[11];
          // movers[7].position.x = THREE.Math.mapLinear( keyLeftHip.position.x, 0, 255, -boundary, boundary );
          // movers[7].position.y = THREE.Math.mapLinear( keyLeftHip.position.y, 255, 0, -boundary, boundary );     
          
          // let keyRightHip = pose.keypoints[12];
          // movers[8].position.x = THREE.Math.mapLinear( keyRightHip.position.x, 0, 255, -boundary, boundary );
          // movers[8].position.y = THREE.Math.mapLinear( keyRightHip.position.y, 255, 0, -boundary, boundary );

          // let keyLeftKnee = pose.keypoints[13];
          // movers[9].position.x = THREE.Math.mapLinear( keyLeftKnee.position.x, 0, 255, -boundary, boundary );
          // movers[9].position.y = THREE.Math.mapLinear( keyLeftKnee.position.y, 255, 0, -boundary, boundary );     
          
          // let keyRightKnee = pose.keypoints[14];
          // movers[10].position.x = THREE.Math.mapLinear( keyRightKnee.position.x, 0, 255, -boundary, boundary );
          // movers[10].position.y = THREE.Math.mapLinear( keyRightKnee.position.y, 255, 0, -boundary, boundary );

          // let keyLeftAnkle = pose.keypoints[15];
          // movers[11].position.x = THREE.Math.mapLinear( keyLeftAnkle.position.x, 0, 255, -boundary, boundary );
          // movers[11].position.y = THREE.Math.mapLinear( keyLeftAnkle.position.y, 255, 0, -boundary, boundary );     
          
          // let keyRightAnkle = pose.keypoints[16];
          // movers[12].position.x = THREE.Math.mapLinear( keyRightAnkle.position.x, 0, 255, -boundary, boundary );
          // movers[12].position.y = THREE.Math.mapLinear( keyRightAnkle.position.y, 255, 0, -boundary, boundary );
        }
      }
    });
  }

  function mouseAttractOff() {
    mouseMover.mass = 0;
    mouseMoverOp.mass = 0;
    mouseMover.position.z = boundary*100;
    mouseMoverOp.position.z = boundary*100;
  }

 
  // loop render function
  let render = function () {
    // orbit.update();  

    // loop through all movers
    for (let i = 0; i < movers.length; i++) {
      if (movers[i]) {
        movers[i].update();
        movers[i].display();
      }

      // attract particle system to movers
      cloudSystem.attract(movers[i]);
      mouseCloudSystem.attract(movers[i]);
    }

    // apply forces to particle system and update vertices
    cloud.geometry.verticesNeedUpdate = true;
    cloudSystem.applyForce(gravityUp);
    cloudSystem.applyForce(gravityDown);
    cloudSystem.applyForce(windOut);
    cloudSystem.applyForce(windIn);

    mouseCloud.geometry.verticesNeedUpdate = true;
    mouseCloudSystem.applyForce(gravityUp);
    mouseCloudSystem.applyForce(gravityDown);
    mouseCloudSystem.applyForce(windOut);
    mouseCloudSystem.applyForce(windIn);

    if (partsOn && pMaterial.opacity < 1) {
      pMaterial.opacity +=0.01;
    } else if (!partsOn && pMaterial.opacity > 0) {
      pMaterial.opacity -= 0.1;
    }

    if(coreoOn) {
      mouseCloudSystem.attract(mouseMoverOp);
      cloudSystem.attract(mouseMover);
    }

    if (formOn) {
      loadPosenet();
      mouseAttractOff();
      formOn = false;
    }

    if (jamOn) {
      // pMaterial.sizeAttenuation = false;
      // pMaterial.color = "#508DBF";
      let webcamAdded = false;
      if (!webcamAdded) {
        camVid.appendChild(videoOut); // display video input
        camVid.style.opacity = 1;
        // vidCor.opacity = 0;
        // vidJam01.disabled = false;
        // vidJam01.opacity = 1;
        // vidDiv.appendChild(vidJam01);
        vidDiv.style.opacity = 0;
        webcamAdded = true;
      }
      console.log("jam trigger");
      if (partsOn && pMaterial.opacity < 1) {
        pMaterial.opacity += 0.1;
      }
    }

    if (jam01On) {
      let jam01Added = false;
      if (!jam01Added) {
        createPlane();
        let vidJam01Src = document.getElementById( 'vidJam01' );
        vidJam01Src.play();
        let jam01texture = new THREE.VideoTexture( vidJam01Src );
        // jam01texture.minFilter = THREE.LinearFilter;
        // jam01texture.magFilter = THREE.LinearFilter;
        jam01texture.format = THREE.RGBFormat;
        planeMaterial.map = jam01texture;
        // light1.color = 0x95C077;
        jam01Added = true;
      }
    }

    if (jam02On) {
      let jam02Added = false;
      if (!jam02Added) {
        let vidJam02Src = document.getElementById( 'vidJam02' );
        vidJam02Src.play();
        let jam02texture = new THREE.VideoTexture( vidJam02Src );
        // jam01texture.minFilter = THREE.LinearFilter;
        // jam01texture.magFilter = THREE.LinearFilter;
        jam02texture.format = THREE.RGBFormat;
        planeMaterial.map = jam02texture;
        // planeMaterial.color = "red";
        // light1.color = 0xBE74D4;
        jam02Added = true;
      }
    }


    if (jam03On) {
      let jam03Added = false;
      if (!jam03Added) {
        let vidJam03Src = document.getElementById( 'vidJam03' );
        vidJam03Src.play();
        let jam03texture = new THREE.VideoTexture( vidJam03Src );
        // jam01texture.minFilter = THREE.LinearFilter;
        // jam01texture.magFilter = THREE.LinearFilter;
        jam03texture.format = THREE.RGBFormat;
        planeMaterial.map = jam03texture;
        // planeMaterial.color = "red";
        // light1.color = 0xE3BF7A;
        jam03Added = true;
      }
    }



    if (transOn) {
      attractToPetals();
      let jam04Added = false;
      if (!jam04Added) {
        let vidJam04Src = document.getElementById( 'vidJam04' );
        vidJam04Src.play();
        let jam04texture = new THREE.VideoTexture( vidJam04Src );
        // jam01texture.minFilter = THREE.LinearFilter;
        // jam01texture.magFilter = THREE.LinearFilter;
        jam04texture.format = THREE.RGBFormat;
        planeMaterial.map = jam04texture;
        // planeMaterial.color = "red";
        jam04Added = true;
      }
    }

    if (altarOn) {
      planeMaterial.opacity = 0;
      // jamPlane.visible = false;
      // jamPlane.remove();
      camVid.style.opacity = 1;

      let petalsAdded = false;
      if (!petalsAdded) {
        scene.add(petalsCont);
        petalsAdded = true;
      }
      animatePetals();
    }

    mouseCloudSystem.update();
    mouseCloudSystem.checkEdges();

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
  
  // orbit.addEventListener('change', onPositionChange);
  
  // function onPositionChange(o) {
  //   console.log("position changed in object");
  //   console.log(camera.position.x, camera.position.y, camera.position.z);
  //   console.log(o);
  // }

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
          // let strength = (0.001*this.mass*this.mass)/(distance*distance);
          let strength = (0.5*this.mass*this.mass)/(distance*distance);
          force.multiplyScalar(strength);
          return force;
      }
  }

  function Cloud(cloudGroup) {
    this.vertices = cloudGroup.geometry.vertices;
    this.max = new THREE.Vector3(5,5,5);
    this.min = new THREE.Vector3(-5,-5,-5);
    this.velocities = [];
    this.accelerations = [];
    this.mass = 20;
    
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
        this.accelerations[i].multiplyScalar(0);
      }
    }

    this.checkEdges = function() {
      for (let i = 0; i < this.vertices.length; i++) {
        if (this.vertices[i].x > boundary){
            this.vertices[i].x = boundary;
            this.velocities[i].x *= -1;
        }
        else if (this.vertices[i].x < -boundary){
            this.vertices[i].x = -boundary;
            this.velocities[i].x *= -1;
        }

        if (this.vertices[i].y > boundary){
           this.vertices[i].y = boundary;
            this.velocities[i].y *= -1;
        }
        else if (this.vertices[i].y < -boundary/2){
          this.vertices[i].y = -boundary/2;
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
            let distance = Math.max(aForce.length()+15,15);
            aForce.normalize();
            let strength = 1*(this.mass*this.mass)/(distance*distance);
            aForce.multiplyScalar(strength);
            this.accelerations[i].add(aForce);
        }
      }
  }
  
  // define create and animate petals functions
  function createPetals() {
    // draw petals
    let petalMaterial =  new THREE.MeshPhongMaterial( { shininess: 15, flatShading: false, transparent: true, opacity: 0, color: colors[0], wireframe: false} );
    for (let i = 0; i < numPetals; i++) {    
      let petal = new THREE.Mesh(petalGeom, petalMaterial);
      petal.rotation.x = 10 * Math.sin(i);
      // petal.rotation.y = 10 * Math.cos(i);    
      petal.rotation.z = 10 * Math.cos(i);
      
      petal.speedX = 0;
      petal.speedY = 0;
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
    petalsCont.position.z = 1390;
    petalsCont.position.x = 0;
    petalsCont.position.y = 0;
    petalsMover = new Mover(boundary, boundary/1.1, boundary/1.1, 60, 1000);
    petalsMover.initialise();
  }
  function animatePetals() {
    for (let i = 0; i < numPetals; i++) {
      // petals[i].rotation.x += petals[i].speedX*1.2;
      // petals[i].rotation.y += petals[i].speedY*1.2;
      // petals[i].rotation.z += petals[i].speedZ*1.2;
      
      if ( petals[i].material.opacity < 1 ) {
        petals[i].material.opacity += 0.0005;
      }

    }
    petalsCont.rotation.y += 0.002*6;
  }

  function attractToPetals() {
    cloudSystem.attract(petalsMover);
    mouseCloudSystem.attract(petalsMover);
  }

  function createPlane() {
    jamPlane = new THREE.Mesh( planeGeom, planeMaterial );
    jamPlane.position.z = 800;
    // jamPlane.translate(0,0,5);
    scene.add( jamPlane );
  }
}



// once everything is loaded, run
window.onload = initScene;
