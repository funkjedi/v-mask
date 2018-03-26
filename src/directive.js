/* eslint-disable no-param-reassign */
import format from './format';
import { trigger } from './utils';
import { isAndroid, isChrome } from './utils/env';

const defer = (typeof requestAnimationFrame !== 'undefined') ? requestAnimationFrame : setTimeout;

/**
 * Event handler
 * @param {HTMLInputElement} el
 * @param {?String}          value
 * @param {?Event}           event
 */
function updateValue(el, value, event) {
  if (value === el.dataset.previousValue) {
    return;
  }

  el.value = format(value, el.dataset.mask);

  if (event) {
    event.target.value = el.value;
  }

  el.dataset.previousValue = value;
}

/**
 * Fires on handler update
 * @param {HTMLInputElement} el
 * @param {String}           mask
 */
function updateMask(el, mask) {
  // change format
  el.dataset.mask = mask;
}


/**
 * Vue directive definition
 */
export default {

  /**
   * Called only once, when the directive is first bound to the element.
   * This is where you can do one-time setup work.
   *
   * @param {HTMLInputElement} el
   * @param {?String}          value
   */
  bind(el, { value }) {
    updateMask(el, value);
    updateValue(el, value);

    el.addEventListener('input', event => updateValue(el, event.target.value, event));
  },

  /**
   * Called after the containing component has updated,
   * but possibly before its children have updated.
   * The directive’s value may or may not have changed,
   * but you can skip unnecessary updates by comparing the
   * binding’s current and old values.
   *
   * @param {HTMLInputElement} el
   * @param {?String}          value
   * @param {?String}          oldValue
   */
  componentUpdated(el, { value, oldValue }) {
    const isMaskChanged = value !== oldValue;

    // update mask first if changed
    if (isMaskChanged) {
      updateMask(el, value);
    }
  },
};
