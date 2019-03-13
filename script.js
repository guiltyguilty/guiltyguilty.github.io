/**
 * Handle elements to be disturbed.
 * Author: Nico
 */
class MessageDisturbElement {
  /**
  * Initialize `MessageDisturb`.
  * @param {HTMLElement} element
  * @param {number} rate
  * @param {number} time
  * @param {string} alph
  */
  constructor(
    element,
    rate = 0.001,
    time = 100,
    alph = 'abcdefghijklmnopqrstuvwxyz@[]%&/ '
  ) {
    this.element = element;
    this.message = element.innerHTML;

    this.rate = rate;
    this.time = time;
    this.alph = alph;

    this.reset();
  }

  /**
    * Sample `n` out of `length`.
    * @param {number} n Sample length.
    * @param {number} length Total number of positions.
    * @return {Array<number>}
    */
  sample(n, length) {
    let perm = Array(length);
    for (let i = 0; i < length; i++) {
      perm[i] = i;
    }

    for (let i = 0; i < n; i++) {
      let idx = Math.floor(Math.random() * (length - i));
      let swap = perm[i];
      perm[i] = perm[idx];
      perm[idx] = swap;
    }

    return perm.slice(0, n);
  }

  /**
    * Disturb callback.
    */
  disturb() {
    let array = this.message.split('');
    let n = Math.floor(Math.random() * (array.length + 1));
    let sample = this.sample(n, array.length);

    for (let i = 0; i < sample.length; i++) {
      array[sample[i]] =
            this.alph[Math.floor(Math.random() * this.alph.length)];
    }

    this.element.innerHTML = array.join('');

    setTimeout(this.reset.bind(this), this.time);
  }

  /**
    * Reset message.
    */
  reset() {
    this.element.innerHTML = this.message;
  }
}

/**
 * Manages distrubed elements.
 */
class MessageDisturbService {
  /**
    * Initialize `DistrubService`.
    * @param {array<MessageDisturbElement>} elements
    */
  constructor(elements) {
    this.elements = elements;
    this.length = elements.length;
    this.rate = elements
        .map((e) => e.rate)
        .reduce((rate, r) => rate + r);
  }

  /**
    * Start `DisturbSercice` for elements with `className`.
    * @param {string} className
    * @return {MessageDisturbService}
    */
  static startDisturbService(className = 'disturb') {
    let elements = Array.from(
      document.getElementsByClassName(className)
    );
    let service = new MessageDisturbService(elements.map((e) =>
      new MessageDisturbElement(e)
    ));

    service.start();

    return (service);
  }

  /**
    * Start callbacks.
    */
  start() {
    setTimeout(this.disturb.bind(this), this.drawExp);
  }

  /**
    * Disturb callback.
    */
  disturb() {
    let idx = Math.floor(Math.random() * this.length);
    this.elements[idx].disturb();

    setTimeout(this.disturb.bind(this), this.drawExp());
  }

  /**
    * Draw from exponential distribution.
    * @return {number} Exponentially distributed random variable.
    */
  drawExp() {
    return -Math.log(Math.random()) / this.rate;
  }
}

MessageDisturbService.startDisturbService();

const body = document.getElementById('body-wrap');
const gifs = body.children;
let currentGif = 0;

function next() {
  gifs[currentGif].classList.add('hidden');
  currentGif = (currentGif + 1) % gifs.length;
  gifs[currentGif].classList.remove('hidden');
  console.log(gifs);
}

body.addEventListener('click', next);
console.log(document.body.children);
