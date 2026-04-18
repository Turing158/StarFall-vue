const DEFAULT_IMG_PATH = '/img/no-image.png';


export const imgErrorDirective = {
  mounted(el, binding) {
    const defaultImg = binding.value || DEFAULT_IMG_PATH;
    el.setAttribute('data-original-src', el.src);
    const handleError = () => {
      el.src = defaultImg;
      el.removeEventListener('error', handleError);
    };
    el.addEventListener('error', handleError);
    el._cleanup = () => {
      el.removeEventListener('error', handleError);
    };
  },
  
  updated(el, binding) {
    const defaultImg = binding.value || DEFAULT_IMG_PATH;
    if (el.src !== defaultImg && el.getAttribute('data-original-src') !== el.src) {
      if (el._cleanup) {
        el._cleanup();
      }
      const handleError = () => {
        el.src = defaultImg;
        el.removeEventListener('error', handleError);
      };
      el.addEventListener('error', handleError);
      el._cleanup = () => {
        el.removeEventListener('error', handleError);
      };
    }
  },
  unmounted(el) {
    if (el._cleanup) {
      el._cleanup();
    }
  }
};

export const imgErrorMixin = {
  mounted() {
    const images = document.querySelectorAll('img:not([v-img-error])');
    images.forEach(img => {
      const handleError = () => {
        img.src = DEFAULT_IMG_PATH;
        img.removeEventListener('error', handleError);
      };
      img.addEventListener('error', handleError);
    });
  }
};

export function registerImgErrorHandler(app) {
  app.directive('img-error', imgErrorDirective);
  app.mixin(imgErrorMixin);
}