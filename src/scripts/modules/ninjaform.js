/**
 * Ninja Form script.
 *
 * @author Maneuver
 *
 * Use this to parse the output of a Wordpress Ninja Form field into a
 * custom written HTML form.
 *
 * USAGE:
 *
 * var frmContact = new NinjaForm(form_id);
 * frmContact.parseIn('#id_of_target_form');
 *
 * Make sure the Ninja Form is outputted in twig like so:
 * <div class="hide">
 *  {{ fn('ninja_forms_display_form', form_id) }}
 * </div>
 *
 * And every field in your custom form must have a data attribute
 * with the corresponding field ID:
 *
 * <input data-field="field_id" class="form-control">
 *
 */

var $ = require('jquery')

/**
 * @TODO:
 * - Check for field errors.
 * - Take form settings into account. (ajax, ...)
 * - Move honey pot field. => Not neccesary I think cause it's for bots only.
 * - Think about accessibility and people who don't have javascript.
 **/

module.exports = NinjaForm

function NinjaForm (formId) {
  const self = this
  if (!(this instanceof NinjaForm)) return new NinjaForm(formId)
  self.form_id = formId
  self.$sourceForm = $('#ninja_forms_form_' + self.form_id)
}

NinjaForm.prototype.parseIn = function (targetForm) {
  let self = this
  let $sourceForm = self.$sourceForm
  let $targetForm = $(targetForm)

  if (!$targetForm.length || !$sourceForm.length) {
    return false
  }

  // Copy form attributes.
  $.each($sourceForm.get(0).attributes, function () {
    if (this.name === 'action') {
      this.value += ($targetForm.data('anchor') || '#' + $targetForm.attr('id'))
    }
    if (this.name !== 'class' && this.name !== 'id') {
      $targetForm.attr(this.name, this.value)
    }
  })

  // Move all hidden fields.
  var $hiddens = $sourceForm.find('input[type="hidden"]')
  $targetForm.prepend($hiddens)

  // Copy all fields.
  var $fields = $targetForm.find('[data-field]')
  $fields.each(function () {
    let $t = $(this)
    let isInput = $t.is(':input')
    let isLabel = $t.is('label')
    let sourceId = $t.data('field')
    let $sourceEl = $('#ninja_forms_field_' + sourceId + (isLabel ? '_label' : ''))

    if ($sourceEl.length) {
      $.each($sourceEl.get(0).attributes, function () {
        if (this.name !== 'class') {
          if (!$t.get(0).hasAttribute(this.name)) {
            $t.attr(this.name, this.value)
          }
        }
      })

      if (isLabel) {
        $t.html($sourceEl.html())
      }
      if (isInput) {
        switch (this.nodeName.toLowerCase()) {
          case 'select':
            // @TODO: clone all options.
            break
        }

        // Set initial value if available and if field is blank.
        if ($t.val() === '' && $t.data('value')) {
          $t.val($t.data('value'))
        }
      }
    } else {
      $t.hide()
    }

    // Clean up.
    $t.removeAttr('data-field')
  })

  // Check for response message.
  var $resp = $('#ninja_forms_form_' + self.form_id + '_response_msg')
  $targetForm.before($resp)

  // Check for no-display.
  if ($sourceForm.hasClass('ninja-forms-no-display')) {
    // The form has been submitted and is set to dissapear after.
    $targetForm.contents().hide()
    $('[data-hide-with-form="' + self.form_id + '"]').hide()
  }

  // Show form when parsing is done.
  $targetForm.removeClass('invisible')
  $targetForm.trigger('nfParseComplete')

  // Remove original form.
  $sourceForm.remove()
}

// NinjaForm.prototype.on = function(type, selector, callback){
//   var self = this;
//   if (typeof selector === 'undefined' && typeof callback === 'function') {
//     callback = selector;
//     selector = '';
//   }
//   console.debug(type, selector, callback);
//   self.$sourceForm.on(type, selector, callback);
// }
