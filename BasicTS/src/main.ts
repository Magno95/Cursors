import './style.scss'
import './reset.scss'

declare global {
  interface Window {
    BasicCursor: any;
  }
}

type Position = {
  x: number
  y: number
} | null | undefined

type Elem = HTMLElement | string | null | undefined

type hoverElem = string | null | undefined

class BasicCursor {
  position: Position
  elem: Elem
  cursor: HTMLElement | undefined
  defaultSelector: string
  hoverElemsSelector: string
  winSize: { width: number, height: number }
  sizes: { width: number, height: number }

  hoverElems: HTMLElement[] | undefined

  constructor(elem:Elem = undefined, position: Position = undefined, hoverElemsSelector: hoverElem  = undefined) {

    this.defaultSelector = '#cursor';
    this.hoverElemsSelector = hoverElemsSelector ? hoverElemsSelector : '[data-cursor-hover]';

    this.winSize = { width: window.innerWidth, height: window.innerHeight }
    this.sizes = { width: 0, height: 0 }
    this.position = position ? { x: position.x, y: position.y } : { x: window.innerWidth * .5, y: window.innerHeight * .5 }
    this.elem = elem;
    this.cursor = undefined;

    this.hoverElems = [];

    window.BasicCursor = this;
    
    this.init()
  }

  init() {
    if (this.elem) {
      if (typeof this.elem === 'string') {
        this.cursor = document.querySelector(this.elem) as HTMLElement;
        
      }else{
        this.cursor = this.elem as HTMLElement
      }
    }else{
      this.cursor = document.querySelector(this.defaultSelector) as HTMLElement;
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
  onMouseMove(e: MouseEvent) {
    // Adjusting position with cursor sizes 
    this.position = { x: e.clientX - this.sizes.width * .5, y: e.clientY - this.sizes.height * .5 }

    this.render()
  }
  render() {
    if (this.cursor && this.position) {
      this.cursor.style.transform = `translate(${this.position.x}px, ${this.position.y}px)`
    }
  }

  setHoverElems() {
    this.hoverElems = document.querySelectorAll(this.hoverElemsSelector) as unknown as HTMLElement[]
  }

  onHover(elem: HTMLElement) {
    
    if (this.cursor){
      this.cursor.classList.add('data-cursor-active')
      this.cursor.classList.add(`data-cursor-type-${elem.dataset.cursorType}`)
    } 
  }

  onLeave(elem: HTMLElement) {
    if (this.cursor){
      this.cursor.classList.remove('data-cursor-active')
      this.cursor.classList.remove(`data-cursor-type-${elem.dataset.cursorType}`)
    } 
  }
}

// If mobile device, don't use cursor
new BasicCursor()
