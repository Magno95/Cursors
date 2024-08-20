import './style.scss'
import './reset.scss'



class SmoothedCursor {
 

  constructor(elem = undefined, position = undefined, hoverElemsSelector = undefined) {

    this.defaultSelector = '#cursor';
    this.hoverElemsSelector = hoverElemsSelector ? hoverElemsSelector : '[data-cursor-hover]';

    this.winSize = { width: window.innerWidth, height: window.innerHeight }
    this.sizes = { width: 0, height: 0 }
    
    this.position = position ? { x: position.x, y: position.y } : { x: window.innerWidth * .5, y: window.innerHeight * .5 }
    this.currentX=this.position.x;
    this.currentY=this.position.y;

    this.elem = elem;
    this.cursor = undefined;
    this.speed = 0.05;

    this.hoverElems = [];

    window.SmoothedCursor = this;
    
    this.init()
  }

  init() {
    if (this.elem) {
      if (typeof this.elem === 'string') {
        this.cursor = document.querySelector(this.elem);
        
      }else{
        this.cursor = this.elem;
      }
    }else{
      this.cursor = document.querySelector(this.defaultSelector);
    }
    
    if (!this.cursor){
      console.error('Cursor not found');
      return;
    } 
    
    this.sizes = { width: this.cursor.offsetWidth, height: this.cursor.offsetHeight }

    if (this.position) this.position = { x: this.position.x - this.sizes.width * .5, y: this.position.y - this.sizes.height * .5 }

    this.render();

    this.setHoverElems();

    this.events();

    this.setAnimation();
  }
  events() {
    window.addEventListener('mousemove', (e) => this.onMouseMove(e))

    if (this.hoverElems && this.hoverElems.length > 0) {
      this.hoverElems.forEach(elem => {
        elem.addEventListener('mouseenter', () => this.onHover(elem))
        elem.addEventListener('mouseleave', () => this.onLeave(elem))
      })
    }
    
  }
  onMouseMove(e) {
    // Adjusting position with cursor sizes 
    this.position = { x: e.clientX - this.sizes.width * .5, y: e.clientY - this.sizes.height * .5 }

   
  }
  render() {
    if (this.cursor && this.position) {
      this.currentX += (this.position.x - this.currentX)* this.speed;
      this.currentY +=(this.position.y - this.currentY)* this.speed;



      this.cursor.style.transform = `translate(${this.currentX}px, ${this.currentY}px)`
      requestAnimationFrame(() => this.render());
    }
  }

  setAnimation() {
    requestAnimationFrame(() => this.render());
  }

  setHoverElems() {
    this.hoverElems = document.querySelectorAll(this.hoverElemsSelector);
  }

  onHover(elem) {
    
    if (this.cursor){
      this.cursor.classList.add('data-cursor-active')
      this.cursor.classList.add(`data-cursor-type-${elem.dataset.cursorType}`)
    } 
  }

  onLeave(elem) {
    if (this.cursor){
      this.cursor.classList.remove('data-cursor-active')
      this.cursor.classList.remove(`data-cursor-type-${elem.dataset.cursorType}`)
    } 
  }
}

// If mobile device, don't use cursor
new SmoothedCursor()
