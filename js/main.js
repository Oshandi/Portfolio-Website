//Vue component created for image of the slider
Vue.component('image-slide', {
  template: `
<transition
  v-bind:css="false"
  name="image-slide"
  mode="in-out"
  @enter="enter"
  @leave="leave"
>
  <slot></slot>
</transition>
`,
  data: () => ({
    anim: null
  }),
  methods: {
    enter (el, onComplete) {
      // console.log('Enter')
      onComplete()
      this.anim = anime({
        targets: el,
        translateY: ['100%', 0],
        easing: 'easeOutCubic',
        duration: 600,
        delay: 600
      })
      // this.anim.play
      // this.isImageLoaded (el.getAttribute('src'))
    },

    leave (el, onComplete) {
      anime({
        targets: el,
        translateY: [0, '-100%'],
        easing: 'easeOutSine',
        duration: 600,
        delay: 700,
        complete: onComplete
      })
    },

    isImageLoaded (src) {
      this.isLoaded = false
      var img = new Image()
      img.onload = () => {
        // the image is ready
        this.isLoaded = true
        // console.log('loaded')
        // this.anim.play
      }
      img.onerror = function () {
        // the image has failed
      }
      img.src = src
    }
  }
});

//Vue component created for text section of the slider
Vue.component('text-slide', {
  template: `
<transition
  :css="false"
  name="text-slide"
  mode="out-in"
  @enter="enter"
  @leave="leave"
>
  <slot></slot>
</transition>
`,
  data: () => ({
    anim: null
  }),
  methods: {
    enter (el, onComplete) {
      console.log('ENTER')
      let timeline = anime.timeline({ complete: onComplete })
      timeline.add({
        targets: [
          '.centered h2',
          '.centered h3',
          '.centered h6',
          '.centered h5',
          '.centered button'
        ],
        translateY: [250, 0],
        easing: 'easeOutSine',
        duration: 500,
        opacity: [0, 1],
        delay: (el, i, l) => i * 100
      })
      timeline.add({
        targets: '.paginator',
        translateX: [-50, 0],
        easing: 'easeOutSine',
        duration: 300,
        opacity: [0, 1],
        offset: 0
      })
    },

    leave (el, onComplete) {
      console.log('LEAVE')

      let timeline = anime.timeline({
        complete: onComplete
      })

      timeline.add({
        targets: [
          '.part.text h2',
          '.part.text h3',
          '.centered h6',
          '.centered h5',
          '.centered button'
        ],
        translateY: [0, -250],
        easing: 'easeInExpo',
        duration: 500,
        opacity: [1, 0],
        delay: (el, i, l) => i * 100
      })
      timeline.add({
        targets: '.paginator',
        translateX: [0, 120],
        easing: 'easeInExpo',
        duration: 300,
        opacity: [1, 0],
        offset: 0
      })
    }
  }
});

//Main Vue instance of the page
var app = new Vue({
  el: '#app',
  data: {
    isMobileMenuOpen: false,
    inMove: false,
    activeSection: 0,
    offsets: [],
    touchStartY: 0,
    activeColor:'',
    activeSlide: 0,
    activeTitle:'home',
    pageLoading: true,
    slides: [
      {
        title: 'HyperX portfolio website',
        description: 'Portfolio website custom tailored to a tech startup.',
        miniTitle: 'Technologies :',
        technology: 'html, bootstrap, jquery, php',
        image: '../img/work1.png',
        color: '#e66767'
      },
      {
        title: 'YMBA Kolonnawa',
        description: 'Re-designing the website implemented for Young Mens Buddhist Association based in Kolonnawa',
        miniTitle: 'Technologies :',
        technology: 'html, bootstrap, jquery',
        image: '../img/work2.png',
        color: '#353b48'
      },
      {
        title: 'Diyon Photography',
        description: 'Minimal photography website created as per clients request',
        miniTitle: 'Technologies :',
        technology: 'html, bootstrap, jquery, php',
        image: '../img/work3.png',
        color: '#e66767'
      }
    ]
  },
  computed: {
      //portfolio slider - return active slide
      activeItem () {
        return this.slides[this.activeSlide];
      },
      //portfolio slider - change image when moving onto next slide
      slideImage () {
        console.log(this.activeSlide);
        return {
          backgroundImage: `url("${this.slides[this.activeSlide].image}")`
        }
      },
      //portfolio slider - update button and miniTitle colors
      buttonColor () {
        return {
          backgroundColor: this.slides[this.activeSlide].color
        }
      },
      descriptionColor () {
        return {
          color: this.slides[this.activeSlide].color
        }
      }
  },
  methods: {
    //Preloader
    customPreloader () {
      //Waste 5 seconds
      setTimeout(() => {
         this.pageLoading = false;
      }, 200)
    },
    //portfolio slider - display next project slide
    nextSlide () {
      if (this.activeSlide >= this.slides.length - 1) {
        this.activeSlide = 0;
      } else {
        this.activeSlide++;
      }
    },
    //hamburger menu functionality
    showMobileMenu: function () {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
    },
    //calculate offsets to implement scroll
    calculateSectionOffsets() {
      let sections = document.getElementsByTagName('section');
      let length = sections.length;

      for(let i = 0; i < length; i++) {
        let sectionOffset = sections[i].offsetTop;
        this.offsets.push(sectionOffset);
      }
    },
    //handle mouse wheel even on scroll
    handleMouseWheel: function(e) {

      if (e.wheelDelta < 30 && !this.inMove) {
        this.moveUp();
      } else if (e.wheelDelta > 30 && !this.inMove) {
        this.moveDown();
      }

      e.preventDefault();
      return false;
    },
    handleMouseWheelDOM: function(e) {

      if (e.detail > 0 && !this.inMove) {
        this.moveUp();
      } else if (e.detail < 0 && !this.inMove) {
        this.moveDown();
      }

      return false;
    },
    moveDown() {
      this.inMove = true;
      this.activeSection--;

      if(this.activeSection < 0) this.activeSection = this.offsets.length - 1;

      this.scrollToSection(this.activeSection, true);
    },
    moveUp() {
      this.inMove = true;
      this.activeSection++;

      if(this.activeSection > this.offsets.length - 1) this.activeSection = 0;

      this.scrollToSection(this.activeSection, true);
    },
    //scroll to the selected section
    scrollToSection(id, force = false) {
      if(this.inMove && !force) return false;

      this.activeSection = id;
      this.inMove = true;

      //modify colors
      this.updateColors();

      document.getElementsByTagName('section')[id].scrollIntoView({behavior: 'smooth'});

      setTimeout(() => {
        this.inMove = false;
      }, 400);
    },
    touchStart(e) {
      e.preventDefault();

      this.touchStartY = e.touches[0].clientY;
    },
    touchMove(e) {
      if(this.inMove) return false;
      e.preventDefault();

      const currentY = e.touches[0].clientY;

      if(this.touchStartY < currentY) {
        this.moveDown();
      } else {
        this.moveUp();
      }

      this.touchStartY = 0;
      return false;
    },
    //method implemented to change fixed menu colors on scroll
    updateColors: function () {
      if ((this.activeSection == '0') || (this.activeSection == '2')) {
        this.activeColor = '#000';
        if (this.activeSection == '0') {
          this.activeTitle = 'home';
        }
        else if (this.activeSection == '2'){
          this.activeTitle = 'works';
        }
      }else if ((this.activeSection == '1') || (this.activeSection == '3')) {
        this.activeColor = '#e3e3e3';
        if (this.activeSection == '1'){
          this.activeTitle = 'about';
        }
        else if (this.activeSection == '3'){
          this.activeTitle = 'contact';
        }
      }
    },

  },
  //methods to be called on DOM creation
  created() {
    this.calculateSectionOffsets();

    window.addEventListener('DOMMouseScroll', this.handleMouseWheelDOM);  // Mozilla Firefox
    window.addEventListener('mousewheel', this.handleMouseWheel, { passive: false }); // Other browsers

    window.addEventListener('touchstart', this.touchStart, { passive: false }); // mobile devices
    window.addEventListener('touchmove', this.touchMove, { passive: false }); // mobile devices
  },
  mounted() {
    this.customPreloader();
  },
  destroyed() {
    window.removeEventListener('DOMMouseScroll', this.handleMouseWheelDOM); // Mozilla Firefox
    window.removeEventListener('mousewheel', this.handleMouseWheel, { passive: false });  // Other browsers

    window.removeEventListener('touchstart', this.touchStart); // mobile devices
    window.removeEventListener('touchmove', this.touchMove); // mobile devices
  }
});
