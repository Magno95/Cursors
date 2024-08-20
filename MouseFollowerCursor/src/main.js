import './style.scss'
import './reset.scss'


import MouseFollower from "mouse-follower";
import gsap from "gsap";

MouseFollower.registerGSAP(gsap);
  
  const cursor = new MouseFollower({
    skewing: 3,
    stickDelta: 0.009,
    stateDetection:{
      '-pointer':'a,button',
      '-opaque': '[data-cursor-opaque]',
      '-active': '[data-cursor]'
    }
  });
  
  const btn = document.querySelector('#btn');
  btn.addEventListener('click', () => {
    btn.classList.toggle('active');
  });

